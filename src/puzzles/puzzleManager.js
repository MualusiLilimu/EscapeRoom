// puzzleManager.js
// Manages puzzle lifecycle, updates, and interactions across different rooms
import * as THREE from 'three';
export class PuzzleManager {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.activePuzzles = new Map(); // roomId -> puzzle data
    this.currentRoomId = null;
    this.raycaster = new THREE.Raycaster();
    this.setupClickHandler();
  }

  setupClickHandler() {
    const onMouseDown = (event) => {
      if (event.button !== 0) return;
      
      const coords = new THREE.Vector2(0, 0);
      this.raycaster.setFromCamera(coords, this.camera);
      
      const currentPuzzle = this.activePuzzles.get(this.currentRoomId);
      if (!currentPuzzle || !currentPuzzle.models) return;
      
      const intersects = this.raycaster.intersectObjects(currentPuzzle.models.children, true);
      
      if (intersects.length > 0) {
        const firstIntersect = intersects[0];
        let currentObject = firstIntersect.object;
        let namedParent = null;
        
        // Find the named parent object
        while (currentObject && currentObject !== this.scene) {
          if (currentObject.userData && currentObject.userData.parentName) {
            let searchObj = currentObject;
            while (searchObj && searchObj !== this.scene) {
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
        
        if (namedParent && namedParent.name && currentPuzzle.handleClick) {
          currentPuzzle.handleClick(namedParent.name, namedParent);
        }
      }
    };
    
    document.addEventListener('mousedown', onMouseDown);
  }

  // Register a puzzle for a specific room
  registerPuzzle(roomId, puzzleData) {
    this.activePuzzles.set(roomId, puzzleData);
  }

  // Switch to a room's puzzle
  activateRoom(roomId) {
    this.currentRoomId = roomId;
    const puzzle = this.activePuzzles.get(roomId);
    
    if (puzzle && puzzle.onActivate) {
      puzzle.onActivate();
    }
  }

  // Deactivate current room's puzzle
  deactivateRoom(roomId) {
    const puzzle = this.activePuzzles.get(roomId);
    
    if (puzzle && puzzle.onDeactivate) {
      puzzle.onDeactivate();
    }
  }

  // Update current puzzle (called from game loop)
  update(delta) {
    if (!this.currentRoomId) return;
    
    const puzzle = this.activePuzzles.get(this.currentRoomId);
    if (puzzle && puzzle.update) {
      puzzle.update(delta);
    }
  }

  // Get current puzzle state
  getCurrentPuzzle() {
    return this.activePuzzles.get(this.currentRoomId);
  }

  // Check if current puzzle is solved
  isCurrentPuzzleSolved() {
    const puzzle = this.getCurrentPuzzle();
    return puzzle && puzzle.state && puzzle.state.solved;
  }
}