import * as THREE from "three";
import GUI from "lil-gui";
import { createKeys, type KeyState } from "./keys";

type Update = (dt: number, elapsed: number) => void;
type Resize = (width: number, height: number) => void;

// Everything a feature is allowed to touch. Anything registered here is cleaned up on dispose.
export type FeatureContext = {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  readonly keys: KeyState;
  readonly gui: GUI; // a folder named after the feature (hidden if left empty)
  readonly camera: THREE.Camera;
  setCamera(camera: THREE.Camera): void;
  add(...objects: THREE.Object3D[]): void; // scene.add + removed on dispose
  onUpdate(fn: Update): void; // runs every frame, in the order features were used
  onLateUpdate(fn: Update): void; // runs after every onUpdate: cameras, followers, HUDs
  onResize(fn: Resize): void; // canvas size in CSS pixels
  onDispose(fn: () => void): void;
};

// A feature is a named setup function. Whatever setup returns is handed back by sandbox.use(),
// which is how a demo wires features together (e.g. give the shadow the capsule to follow).
export type Feature<API = void> = {
  name: string;
  setup(ctx: FeatureContext): API;
};

export const defineFeature = <API = void>(feature: Feature<API>) => feature;

export type Sandbox = {
  use<API>(feature: Feature<API>): API;
  start(): void;
  dispose(): void;
};

// A ready-made combination of a environment and features
export type Demo = (sandbox: Sandbox) => void;

export const createSandbox = (canvas: HTMLCanvasElement): Sandbox => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const gui = new GUI({ title: "Sandbox" });
  const keys = createKeys();
  const timer = new THREE.Timer();
  timer.connect(document);

  // Used until a environment calls setCamera
  let camera: THREE.Camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
  camera.position.set(0, 2, 5);
  let forceResize = true;

  const updates: Update[] = [];
  const lateUpdates: Update[] = [];
  const resizes: Resize[] = [];
  const disposers: (() => void)[] = [];

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    if (renderer.getPixelRatio() !== pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
      forceResize = true;
    }
    // canvas.width/height are in device pixels, so compare against the scaled CSS size
    const sizeChanged =
      canvas.width !== Math.floor(width * pixelRatio) ||
      canvas.height !== Math.floor(height * pixelRatio);
    if (!sizeChanged && !forceResize) return;
    forceResize = false;

    renderer.setSize(width, height, false);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    for (const fn of resizes) fn(width, height);
  };

  const frame = () => {
    timer.update();
    const dt = timer.getDelta();
    const elapsed = timer.getElapsed();
    resize();
    for (const fn of updates) fn(dt, elapsed);
    for (const fn of lateUpdates) fn(dt, elapsed);
    renderer.render(scene, camera);
  };

  const use = <API>(feature: Feature<API>): API => {
    const folder = gui.addFolder(feature.name);
    disposers.push(() => folder.destroy());

    const ctx: FeatureContext = {
      scene,
      renderer,
      canvas,
      keys,
      gui: folder,
      get camera() {
        return camera;
      },
      setCamera(next) {
        camera = next;
        forceResize = true;
      },
      add(...objects) {
        scene.add(...objects);
        disposers.push(() => scene.remove(...objects));
      },
      onUpdate: (fn) => void updates.push(fn),
      onLateUpdate: (fn) => void lateUpdates.push(fn),
      onResize: (fn) => {
        resizes.push(fn);
        forceResize = true;
      },
      onDispose: (fn) => void disposers.push(fn),
    };

    const api = feature.setup(ctx);
    if (folder.controllers.length === 0 && folder.folders.length === 0) folder.hide();
    return api;
  };

  return {
    use,
    start: () => renderer.setAnimationLoop(frame),
    dispose() {
      renderer.setAnimationLoop(null);
      for (const fn of disposers.reverse()) fn();
      disposers.length = updates.length = lateUpdates.length = resizes.length = 0;
      keys.dispose();
      timer.dispose();
      gui.destroy();
      renderer.dispose();
    },
  };
};
