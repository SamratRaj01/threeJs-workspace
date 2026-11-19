import * as THREE from "three";
import gsap from "gsap";
import { defineFeature } from "../../engine/sandbox";
import { loadTexture } from "../../engine/assets";
import woodImage from "../../../static/textures/wood/wood_floor_worn_diff_1k.jpg";
import earthImage from "../../../static/textures/earth/earth.jpg";

// The original starter trio: wooden cube, earth sphere, normal-shaded torus, all spinning
export const starterShapes = () =>
  defineFeature({
    name: "Starter Shapes",
    setup(ctx) {
      const woodMaterial = new THREE.MeshStandardMaterial({
        map: loadTexture(woodImage, { color: true }),
        side: THREE.DoubleSide,
      });
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: loadTexture(earthImage, { color: true }),
      });
      const normalMaterial = new THREE.MeshNormalMaterial();

      const cubeSettings = { subdivisions: 20, roll: () => {} };
      const boxGeometry = (n: number) => new THREE.BoxGeometry(1, 1, 1, n, n, n);

      const cube = new THREE.Mesh(boxGeometry(cubeSettings.subdivisions), woodMaterial);
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), earthMaterial);
      sphere.position.x = -2;
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 20), normalMaterial);
      torus.position.x = 2;

      const shapes = [cube, sphere, torus];
      for (const shape of shapes) shape.castShadow = true;
      ctx.add(...shapes);

      const cubeFolder = ctx.gui.addFolder("Cube");
      cubeFolder.add(woodMaterial, "wireframe");
      cubeFolder.add(cube.position, "y").min(-3).max(3).step(0.1).name("Elevation");
      cubeFolder
        .add(cubeSettings, "subdivisions")
        .min(1)
        .max(20)
        .step(1)
        .onFinishChange((n: number) => {
          cube.geometry.dispose();
          cube.geometry = boxGeometry(n);
        });
      cubeSettings.roll = () => {
        gsap.to(cube.rotation, { x: cube.rotation.x + Math.PI });
      };
      cubeFolder.add(cubeSettings, "roll").name("Roll");
      cubeFolder.add(cube, "visible");

      ctx.onUpdate((_dt, elapsed) => {
        for (const shape of shapes) shape.rotation.y = elapsed * 0.5;
      });

      ctx.onDispose(() => {
        gsap.killTweensOf(cube.rotation);
        for (const shape of shapes) shape.geometry.dispose();
        woodMaterial.map?.dispose();
        earthMaterial.map?.dispose();
        for (const material of [woodMaterial, earthMaterial, normalMaterial]) material.dispose();
      });

      return { cube, sphere, torus };
    },
  });
