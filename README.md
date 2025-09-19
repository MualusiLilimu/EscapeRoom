# Escape Room Game (Three.js)

## Description
This is a 3D escape room game built with [Three.js](https://threejs.org/). 
The player is “kidnapped” and must navigate multiple rooms across different floors, 
solving puzzles and finding keys to progress. 
The game demonstrates modular scene management, pointer-based camera controls, and basic player movement.

---

## Features

- Multiple levels and rooms (Level 1 = top floor, Level 4 = ground floor)
- Interactive rooms with placeholder objects (keys, doors, markers)
- WASD movement and mouse look using PointerLockControls
- Modular design using factory functions for rooms, levels, and player
- Easy to extend with more puzzles, objects, and levels

---

## Folder Structure



- `main.js` – Entry point of the game
- `game.js` – Game manager: tracks levels, rooms, and updates
- `controls.js` – PointerLockControls setup for camera movement
- `objects/player.js` – Player module (movement and updates)
- `scenes/levelX` – Each level contains multiple room factory functions
- `public/` – Static assets like textures, models, sounds

---

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/MualusiLilimu/EscapeRoom.git
cd EscapeRoom



