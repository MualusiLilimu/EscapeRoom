// interactionHandler.js

import { updateInfoDisplay } from './UiElements.js';

export function setupRaycaster(camera, scene, puzz1Models, infoDisplay, onObjectClick) {
  const raycaster = new THREE.Raycaster();
  
  function onMouseDown(event) {
    if (event.button !== 0) return;
    
    const coords = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(coords, camera);
    
    const intersects = raycaster.intersectObjects(puzz1Models.children, true);

    if (intersects.length > 0) {
      const firstIntersect = intersects[0];
      
      console.log("\n=== CLICK DETECTED ===");
      console.log("Hit object:", firstIntersect.object.name || "(unnamed)");
      console.log("Distance:", firstIntersect.distance.toFixed(2));
      
      let currentObject = firstIntersect.object;
      let namedParent = null;
      
      while (currentObject && currentObject !== scene) {
        if (currentObject.userData && currentObject.userData.parentName) {
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
        
        handleObjectClick(namedParent.name, namedParent, infoDisplay, onObjectClick);
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
        updateInfoDisplay(infoDisplay, 'Clicked on unnamed object');
      }
      
    } else {
      console.log("No intersections");
    }
  }
  
  document.addEventListener('mousedown', onMouseDown);
  
  return raycaster;
}

function handleObjectClick(objectName, object, infoDisplay, onObjectClick) {
  console.log(`✓ Clicked on: ${objectName}`);
  updateInfoDisplay(infoDisplay, `Clicked: ${objectName}`);
  
  // Flash the clicked object
  
  
  // Call the custom callback
  if (onObjectClick) {
    onObjectClick(objectName, object);
  }
}