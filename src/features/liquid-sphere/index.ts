import * as THREE from "three";
import { defineFeature } from "../../engine/sandbox";

type Options = { position?: THREE.Vector3Like; radius?: number };

// A glassy water blob that wobbles by moving its vertices on the CPU every frame
export const liquidSphere = ({ position = { x: 0, y: 1, z: 0 }, radius = 0.5 }: Options = {}) =>
  defineFeature({
    name: "Liquid Sphere",
    setup(ctx) {
      const settings = { wobble: 0.15, speed: 1 };
      ctx.gui.add(settings, "wobble").min(0).max(0.5).step(0.01).name("Wobble");
      ctx.gui.add(settings, "speed").min(0).max(5).step(0.01).name("Speed");

      const material = new THREE.MeshPhysicalMaterial({
        color: "#4fc3f7",
        transmission: 1, // fully see-through, refracts the scene behind it
        thickness: 0.8, // how "deep" the refraction looks
        roughness: 0.05,
        ior: 1.33, // index of refraction of water
        clearcoat: 1,
        clearcoatRoughness: 0,
        attenuationColor: new THREE.Color("#0077be"), // tint gets deeper through thicker parts
        attenuationDistance: 1,
      });

      // High segment count so the wobble looks smooth
      const geometry = new THREE.SphereGeometry(radius, 128, 128);
      const vertices = geometry.attributes.position;
      const basePositions = vertices.array.slice(); // original shape, used every frame

      const liquid = new THREE.Mesh(geometry, material);
      liquid.position.copy(position);
      liquid.castShadow = true;
      ctx.add(liquid);

      const v = new THREE.Vector3();
      let time = 0;

      ctx.onUpdate((dt) => {
        time += dt * settings.speed;
        for (let i = 0; i < vertices.count; i++) {
          v.fromArray(basePositions, i * 3);

          // Layered sine waves give an organic wobble
          const wobble =
            Math.sin((v.x / radius) * 3 + time * 2.0) *
            Math.sin((v.y / radius) * 3.5 + time * 1.5) *
            Math.sin((v.z / radius) * 2.5 + time * 1.7);

          v.multiplyScalar(1 + wobble * settings.wobble); // push in or out from the center
          vertices.setXYZ(i, v.x, v.y, v.z);
        }
        vertices.needsUpdate = true;
        geometry.computeVertexNormals(); // so lighting follows the new shape
      });

      ctx.onDispose(() => {
        geometry.dispose();
        material.dispose();
      });

      return { mesh: liquid };
    },
  });
