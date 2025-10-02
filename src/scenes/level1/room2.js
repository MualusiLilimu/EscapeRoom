// room2.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import {loadTexture} from '../../../utils/loader.js';
import { loadModel } from '../../../utils/loader.js';




const scaryPaintingURL = '../../../../public/textures/A.webp'; 



export function createRoom2() {
    const room = new THREE.Group();

    // Room dimensions
    const roomWidth = 1000;
    const roomDepth = 1000;
    const roomHeight = 600;
    const wallThickness = 10;

    // -------------------------
    // Wall geometries
    const wallGeometryWidth = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness); // front/back
    const wallGeometryDepth = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth); // left/right

    // -------------------------
    // Wall materials
    const frontWallMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2e2e, roughness: 0.6, metalness: 0 }); // brown
    const backWallMaterial  = new THREE.MeshStandardMaterial({ color: 0x4b2e2e, roughness: 0.6, metalness: 0 }); // brown

    // Brick texture for side walls
    const textureLoader = new THREE.TextureLoader();
    const brickTexture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');
    brickTexture.encoding = THREE.sRGBEncoding;

    brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping;
    brickTexture.repeat.set(4, 4);

    const leftWallMaterial  = new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.7, metalness: 0 });
    const rightWallMaterial = new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.7, metalness: 0 });

    // -------------------------


  // Walls
    const frontWall = new THREE.Mesh(wallGeometryWidth, frontWallMaterial);
    frontWall.position.set(0, roomHeight / 2, roomDepth / 2 + wallThickness / 2);
    frontWall.receiveShadow = true;
    room.add(frontWall);

    const backWall = new THREE.Mesh(wallGeometryWidth, backWallMaterial);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2 - wallThickness / 2);
    backWall.receiveShadow = true;
    room.add(backWall);

    const leftWall = new THREE.Mesh(wallGeometryDepth, leftWallMaterial);
    leftWall.position.set(-roomWidth / 2 - wallThickness / 2, roomHeight / 2, 0);
    leftWall.receiveShadow = true;
    room.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometryDepth, rightWallMaterial);
    rightWall.position.set(roomWidth / 2 + wallThickness / 2, roomHeight / 2, 0);
    rightWall.receiveShadow = true;
    room.add(rightWall);

    // -------------------------
    // Ceiling
    const ceilingThickness = 10;
    const ceilingGeometry = new THREE.BoxGeometry(roomWidth, ceilingThickness, roomDepth);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5, metalness: 0 });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, roomHeight + ceilingThickness / 2, 0);
    ceiling.receiveShadow = true;
    room.add(ceiling);

    // -------------------------
    // Floor (tiles)
    const floor = createFloor(roomWidth, roomDepth, 50);
    room.add(floor);

loadModel(
    '../../../../public/models/door.glb',
    { x: 0, y: 0, z: 0, scale: 1, rotation: { y: Math.PI } }, 
    (doorModel) => {

        // Wrap door in a group to handle scaling/centering
        const doorGroup = new THREE.Group();
        doorGroup.add(doorModel);

        // Center the door model inside the group
        const bbox = new THREE.Box3().setFromObject(doorModel);
        const center = bbox.getCenter(new THREE.Vector3());

        doorModel.position.x -= center.x;           // center X
        doorModel.position.y -= bbox.min.y;         // put base at y=0
        doorModel.position.z -= center.z;           // center Z

        // Scale the door to fit the room
        const doorScale = 1.5; // tweak this until it matches old door size
        doorGroup.scale.set(doorScale, doorScale, doorScale);

        // Place at the same coordinates as the old door
        const wallThickness = 10;
        const roomDepth = 1000;
        doorGroup.position.set(0, 0, roomDepth / 2 + wallThickness / 2);

        room.add(doorGroup);
        console.log("✅ Prison door added at center:", doorGroup);
    }
);

