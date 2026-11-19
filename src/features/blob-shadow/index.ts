import * as THREE from "three";
import { defineFeature } from "../../engine/sandbox";

type Options = {
  target: THREE.Object3D;
  restHeight?: number; // target's y when it's on the ground; the shadow shrinks as it rises above this
  groundY?: number;
};

// A soft round shadow under a target, cheaper and more readable than real shadows
export const blobShadow = ({ target, restHeight = 0, groundY = 0 }: Options) =>
  defineFeature({
    name: "Blob Shadow",
    setup(ctx) {
      const settings = {
        radius: 0.4,
        opacity: 0.5,
        shrink: 0.45, // how much the shadow shrinks per unit of height
        minScale: 0.3, // shadow never gets smaller than this fraction of its size
      };
      ctx.gui.add(settings, "radius").min(0.1).max(2).step(0.01).name("Radius");
      ctx.gui.add(settings, "opacity").min(0).max(1).step(0.01).name("Opacity");
      ctx.gui.add(settings, "shrink").min(0).max(2).step(0.01).name("Shrink");
      ctx.gui.add(settings, "minScale").min(0).max(1).step(0.01).name("Min Scale");

      const material = new THREE.MeshBasicMaterial({
        color: "black",
        transparent: true,
        depthWrite: false,
      });

      // Unit circle, sized by radius * scale every frame
      const geometry = new THREE.CircleGeometry(1, 32);
      const shadow = new THREE.Mesh(geometry, material);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = groundY + 0.01; // just above the ground and grid
      ctx.add(shadow);

      ctx.onLateUpdate(() => {
        const height = target.position.y - restHeight;
        const scale = THREE.MathUtils.clamp(1 - height * settings.shrink, settings.minScale, 1);

        shadow.position.x = target.position.x;
        shadow.position.z = target.position.z;
        shadow.scale.setScalar(settings.radius * scale);
        material.opacity = settings.opacity * scale;
      });

      ctx.onDispose(() => {
        geometry.dispose();
        material.dispose();
      });
    },
  });
