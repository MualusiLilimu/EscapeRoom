// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want

// Main game entry point
// Sets up scene, camera, renderer, player, game, and levels


import * as THREE from 'three';
import { createControls } from './camera.js';
import { setupFirstPersonControls } from './controls/controls.js';

import { createPlayer } from './objects/player.js';
import { createGame } from './game.js';
import { createLevel1 } from './scenes/level1/index.js';
import { createLevel2 } from './scenes/level2/index.js';
import { createLevel3 } from './scenes/level3/index.js';
import { createLevel4 } from './scenes/level4/index.js';

// --- Scene, camera, renderer setup ---
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 6, 10);
camera.lookAt(0,5,0);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;                 // enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft shadows
document.body.appendChild(renderer.domElement);

const controls = setupFirstPersonControls(camera, renderer.domElement);

// --- Add lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);
// Directional light that casts shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(40, 60, 40);
directionalLight.castShadow = true;

// Shadow camera settings
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Initialize player ---
const player = createPlayer(camera);

// --- Initialize game ---
const game = createGame(scene, player);

// --- Add levels ---
const level1 = createLevel1();
const level2 = createLevel2();
const level3 = createLevel3();
const level4 = createLevel4();

game.addLevel(level1);
game.addLevel(level2);
game.addLevel(level3);
game.addLevel(level4);

const room = game.getCurrentRoom();

// Enable shadows on room objects
room.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

// --- Add first room to scene ---
scene.add(game.getCurrentRoom());

const clock = new THREE.Clock();
// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  game.update();
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}
animate();