// -------------------------
// Add second door on the back wall (right corner)
loadModel(
    '../../../../public/models/door.glb',
    { x: 0, y: 0, z: 0, scale: 1, rotation: { y: Math.PI } }, 
    (doorModel) => {

        const doorGroup = new THREE.Group();
        doorGroup.add(doorModel);

        // Center the door inside the group
        const bbox = new THREE.Box3().setFromObject(doorModel);
        const center = bbox.getCenter(new THREE.Vector3());

        doorModel.position.x -= center.x;
        doorModel.position.y -= bbox.min.y;
        doorModel.position.z -= center.z;

        // Scale to match first door
        const doorScale = 1.5;
        doorGroup.scale.set(doorScale, doorScale, doorScale);

        // Position on back wall, right corner
        const wallThickness = 10;
        const roomWidth = 1000;
        const roomDepth = 1000;

        // Right corner x: positive half width minus some margin
        // z: back wall z-position
        const margin = 50; // adjust so door isn't flush with corner
        doorGroup.position.set(roomWidth/2 - 100, 0, -roomDepth/2 - wallThickness/2);

        room.add(doorGroup);
        console.log("✅ Second door added at back wall right corner:", doorGroup);
    }
);



    // -------------------------
    // Hanging Lights (modern realistic)
    const lightPositions = [
        [-roomWidth/2 + 150, roomHeight - 50, -roomDepth/2 + 150],
        [ roomWidth/2 - 150, roomHeight - 50, -roomDepth/2 + 150],
        [-roomWidth/2 + 150, roomHeight - 50,  roomDepth/2 - 150],
        [ roomWidth/2 - 150, roomHeight - 50,  roomDepth/2 - 150],
        [0, roomHeight - 50, 0] // center
    ];

    lightPositions.forEach(pos => {
        const rodLength = 50; // wire/rod length
        const rodGeometry = new THREE.CylinderGeometry(2, 2, rodLength, 8);
        const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.4 });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.position.set(pos[0], pos[1] - rodLength/2, pos[2]);
        rod.castShadow = true;
        room.add(rod);

        const bulbGeometry = new THREE.SphereGeometry(20, 32, 32);
        const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffaa, emissiveIntensity: 2, metalness: 0.1, roughness: 0.2 });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.set(pos[0], pos[1] - rodLength, pos[2]);
        bulb.castShadow = true;
        room.add(bulb);

        const pointLight = new THREE.PointLight(0xffffff, 1.5, 3000, 2);
        pointLight.position.set(pos[0], pos[1] - rodLength, pos[2]);
        pointLight.castShadow = true;
        room.add(pointLight);
    });

  






const desk = createOfficeDesk();
desk.position.set(-350, 0, 400);
room.add(desk);

const chair = createOfficeChair();
chair.position.set(-350, 0, 300);
room.add(chair);


// Create monitor
const monitor = createMonitor();
monitor.position.set(-350, 80, 410); // on top of desk
room.add(monitor);

// Create keyboard
const keyboard = createKeyboard();
keyboard.position.set(-350, 81.5, 390); // slightly in front of monitor
room.add(keyboard);


loadModel(
    '../../../../public/models/old_bed.glb',
    { x: 250, y: 0, z: 50, scale: 120, rotation: { y: -Math.PI/2  } },
    (Sofamodel) => {
        room.add(Sofamodel);
        console.log("✅ drawer added:", Sofamodel);
    }
);

loadModel(
    '../../../../public/models/box_wooden_closet_supplies.glb',
    { x: -roomWidth / 2 + 200, y: 0, z: -roomDepth / 2 + 110, scale: 200, rotation: { y: -Math.PI/2  } },
    (doorModel) => {
        room.add(doorModel);
        console.log("✅ drawer added:", doorModel);
    }
);

 loadModel(
   '../../../../public/models/window2.glb',
   { x: -417.5, y: 300, z: -30, scale: 120, rotation: { y: Math.PI / 2 } }, 
   (windowModel) => {
     room.add(windowModel);
  console.log("✅ Window added:", windowModel);
   }
 );

 



addScaryPainting(room);










    return room;
}


// -------------------------
// Floor Function
function createFloor(roomWidth, roomDepth, tileSize = 50) {
    const floorGroup = new THREE.Group();

    const tilesX = Math.floor(roomWidth / tileSize);
    const tilesZ = Math.floor(roomDepth / tileSize);

    for (let i = 0; i < tilesX; i++) {
        for (let j = 0; j < tilesZ; j++) {
            const color = (i + j) % 2 === 0 ? 0xf5f5dc : 0x8b7d6b;
            const tileMaterial = new THREE.MeshStandardMaterial({ color });
            const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
            const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);

            tileMesh.rotation.x = -Math.PI / 2;
            tileMesh.position.set(
                -roomWidth / 2 + tileSize / 2 + i * tileSize,
                0,
                -roomDepth / 2 + tileSize / 2 + j * tileSize
            );
            tileMesh.receiveShadow = true;
            floorGroup.add(tileMesh);
        }
    }

    return floorGroup;
}


