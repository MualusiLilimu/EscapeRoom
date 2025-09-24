// room2.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

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
    // Wall materials with slight reflection (diffuse visible)
    const frontWallMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2e2e, roughness: 0.6, metalness: 0 });
    const backWallMaterial  = new THREE.MeshStandardMaterial({ color: 0x4b2e2e, roughness: 0.6, metalness: 0 });
    const leftWallMaterial  = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.6, metalness: 0 });
    const rightWallMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.6, metalness: 0 });

    // -------------------------
    // Front wall
    const frontWall = new THREE.Mesh(wallGeometryWidth, frontWallMaterial);
    frontWall.position.set(0, roomHeight / 2, roomDepth / 2 + wallThickness / 2);
    frontWall.receiveShadow = true;
    room.add(frontWall);

    // Back wall
    const backWall = new THREE.Mesh(wallGeometryWidth, backWallMaterial);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2 - wallThickness / 2);
    backWall.receiveShadow = true;
    room.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(wallGeometryDepth, leftWallMaterial);
    leftWall.position.set(-roomWidth / 2 - wallThickness / 2, roomHeight / 2, 0);
    leftWall.receiveShadow = true;
    room.add(leftWall);

    // Right wall
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

    // -------------------------
    // Door
    const door = createDoor(170, 400, 10, 0xffffff, 0, 200, roomDepth / 2 + wallThickness / 2);
    room.add(door);

    // -------------------------
    // Ceiling Point Lights
    const lightDistance = 3200;
    const lightIntensity = 10.5;
    const lightDecay = 2;

    const cornerOffsets = [
        [-roomWidth / 2 + 50, roomHeight - 20, -roomDepth / 2 + 50],
        [-roomWidth / 2 + 50, roomHeight - 20, roomDepth / 2 - 50],
        [roomWidth / 2 - 50, roomHeight - 20, -roomDepth / 2 + 50],
        [roomWidth / 2 - 50, roomHeight - 20, roomDepth / 2 - 50]
    ];

    cornerOffsets.forEach(pos => {
        const light = new THREE.PointLight(0xffffff, lightIntensity, lightDistance, lightDecay);
        light.position.set(...pos);
        light.castShadow = true;
        room.add(light);

        const bulbGeometry = new THREE.SphereGeometry(10, 16, 16);
        const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffaa, emissiveIntensity: 1 });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.set(...pos);
        room.add(bulb);
    });

    const centerLight = new THREE.PointLight(0xffffff, lightIntensity, lightDistance, lightDecay);
    centerLight.position.set(0, roomHeight - 20, 0);
    centerLight.castShadow = true;
    room.add(centerLight);

    const centerBulbGeometry = new THREE.SphereGeometry(12, 16, 16);
    const centerBulbMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffaa, emissiveIntensity: 1 });
    const centerBulb = new THREE.Mesh(centerBulbGeometry, centerBulbMaterial);
    centerBulb.position.set(0, roomHeight - 20, 0);
    room.add(centerBulb);

    // -------------------------
    // Add curtain window on LEFT wall
    const curtainWindow = createCurtainWindow(300, 300, -roomWidth/2 - wallThickness/2 + 1, 300, 0);
    room.add(curtainWindow);

    return room;
}

// -------------------------
// Door Function
// -------------------------
function createDoor(width, height, depth, color, posX, posY, posZ) {
    const doorGroup = new THREE.Group();

    const doorGeometry = new THREE.BoxGeometry(width, height, depth);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0, roughness: 1 });
    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    doorMesh.position.set(0, height / 2, 0);
    doorGroup.add(doorMesh);

    const handleGeometry = new THREE.CylinderGeometry(12, 12, 50, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.5, roughness: 0.5 });
    const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.position.set(width / 2 - 10, height / 2, depth / 2 + 10);
    doorGroup.add(handleMesh);

    doorGroup.position.set(posX, 0, posZ);
    return doorGroup;
}

// -------------------------
// Floor Function
// -------------------------
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
// Realistic Window with Animated Curtains
// -------------------------
function createCurtainWindow(width, height, posX, posY, posZ) {
    const group = new THREE.Group();

    // Rotate window to face into room
    group.rotation.y = Math.PI / 2;
    group.position.set(posX, posY, posZ);

    // Window frame
    const frameThickness = 15;
    const frameGeometry = new THREE.BoxGeometry(width, height, frameThickness);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 0.6 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0, 0);
    group.add(frame);

    // Glass with city view
    const textureLoader = new THREE.TextureLoader();
    const cityTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'); // replace with tall building/city texture
    const glassGeometry = new THREE.PlaneGeometry(width - 20, height - 20);
 const glassMaterial = new THREE.MeshStandardMaterial({
    map: cityTexture,
    transparent: true,
    opacity: 1,           // fully opaque, optional
    roughness: 1,         // max roughness → no reflection
    metalness: 0,         // no metal → no shine
    emissive: 0x000000,   // no glow
});
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, 0, frameThickness / 2 + 0.1);
    group.add(glass);

    // Curtain rail
    const railGeometry = new THREE.CylinderGeometry(5, 5, width + 20, 16);
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, height / 2 + 10, frameThickness / 2 + 1);
    group.add(rail);

    // Curtains
    const curtainWidth = (width - 40) / 2;
    const curtainHeight = height;
    const curtainGeometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight, 20, 20);
    const curtainMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    leftCurtain.position.set(-curtainWidth / 2 - 10, 0, frameThickness / 2 + 2);
    group.add(leftCurtain);

    const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    rightCurtain.position.set(curtainWidth / 2 + 10, 0, frameThickness / 2 + 2);
    group.add(rightCurtain);

    // Animate curtains: small horizontal swing like cloth
    group.userData.animate = (time) => {
        const amplitude = 2.5; // small displacement
        const speed = 0.0015; // slow swing

        const leftPos = leftCurtain.geometry.attributes.position.array;
        const rightPos = rightCurtain.geometry.attributes.position.array;

        for (let i = 0; i < leftPos.length; i += 3) {
            leftPos[i] = leftCurtain.position.x + Math.sin(time * speed + leftPos[i + 1] * 0.03) * amplitude;
            rightPos[i] = rightCurtain.position.x + Math.sin(time * speed + rightPos[i + 1] * 0.03 + 1) * amplitude;
        }

        leftCurtain.geometry.attributes.position.needsUpdate = true;
        rightCurtain.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}

