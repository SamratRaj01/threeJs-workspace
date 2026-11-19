import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { defineFeature } from "../engine/sandbox";

// Neutral place to look at one feature on its own: orbit camera, grid, simple lights
export const basicBackdrop = ({ background = "#1e2124" } = {}) =>
  defineFeature({
    name: "Backdrop",
    setup(ctx) {
      const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 200);
      camera.position.set(3, 3, 5);
      ctx.setCamera(camera);

      const controls = new OrbitControls(camera, ctx.canvas);
      controls.enableDamping = true;
      ctx.onLateUpdate(() => controls.update());

      const grid = new THREE.GridHelper(20, 20, "#555", "#333");
      const axes = new THREE.AxesHelper(1);
      const ambient = new THREE.AmbientLight("white", 0.6);
      const sun = new THREE.DirectionalLight("white", 2);
      sun.position.set(3, 5, 2);
      sun.castShadow = true;
      ctx.add(grid, axes, ambient, sun);

      const previousBackground = ctx.scene.background;
      ctx.scene.background = new THREE.Color(background);

      // Soft studio reflections so glass/metal/physical materials look right out of the box
      const pmrem = new THREE.PMREMGenerator(ctx.renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, 0.04).texture;
      const previousEnvironment = ctx.scene.environment;
      ctx.scene.environment = environment;
      ctx.gui.add(ctx.scene, "environmentIntensity").min(0).max(3).step(0.01).name("Reflections");

      ctx.gui.add(grid, "visible").name("Grid");
      ctx.gui.add(axes, "visible").name("Axes");
      ctx.gui.add(ambient, "intensity").min(0).max(5).step(0.01).name("Ambient");
      ctx.gui.add(sun, "intensity").min(0).max(10).step(0.01).name("Sun");

      ctx.onDispose(() => {
        controls.dispose();
        ctx.scene.background = previousBackground;
        ctx.scene.environment = previousEnvironment;
        environment.dispose();
        room.dispose();
        pmrem.dispose();
      });

      return { camera, controls, sun };
    },
  });