// -------------------------
// Realistic Desk Function
// -------------------------
// Office Desk with Drawers
function createOfficeDesk() {
    const deskGroup = new THREE.Group();

    // Desk top
    const topGeometry = new THREE.BoxGeometry(250, 10, 200); // big desk
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6, metalness: 0.1 });
    const topMesh = new THREE.Mesh(topGeometry, topMaterial);
    topMesh.position.y = 80; // desk height
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    deskGroup.add(topMesh);

    // Desk legs
    const legGeometry = new THREE.BoxGeometry(8, 75, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4B2E2E, roughness: 0.6, metalness: 0 });
    const positions = [
        [-96, 37.5, -46], [-96, 37.5, 46],
        [96, 37.5, -46], [96, 37.5, 46]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        leg.receiveShadow = true;
        deskGroup.add(leg);
    });

    // Drawers (3 drawers on the right side)
    for (let i = 0; i < 3; i++) {
        const drawerGeometry = new THREE.BoxGeometry(50, 20, 40);
        const drawerMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.6, metalness: 0.1 });
        const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial);
        drawer.position.set(80, 55 - i*22, 0); // stacked vertically
        drawer.castShadow = true;
        drawer.receiveShadow = true;

        // Drawer handle
        const handleGeometry = new THREE.CylinderGeometry(1.5, 1.5, 20, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.4 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.rotation.z = Math.PI/2;
        handle.position.set(0, 0, 22);
        drawer.add(handle);

        deskGroup.add(drawer);
    }

    return deskGroup;
}

// -------------------------
// Office Chair (static, realistic)
function createOfficeChair() {
    const chairGroup = new THREE.Group();

    // Seat
    const seatGeometry = new THREE.BoxGeometry(100, 15, 50);
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.7, metalness: 0.3 });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 40;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    // Backrest
    const backGeometry = new THREE.BoxGeometry(100, 60, 8);
    const back = new THREE.Mesh(backGeometry, seatMaterial);
    back.position.set(0, 70, -21);
    back.castShadow = true;
    back.receiveShadow = true;
    chairGroup.add(back);

    // Base
    const baseGeometry = new THREE.CylinderGeometry(15, 15, 5, 16);
    const base = new THREE.Mesh(baseGeometry, new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.5 }));
    base.position.y = 5;
    chairGroup.add(base);

    // Chair legs (5-pronged)
    const legLength = 25;
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * legLength;
        const z = Math.sin(angle) * legLength;
        const legGeometry = new THREE.CylinderGeometry(2, 2, 5, 8);
        const leg = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.5 }));
        leg.position.set(x, 2.5, z);
        chairGroup.add(leg);
    }

    return chairGroup;
}


function createMonitor() {
    const monitorGroup = new THREE.Group();

    // Screen
    const screenGeometry = new THREE.BoxGeometry(60, 40, 3); // width, height, depth
    
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ffff, // bright cyan glow
        emissiveIntensity: 2.2,
        roughness: 0.4,
        metalness: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 30, 0);
    screen.castShadow = true;
    screen.receiveShadow = true;
    monitorGroup.add(screen);

    // Stand
    const standGeometry = new THREE.BoxGeometry(10, 15, 10);
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.5 });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.set(0, 15/2, 0);
    monitorGroup.add(stand);



    // Better point light for monitor glow (casts shadows)
const light = new THREE.PointLight(0x00ffff, 1.8, 300, 2); // brighter, limited range
light.position.set(0, 30, 6);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.bias = -0.002;
monitorGroup.add(light);

    return monitorGroup;
}


function createKeyboard() {
    const keyboardGeometry = new THREE.BoxGeometry(50, 3, 15);
    const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.2 });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);

    // Optional keys bumps (just visual effect)
    const keyGeometry = new THREE.BoxGeometry(2, 1, 2);
    const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.1 });
    for (let i = -22; i <= 22; i += 4) {
        for (let j = -6; j <= 6; j += 3) {
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.set(i, 2, j);
            keyboard.add(key);
        }
    }

    return keyboard;
}


function addScaryPainting(sceneGroup) {
    const width = 300; // painting width
    const height = 300; // painting height
    const frameThickness = 10;

    // group for painting + frame
    const paintingGroup = new THREE.Group();
    paintingGroup.position.set(0, height/2 + 100, -500 + 5); // slightly in front of back wall
    paintingGroup.rotation.y = 0; // facing the room

    // FRAME
    const frameGeometry = new THREE.BoxGeometry(width, height, frameThickness);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 0.6 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    paintingGroup.add(frame);

    // PAINTING
    const loader = new THREE.TextureLoader();
    const paintingTexture = loader.load(scaryPaintingURL, () => {
        paintingTexture.encoding = THREE.sRGBEncoding;
    });
    const paintingMaterial = new THREE.MeshStandardMaterial({ map: paintingTexture, side: THREE.FrontSide });
    const paintingGeometry = new THREE.PlaneGeometry(width - 20, height - 20);
    const paintingMesh = new THREE.Mesh(paintingGeometry, paintingMaterial);
    paintingMesh.position.set(0, 0, frameThickness / 2 + 0.5);
    paintingGroup.add(paintingMesh);

    sceneGroup.add(paintingGroup);
}



