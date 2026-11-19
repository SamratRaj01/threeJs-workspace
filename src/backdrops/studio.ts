import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { defineFeature } from "../engine/sandbox";
import { loadTexture } from "../engine/assets";
import cobbleDiff from "../../static/textures/cobble/grassy_cobblestone_diff_1k.jpg";

// The original starter look: cobblestone floor, three tunable lights, real shadows, helpers
export const studioBackdrop = () =>
  defineFeature({
    name: "Studio Backdrop",
    setup(ctx) {
      const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
      camera.position.z = 2;
      ctx.setCamera(camera);

      const controls = new OrbitControls(camera, ctx.canvas);
      controls.enableDamping = true;
      ctx.onLateUpdate(() => controls.update());

      const cameraFolder = ctx.gui.addFolder("Camera");
      cameraFolder.add(camera.position, "x").min(-3).max(3).step(0.001).name("X");
      cameraFolder.add(camera.position, "y").min(-3).max(3).step(0.001).name("Y");
      cameraFolder.add(camera.position, "z").min(-3).max(3).step(0.001).name("Z");

      // Lights
      const ambientLight = new THREE.AmbientLight("white", 1);
      const hemisphereLight = new THREE.HemisphereLight("white", "green", 1);
      const directionalLight = new THREE.DirectionalLight("white", 2);
      directionalLight.position.set(2, 2, 2);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.far = 10;
      directionalLight.shadow.mapSize.set(2048, 2048);

      const lightsFolder = ctx.gui.addFolder("Lights");
      lightsFolder.add(ambientLight, "intensity").min(0).max(5).step(0.01).name("Ambient");
      lightsFolder.add(hemisphereLight, "intensity").min(0).max(10).step(0.01).name("Hemisphere");
      lightsFolder.add(directionalLight, "intensity").min(0).max(10).step(0.01).name("Directional");
      lightsFolder
        .add(directionalLight.shadow.mapSize, "x", [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048])
        .name("Shadow Map Resolution")
        .onChange((v: number) => {
          directionalLight.shadow.mapSize.y = v;
          directionalLight.shadow.map?.dispose();
          directionalLight.shadow.map = null;
        });

      // Floor
      const floorTexture = loadTexture(cobbleDiff, { color: true });
      floorTexture.repeat.set(8, 8);
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        displacementMap: floorTexture,
        displacementScale: 1.2,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 20), floorMaterial);
      floor.rotation.x = Math.PI / 2;
      floor.position.y = -2;
      floor.receiveShadow = true;

      // Helpers
      const helpers = new THREE.Group();
      helpers.add(
        new THREE.AxesHelper(),
        new THREE.HemisphereLightHelper(hemisphereLight, 0.1),
        new THREE.DirectionalLightHelper(directionalLight, 0.3),
        new THREE.CameraHelper(directionalLight.shadow.camera)
      );
      ctx.gui.add(helpers, "visible").name("Helpers");

      ctx.add(ambientLight, hemisphereLight, directionalLight, floor, helpers);

      ctx.onDispose(() => {
        controls.dispose();
        floor.geometry.dispose();
        floorMaterial.dispose();
        floorTexture.dispose();
        for (const helper of helpers.children) (helper as THREE.Object3D & { dispose(): void }).dispose();
      });

      return { camera, controls, directionalLight };
    },
  });
