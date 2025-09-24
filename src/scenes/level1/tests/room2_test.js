// for effective testing, when you design the a room you will be able to see changes in the correspondi html file of this file
// so run the room_test.html file when designing to see the changes Just like how things were in CGV Labs


// You can make changes to your liking

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRoom2 } from '../room2.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color("0x000000");

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
;

camera.position.set(0, 200, 0); // 200 units high, center of floor
controls.target.set(0, 200, 100); // point in front of camera
controls.update();






// Lights
// Improved lighting so walls, door, and handle are visible from all angles
scene.add(new THREE.AmbientLight(0xffffff, 1)); // brighter ambient light

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
dirLight1.position.set(10, 20, 10);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight2.position.set(-10, 20, -10);
scene.add(dirLight2);


// Add the room
scene.add(createRoom2());

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime() * 1000; // milliseconds

    // Animate curtains
    scene.traverse(obj => {
        if (obj.userData.animate) obj.userData.animate(elapsed);
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();

