// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want

// Main game entry point
// Sets up scene, camera, renderer, player, game, and levels

import { PuzzleManager } from './puzzles/puzzleManager.js';
import * as THREE from 'three';
import { createCrosshair,createInfoDisplay } from './puzzles/UiElements.js';
import { createControls } from './camera.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { setupFirstPersonControls } from './controls/controls.js';
import { CharacterControls } from './controls/movement.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createPlayer } from './objects/player.js';
import { createGame } from './game.js';
import { createLevel1 } from './scenes/level1/index.js';
import { collidableObjectsroom1} from './scenes/level1/room1.js';
import { collidableObjectsroom2} from './scenes/level1/room2.js'; 
import { createLevel2 } from './scenes/level2/index.js';
import { createLevel3 } from './scenes/level3/index.js';
import { createLevel4 } from './scenes/level4/index.js';

const collidableObjects = collidableObjectsroom1;
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

const crosshair = createCrosshair();
const infoDisplay = createInfoDisplay();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;                 // enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft shadows
document.body.appendChild(renderer.domElement);
const puzzleManager = new PuzzleManager(scene, camera, renderer);

const controls = setupFirstPersonControls(camera, renderer.domElement);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(15, 5, 15);
orbitControls.update();
const pointerControls = new PointerLockControls(camera, renderer.domElement);
scene.add(pointerControls.getObject());


window.isPaused = false;
// Click to lock the mouse
document.addEventListener('click', () => {
    if (!window.isPaused) {
        pointerControls.lock();
    }
});

pointerControls.addEventListener('lock', () => console.log('Pointer locked'));
pointerControls.addEventListener('unlock', () => console.log('Pointer unlocked'));

// --- Add lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
// bottom = -50;
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

// global key counter
window.numOfKeys = 0;
window.level_num = 0;

// --- Add levels ---
const level1 = createLevel1();
const level2 = createLevel2();
const level3 = createLevel3();
const level4 = createLevel4();

level1.setupPuzzles(puzzleManager, infoDisplay);
level2.setupPuzzles && level2.setupPuzzles(puzzleManager, infoDisplay);
level3.setupPuzzles && level3.setupPuzzles(puzzleManager, infoDisplay);
level4.setupPuzzles && level4.setupPuzzles(puzzleManager, infoDisplay);

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


// I disabled combining rooms in one scene because it takes a lof o memory,so only the current room will be visible in the scene
current_room.visible = true;
next_room.visible = false;
puzzleManager.activateRoom(current_room.userData.roomId);
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

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'idle',collidableObjects );
});

document.addEventListener('keydown', event => {
    // Ignore key presses if the game is paused
    if (window.isPaused) return;

    keysPressed[event.key.toLowerCase()] = true;

    if (event.key.toLowerCase() === 'v' && characterControls) {
        characterControls.toggleCameraMode();
    }
}, false);

document.addEventListener('keyup', event => {
    // Ignore key releases if the game is paused
    if (window.isPaused) return;

    keysPressed[event.key.toLowerCase()] = false;
}, false);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// In your main game file (before animate)


// --- Animation loop ---
function animate() {
    requestAnimationFrame(animate);

    if (!window.isPaused) { // check the global pause flag
        const delta = clock.getDelta();
        game.update();
        puzzleManager.update(delta);
        if (characterControls) characterControls.update(delta, keysPressed);
        orbitControls.update();
    }

    renderer.render(scene, camera);
}

animate();


