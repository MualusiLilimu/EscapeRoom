// room2.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function createRoom2() {
    const room = new THREE.Group();

    // Room dimensions
    const roomWidth = 1200;
    const roomDepth = 1000;
    const roomHeight = 600;
    const wallThickness = 10;

    // Wall material (dark brown)
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2e2e });

    // Wall geometries
    const wallGeometryWidth = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness); // front/back
    const wallGeometryDepth = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth); // left/right

    // Front wall
    const frontWall = new THREE.Mesh(wallGeometryWidth, wallMaterial);
    frontWall.position.set(0, roomHeight / 2, roomDepth / 2 + wallThickness / 2);
    room.add(frontWall);

    // Back wall
    const backWall = new THREE.Mesh(wallGeometryWidth, wallMaterial);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2 - wallThickness / 2);
    room.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(wallGeometryDepth, wallMaterial);
    leftWall.position.set(-roomWidth / 2 - wallThickness / 2, roomHeight / 2, 0);
    room.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(wallGeometryDepth, wallMaterial);
    rightWall.position.set(roomWidth / 2 + wallThickness / 2, roomHeight / 2, 0);
    room.add(rightWall);

    // Add the door
    // Parameters: width, height, depth, color, position x, y, z
    const door = createDoor(170, 400, 10, 0xffffff, 0, 200, roomDepth / 2 + wallThickness / 2);
    room.add(door);

    return room;
}

// -------------------------
// Door Function
// -------------------------
function createDoor(width, height, depth, color, posX, posY, posZ) {
    const doorGroup = new THREE.Group();

    // Door mesh
    const doorGeometry = new THREE.BoxGeometry(width, height, depth);
    
    const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // orange
    metalness: 0,    // not metallic
    roughness: 1     // fully rough, no shine
});

    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);

    // Position door
    doorMesh.position.set(0, height / 2, 0);
    doorGroup.add(doorMesh);

    // Handle
    const handleGeometry = new THREE.CylinderGeometry(12, 12, 50, 16);

    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.5, roughness: 0.5 });


    const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);

    // Position handle (slightly right side of door, mid-height)
    handleMesh.rotation.z = Math.PI / 2; // horizontal
    handleMesh.position.set(width / 2 - 10, height / 2, depth / 2 + 10);

    doorGroup.add(handleMesh);

    // Position entire door group in the room
    doorGroup.position.set(posX, 0, posZ);

    return doorGroup;
}
