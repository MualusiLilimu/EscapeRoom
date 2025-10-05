import * as THREE from 'three';
import { createRoom1 } from '../room1.js';
import { setupFirstPersonControls } from '../../../controls/controls.js'; 

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);
const raycaster = new THREE.Raycaster();

// --- Camera ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 6, 10);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- First-Person Controls ---
const controls = setupFirstPersonControls(camera, renderer.domElement);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(40, 60, 40);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.camera.bottom = -50;
scene.add(dirLight);

// --- Room Setup ---
const room = createRoom1();
room.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
scene.add(room);

// Create a visual indicator for what you're looking at
const crosshair = document.createElement('div');
crosshair.style.position = 'absolute';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.transform = 'translate(-50%, -50%)';
crosshair.style.width = '4px';
crosshair.style.height = '4px';
crosshair.style.backgroundColor = 'white';
crosshair.style.borderRadius = '50%';
crosshair.style.pointerEvents = 'none';
crosshair.style.zIndex = '1000';
crosshair.style.boxShadow = '0 0 3px black';
document.body.appendChild(crosshair);

// Create info display
const infoDisplay = document.createElement('div');
infoDisplay.style.position = 'absolute';
infoDisplay.style.top = '10px';
infoDisplay.style.left = '10px';
infoDisplay.style.color = 'white';
infoDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
infoDisplay.style.padding = '10px';
infoDisplay.style.fontFamily = 'monospace';
infoDisplay.style.fontSize = '14px';
infoDisplay.style.borderRadius = '5px';
infoDisplay.style.pointerEvents = 'none';
infoDisplay.style.zIndex = '1000';
infoDisplay.textContent = 'Click on objects to interact';
document.body.appendChild(infoDisplay);

// Function to handle clicks on specific objects - DEFINED BEFORE USE
function handleObjectClick(objectName, object) {
  console.log(`✓ Clicked on: ${objectName}`);
  infoDisplay.textContent = `Clicked: ${objectName}`;
  
  // Flash the clicked object - FIXED VERSION
  object.traverse((child) => {
    if (child.isMesh && child.material) {
      // Store original material properties
      const originalColor = child.material.color ? child.material.color.clone() : null;
      const originalEmissive = child.material.emissive ? child.material.emissive.clone() : null;
      
      // Apply flash effect
      if (child.material.emissive) {
        child.material.emissive.setHex(0x00ff00);
      } else if (child.material.color) {
        const flashColor = child.material.color.clone();
        flashColor.lerp(new THREE.Color(0x00ff00), 0.5);
        child.material.color = flashColor;
      }
      
      // Restore after delay
      setTimeout(() => {
        if (originalEmissive && child.material.emissive) {
          child.material.emissive.copy(originalEmissive);
        } else if (originalColor && child.material.color) {
          child.material.color.copy(originalColor);
        }
      }, 200);
    }
  });
  
  switch(objectName) {
    case 'steamDeck':
      console.log("🎮 Steam Deck clicked!");
      infoDisplay.textContent = '🎮 Steam Deck clicked!';
      break;
    case 'locker':
      console.log("🚪 Locker clicked!");
      infoDisplay.textContent = '🚪 Locker clicked!';
      break;
    case 'chest':
      console.log("📦 Chest clicked!");
      infoDisplay.textContent = '📦 Chest clicked!';
      break;
    case 'door':
      console.log("🚪 Door clicked!");
      infoDisplay.textContent = '🚪 Door clicked!';
      break;
    case 'dartboard':
      console.log("🎯 Dartboard clicked!");
      infoDisplay.textContent = '🎯 Dartboard clicked!';
      break;
    case 'cage':
      console.log("🦜 Cage clicked!");
      infoDisplay.textContent = '🦜 Cage clicked!';
      break;
    case 'old_couch':
      console.log("🛋️ Couch clicked!");
      infoDisplay.textContent = '🛋️ Couch clicked!';
      break;
    case 'old_table':
      console.log("🪑 Table clicked!");
      infoDisplay.textContent = '🪑 Table clicked!';
      break;
    case 'window':
      console.log("🪟 Window clicked!");
      infoDisplay.textContent = '🪟 Window clicked!';
      break;
    default:
      console.log(`Clicked on ${objectName}`);
      infoDisplay.textContent = `Clicked: ${objectName}`;
  }
  
  // Reset info after 3 seconds
  setTimeout(() => {
    infoDisplay.textContent = 'Click on objects to interact';
  }, 3000);
}

