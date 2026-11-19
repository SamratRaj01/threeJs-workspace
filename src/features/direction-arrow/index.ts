import * as THREE from "three";
import { defineFeature } from "../../engine/sandbox";

type Options = {
  target: THREE.Object3D;
  facing: THREE.Vector3; // read every frame, so pass a vector the target keeps updating
  groundY?: number;
};

// A flat arrow on the ground under a target, pointing where it faces
export const directionArrow = ({ target, facing, groundY = 0 }: Options) =>
  defineFeature({
    name: "Direction Arrow",
    setup(ctx) {
      const settings = {
        distance: 0.7, // how far in front of the target's center
        size: 1,
        opacity: 0.8,
      };
      ctx.gui.add(settings, "distance").min(0).max(3).step(0.01).name("Distance");
      ctx.gui.add(settings, "size").min(0.1).max(3).step(0.01).name("Size");
      ctx.gui.add(settings, "opacity").min(0).max(1).step(0.01).name("Opacity");

      // Flat triangle pointing +Y, laid on the ground so it points +Z
      const shape = new THREE.Shape()
        .moveTo(0, 0.2)
        .lineTo(-0.15, -0.1)
        .lineTo(0.15, -0.1)
        .closePath();
      const geometry = new THREE.ShapeGeometry(shape);
      geometry.rotateX(Math.PI / 2);

      const material = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const arrow = new THREE.Mesh(geometry, material);

      // Pivot sits under the target and turns to face; the arrow is offset forward inside it
      const pivot = new THREE.Group();
      pivot.position.y = groundY + 0.02; // above a blob shadow
      pivot.add(arrow);
      ctx.add(pivot);

      ctx.onLateUpdate(() => {
        pivot.position.x = target.position.x;
        pivot.position.z = target.position.z;
        pivot.rotation.y = Math.atan2(facing.x, facing.z);

        arrow.position.z = settings.distance;
        arrow.scale.setScalar(settings.size);
        material.opacity = settings.opacity;
      });

      ctx.onDispose(() => {
        geometry.dispose();
        material.dispose();
      });
    },
  });
