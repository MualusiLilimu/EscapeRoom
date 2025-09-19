// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want

// Main game entry point
// Sets up scene, camera, renderer, player, game, and levels

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createControls } from './camera.js';


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
camera.position.set(0, 2, 7);



// camera movement
const controls = new createControls(camera, document.body);
// Click to lock pointer
document.body.addEventListener('click', () => {
  controls.lock();
});


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// --- Add lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);


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

// --- Add first room to scene ---
scene.add(game.getCurrentRoom());

// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  game.update();
  renderer.render(scene, camera);
}
animate();