// --- IMPROVED RAYCASTING ---
function onMouseDown(event) {
  // Only process left click and ignore if pointer is not locked
  if (event.button !== 0) return;
  
  // Calculate mouse position in normalized device coordinates
  // When pointer is locked, we raycast from center of screen
  const coords = new THREE.Vector2(0, 0); // Center of screen
  
  raycaster.setFromCamera(coords, camera);
  
  // Raycast against all objects in the scene
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const firstIntersect = intersects[0];
    
    console.log("\n=== CLICK DETECTED ===");
    console.log("Hit object:", firstIntersect.object.name || "(unnamed)");
    console.log("Distance:", firstIntersect.distance.toFixed(2));
    
    // Find the top-level named parent (the actual model/object)
    let currentObject = firstIntersect.object;
    let namedParent = null;
    
    // Walk up the tree to find a meaningful name
    while (currentObject && currentObject !== scene) {
      // Check userData.parentName first (our custom property)
      if (currentObject.userData && currentObject.userData.parentName) {
        // Find the actual parent with this name
        let searchObj = currentObject;
        while (searchObj && searchObj !== scene) {
          if (searchObj.name === currentObject.userData.parentName) {
            namedParent = searchObj;
            break;
          }
          searchObj = searchObj.parent;
        }
        if (namedParent) break;
      }
      
      // Otherwise check for a good name
      if (currentObject.name && 
          currentObject.name !== "" && 
          !currentObject.name.includes("material") &&
          !currentObject.name.includes("prim") &&
          !currentObject.name.includes("Object_") &&
          currentObject.name !== "Scene") {
        namedParent = currentObject;
        break;
      }
      currentObject = currentObject.parent;
    }
    
    if (namedParent && namedParent.name) {
      console.log("✓ Identified as:", namedParent.name);
      console.log("=====================\n");
      
      // Handle specific objects
      handleObjectClick(namedParent.name, namedParent);
    } else {
      console.log("✗ No identifiable object");
      console.log("Object hierarchy:");
      let obj = firstIntersect.object;
      let depth = 0;
      while (obj && depth < 5) {
        console.log(`  ${"  ".repeat(depth)}↳ ${obj.type}: "${obj.name}" userData:`, obj.userData);
        obj = obj.parent;
        depth++;
      }
      console.log("=====================\n");
      infoDisplay.textContent = 'Clicked on unnamed object';
    }
    
  } else {
    console.log("No intersections");
  }
}

// Add event listener
document.addEventListener('mousedown', onMouseDown);

// Also add a continuous raycast to show what you're looking at
let lastLookedAt = null;
function checkLookingAt() {
  const coords = new THREE.Vector2(0, 0);
  raycaster.setFromCamera(coords, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    let currentObject = intersects[0].object;
    let namedParent = null;
    
    while (currentObject && currentObject !== scene) {
      if (currentObject.name && 
          currentObject.name !== "" && 
          !currentObject.name.includes("material") &&
          !currentObject.name.includes("prim") &&
          currentObject.name !== "Scene" &&
          currentObject.name !== "Object_") {
        namedParent = currentObject;
        break;
      }
      currentObject = currentObject.parent;
    }
    
    if (namedParent && namedParent.name !== lastLookedAt) {
      lastLookedAt = namedParent.name;
      console.log(`👁️ Looking at: ${namedParent.name}`);
    }
  } else if (lastLookedAt !== null) {
    lastLookedAt = null;
  }
}

// --- Window Resize Handling ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const clock = new THREE.Clock();
let frameCount = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  controls.update(delta);
  
  // Check what we're looking at every 10 frames (not every frame for performance)
  if (frameCount % 10 === 0) {
    checkLookingAt();
  }
  frameCount++;
  
  renderer.render(scene, camera);
}

animate();

console.log("Scene loaded!");
console.log("Controls: WASD to move, Mouse to look, Click to interact");
console.log("Watch the console to see what you're looking at");