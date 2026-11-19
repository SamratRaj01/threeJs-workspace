import * as THREE from "three";
import { defineFeature } from "../engine/sandbox";

// Orthographic camera on the (1, 1, 1) diagonal over a grey grid floor.
// Call follow(object) on what setup returns to keep the camera centered on something.
export const isoBackdrop = ({ viewSize = 10 } = {}) =>
  defineFeature({
    name: "Iso Backdrop",
    setup(ctx) {
      const settings = { viewSize }; // how many world units fit vertically on screen
      const offset = new THREE.Vector3(10, 10, 10);

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
      camera.position.copy(offset);
      camera.lookAt(0, 0, 0);
      ctx.setCamera(camera);

      let aspect = 1;
      const updateFrustum = () => {
        camera.left = (-settings.viewSize * aspect) / 2;
        camera.right = (settings.viewSize * aspect) / 2;
        camera.top = settings.viewSize / 2;
        camera.bottom = -settings.viewSize / 2;
        camera.updateProjectionMatrix();
      };
      ctx.onResize((width, height) => {
        aspect = width / height;
        updateFrustum();
      });
      ctx.gui.add(settings, "viewSize").min(2).max(40).step(0.1).name("View Size").onChange(updateFrustum);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: "#9e9e9e" })
      );
      ground.rotation.x = -Math.PI / 2;

      const grid = new THREE.GridHelper(40, 40, "#555", "#777");
      grid.position.y = 0.001;

      // Sky/ground tint gives shading without a directional light
      const ambientLight = new THREE.AmbientLight("white", 0.6);
      const hemisphereLight = new THREE.HemisphereLight("white", "#555", 2);

      ctx.add(ground, grid, ambientLight, hemisphereLight);

      const previousBackground = ctx.scene.background;
      ctx.scene.background = new THREE.Color("#cfd8dc");
      ctx.onDispose(() => {
        ctx.scene.background = previousBackground;
        ground.geometry.dispose();
        ground.material.dispose();
      });

      // Follow keeps the isometric angle, just slides the camera along with the target
      let target: THREE.Object3D | null = null;
      ctx.onLateUpdate(() => {
        if (!target) return;
        camera.position.copy(target.position).add(offset);
        camera.lookAt(target.position);
      });

      return {
        camera,
        follow(object: THREE.Object3D | null) {
          target = object;
        },
      };
    },
  });
