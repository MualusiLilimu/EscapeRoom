// Utility to load models (.gltf) or textures, so we don’t repeat code everywhere.

import { TextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function loadTexture(path) {
  const loader = new TextureLoader();
  return loader.load(path);
}
