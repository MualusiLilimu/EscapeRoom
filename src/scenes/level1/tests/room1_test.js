import * as THREE from 'three';
import { createRoom1 } from '../room1.js';
import { setupFirstPersonControls } from '../../../controls/controls.js';
import { puzzle1, changeLightColor, handlePuzzleButtonClick,updateKeyAnimation, hideKey } from '../../../puzzles/puzzle1.js';
import { createCrosshair, createInfoDisplay,showKeyCollected } from '../../../puzzles/UiElements.js';
import { setupRaycaster } from '../../../puzzles/interactionHandler.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const { room, puzz1Models } = createRoom1();
scene.add(room);

// --- Camera ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- First-Person Controls ---
const controls = setupFirstPersonControls(camera, renderer.domElement);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);


// --- Room Setup ---
room.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

// --- UI Setup ---
const crosshair = createCrosshair();
const infoDisplay = createInfoDisplay();

// --- Interaction Setup ---
const raycaster = setupRaycaster(camera, scene, puzz1Models, infoDisplay, (objectName, object) => {
  // Handle puzzle button clicks
  const result = handlePuzzleButtonClick(objectName, puzzle1);
  
  if (result === 'key_collected') {
    showKeyCollected(infoDisplay);
    hideKey(puzz1Models);
  } else if (!result) {
    console.log(`Clicked on ${objectName}`);
  }
});
scene.add(room4);
// --- Window Resize Handling ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  
  changeLightColor(puzz1Models, puzzle1);
  updateKeyAnimation(puzz1Models, puzzle1, delta);
  
  controls.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

console.log("Scene loaded!");
console.log("Controls: WASD to move, Mouse to look, Click to interact");
console.log("Watch the console to see what you're looking at");