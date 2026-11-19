import * as THREE from "three";

const manager = new THREE.LoadingManager(undefined, undefined, (url) =>
  console.error(`Error loading: ${url}`)
);
const textureLoader = new THREE.TextureLoader(manager);

// color: true for textures that hold colors (albedo/diffuse), false for data (normal, displacement, masks)
export const loadTexture = (url: string, { color = false } = {}) => {
  const texture = textureLoader.load(url);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
