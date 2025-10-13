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

const current_room = game.getCurrentRoom();

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
let nearDoor = false;
let doorUnlocked = false;

// Helper function to check if player is near the door
function checkDoorInteraction() {
  if (!characterControls || !collidableObjectsroom1) return;

  const playerPos = characterControls.model.position;
  nearDoor = false;

  for (const obj of collidableObjectsroom1) {
    if (obj.userData.isDoor) {
      const distance = playerPos.distanceTo(obj.position);
      if (distance < 10 && !doorUnlocked) { // within 10 units of the door
        nearDoor = true;
        break;
      }
    }
  }

  interactionUI.style.display = nearDoor ? 'block' : 'none';
}

// When the player presses 'E' the door unlocks
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'e' && nearDoor && !doorUnlocked) {
    unlockDoor();
  }
});

function unlockDoor() {
  const door = collidableObjectsroom1.find(obj => obj.userData.isDoor);
  if (!door) return;

  doorUnlocked = true;
  door.visible = false;
  const index = collidableObjectsroom1.indexOf(door);
  if (index > -1) collidableObjectsroom1.splice(index, 1);

  interactionUI.style.display = 'none';
  console.log("Door unlocked!");
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

    if(current_room.userData.roomId == "level1-room1"){
      model.position.set(0, 0.5, 0);
      model.scale.set(5, 5, 5);
    }
    else if(current_room.userData.roomId == "level1-room2"){
      model.position.set(-15,0.5,3);
      model.scale.set(5,5,5);
      model.rotation.y = Math.PI/2;
    }
    else if(current_room.userData.roomId == "level1-room3"){
      model.position.set(0,0.5,10);
      model.scale.set(4,4,4);
      model.rotation.y = Math.PI;
    }
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


