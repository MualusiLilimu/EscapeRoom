// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want

// Main game entry point
// Sets up scene, camera, renderer, player, game, and levels


import * as THREE from 'three';
import { createControls } from './camera.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupFirstPersonControls } from './controls/controls.js';
import { CharacterControls } from './controls/movement.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(15, 5, 15);
orbitControls.update();

// --- Add lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);
// // Directional light that casts shadows
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(40, 60, 40);
// directionalLight.castShadow = true;

// // Shadow camera settings
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 200;
// directionalLight.shadow.camera.left = -50;
// directionalLight.shadow.camera.right = 50;
// directionalLight.shadow.camera.top = 50;
// directionalLight.shadow.camera.bottom = -50;
// scene.add(directionalLight);


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

const current_room = game.getCurrentRoom();
const next_room = game.nextRoom();
next_room.position.set(74.5, 0, 20);

// Enable shadows on room objects
current_room.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

next_room.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

// --- Add first room to scene ---
scene.add(current_room);
scene.add(next_room);
let characterControls = null;
const keysPressed = {};
const clock = new THREE.Clock();

new GLTFLoader().load('/models/player.glb', gltf => {
    const model = gltf.scene;
    model.traverse(obj => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    model.position.set(0, 0.5, 0);
    model.scale.set(5, 5, 5);
    scene.add(model);

    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltf.animations.forEach(clip => animationsMap.set(clip.name, mixer.clipAction(clip)));

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'idle');
});

document.addEventListener('keydown', event => {
    keysPressed[event.key.toLowerCase()] = true;

    if (event.key.toLowerCase() === 'v' && characterControls) {
        characterControls.toggleCameraMode();
    }
}, false);

document.addEventListener('keyup', event => {
    keysPressed[event.key.toLowerCase()] = false;
}, false);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  game.update();
  const delta = clock.getDelta();
  if (characterControls) characterControls.update(delta, keysPressed);
    orbitControls.update();
  renderer.render(scene, camera);
}
animate();
