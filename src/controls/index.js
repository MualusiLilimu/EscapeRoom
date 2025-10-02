
import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';
import { CharacterControls } from './controls.js';
// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 10);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// controls (fixed)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;              // allow closer zoom
controls.maxDistance = 50;             // allow further zoom
controls.enablePan = true;             // allow side movement
controls.maxPolarAngle = Math.PI / 2;  // allow horizon view

// light
function light() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 7.5);
    directional.castShadow = true;
    directional.shadow.camera.left = -10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = -10;
    directional.shadow.mapSize.set(1024, 1024);
    scene.add(directional);
}
light();

// floor
function generateFloor() {
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, depthWrite: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
}
generateFloor();

var characterControls = null;
new GLTFLoader().load('/models/player.glb', function(gltf) {
    console.log('Loaded player.glb', gltf);
    const model = gltf.scene;
    model.traverse(function(object) {
        if (object.isMesh) {
            object.castShadow = true;
        }
    });
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1); 
    scene.add(model);
 

    const gltfAnimations = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltfAnimations.forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a));
    });
    characterControls = new CharacterControls(model, mixer, animationsMap, controls, camera, 'idle');

});

// dummy Display class (so no error)
class Display {
    down(key) { console.log("Key down:", key); }
    up(key) { console.log("Key up:", key); }
}

// control keys
const keysPressed = {};
const KeyDislayQueue = new Display();
document.addEventListener('keydown', (event) => {
    KeyDislayQueue.down(event.key);
    keysPressed[event.key.toLowerCase()] = true;
}, false);

document.addEventListener('keyup', (event) => {
    KeyDislayQueue.up(event.key);
    keysPressed[event.key.toLowerCase()] = false;
}, false);

// animate
const clock = new THREE.Clock();



function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    controls.update(); // fixed
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// handle resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
