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
import { collidableObjectsroom3} from './scenes/level1/room3.js';
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

// global key counter and level counter
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

let current_room = game.getCurrentRoom();

// Enable shadows on room objects
current_room.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});


// --- Add first room to scene ---
scene.add(current_room);

current_room.visible = true;

puzzleManager.activateRoom(current_room.userData.roomId);

let characterControls = null;
const keysPressed = {};
const clock = new THREE.Clock();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Door interaction logic 
const interactionUI = document.getElementById('interaction-ui');
const no_key = document.getElementById('no_key');
let nearDoor = false;
let doorUnlocked = false;

// Helper function to check if player is near the door
function checkDoorInteraction() {
    if (!characterControls || !collidableObjects) return;

    const playerPos = characterControls.model.position;
    nearDoor = false;

    // Loop over the collidable objects of the current room
    for (const obj of collidableObjects) {
        if (obj.userData.isDoor) {
            const distance = playerPos.distanceTo(obj.position);
            if (distance < 10 && !doorUnlocked) { // within 10 units
                nearDoor = true;
                break;
            }
        }
    }

    // Show proper UI based on keys
    if (window.numOfKeys > 0) {
        interactionUI.style.display = nearDoor ? 'block' : 'none';
        no_key.style.display = 'none';
    } else {
        no_key.style.display = nearDoor ? 'block' : 'none';
        interactionUI.style.display = 'none';
    }
}


// When the player presses 'E' the door unlocks
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'e' && nearDoor && !doorUnlocked) {
    if(window.numOfKeys > 0){
      unlockDoor();
    }
  }
});


function unlockDoor() {
    const door = collidableObjects.find(obj => obj.userData.isDoor);
    if (!door) return;

    doorUnlocked = true;

    // Animate door rotation
    const doorOpenRotation = { y: door.rotation.y - Math.PI/2 }; // rotate 90 degrees
    const duration = 1; // seconds
    const startTime = performance.now();

    function animateDoor(time) {
        const elapsed = (time - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1);
        door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, doorOpenRotation.y, t);
        if (t < 1) requestAnimationFrame(animateDoor);
        else fadeOutRoom();
    }
    requestAnimationFrame(animateDoor);
}


function fadeOutRoom() {
    const fadeOverlay = document.getElementById('fade-overlay');
    fadeOverlay.style.transition = 'opacity 1s ease';
    fadeOverlay.style.opacity = 1;

    // Wait for fade to finish, then switch room
    setTimeout(() => {
        switchRoom();
        fadeOverlay.style.opacity = 0;
    }, 1000);
}


// This  function changes the room after a player unlocks the door
function switchRoom() {
    // Remove current room
    if (current_room) scene.remove(current_room);

    // Get the next room
    const nextRoom = game.nextRoom();
    scene.add(nextRoom);

    // Enable shadows
    nextRoom.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // Update collidable objects
    collidableObjects.length = 0;
    if (nextRoom.userData.roomId === "level1-room2") {
        collidableObjects.push(...collidableObjectsroom2);
    } else if (nextRoom.userData.roomId === "level1-room3") {
        collidableObjects.push(...collidableObjectsroom3);
    }

    // Update player position
    if (characterControls) {
        characterControls.collidableObjects = collidableObjects;
        if (nextRoom.userData.roomId === "level1-room2") {
            characterControls.model.position.set(-15, 0.5, 3);
            characterControls.model.rotation.y = Math.PI/2;
        } else if (nextRoom.userData.roomId === "level1-room3") {
            characterControls.model.position.set(0, 0.5, 10);
            characterControls.model.scale.set(4,4,4);
            characterControls.model.rotation.y = Math.PI;
        }
    }

    // Update current_room reference
    current_room = nextRoom;

    // Activate puzzle for the new room
    puzzleManager.activateRoom(nextRoom.userData.roomId);

    // Reset door state
    doorUnlocked = false;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// player model

new GLTFLoader().load('/models/player.glb', gltf => {
    const model = gltf.scene;
    model.traverse(obj => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    // setting the initial postion of the player model in each room
    model.position.set(0, 0.5, 0);
    model.scale.set(5, 5, 5);

    scene.add(model);

    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltf.animations.forEach(clip => animationsMap.set(clip.name, mixer.clipAction(clip)));

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'idle',collidableObjects );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


// --- Animation loop ---
function animate() {
    requestAnimationFrame(animate);

    if (!window.isPaused) { 
        const delta = clock.getDelta();
        game.update();
        puzzleManager.update(delta);
        if (characterControls) characterControls.update(delta, keysPressed);
        checkDoorInteraction();
        orbitControls.update();
    }

    renderer.render(scene, camera);
}

animate();


