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
    // Wall materials
    const frontWallMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2e2e, roughness: 0.6, metalness: 0 }); // brown
    const backWallMaterial  = new THREE.MeshStandardMaterial({ color: 0x4b2e2e, roughness: 0.6, metalness: 0 }); // brown

    // Brick texture for side walls
    const textureLoader = new THREE.TextureLoader();
    const brickTexture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');
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

    // -------------------------
    // Door (realistic with frame and handle)
    const door = createDoorWithFrame(170, 400, 10, 0, 200, roomDepth / 2 + wallThickness / 2);
    room.add(door);

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

    // -------------------------
    // Curtain window on LEFT wall
    const curtainWindow = createCurtainWindow(300, 300, -roomWidth/2 - wallThickness/2 + 1, 300, 0);
    room.add(curtainWindow);

    return room;
}

// -------------------------
// REALISTIC Door with Frame and Handle
function createDoorWithFrame(width, height, depth, posX, posY, posZ) {
    const doorGroup = new THREE.Group();

    // Door frame
    const frameThickness = 10;
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0 });
    const frameGeometry = new THREE.BoxGeometry(width + frameThickness*2, height + frameThickness*2, depth + frameThickness);
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, height/2, 0);
    frame.castShadow = true;
    frame.receiveShadow = true;
    doorGroup.add(frame);

    // Door panel
    const textureLoader = new THREE.TextureLoader();
    const doorTexture = textureLoader.load('https://threejs.org/examples/textures/wood.jpg');
    doorTexture.wrapS = doorTexture.wrapT = THREE.RepeatWrapping;
    doorTexture.repeat.set(1,1);
    const doorMaterial = new THREE.MeshStandardMaterial({ map: doorTexture, roughness: 1, metalness: 0 });
    const doorGeometry = new THREE.BoxGeometry(width, height, depth);
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, height/2, 0);
    door.castShadow = true;
    door.receiveShadow = true;
    doorGroup.add(door);

    // Handle
    const handleGeometry = new THREE.CylinderGeometry(25, 4, 30, 32);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: "red", metalness: 0.8, roughness: 0.4 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI/2;
    handle.position.set(width/2 - 15, height/2, depth/2 + 2);
    handle.castShadow = true;
    handle.receiveShadow = true;
    doorGroup.add(handle);

    doorGroup.position.set(posX, 0, posZ);

    return doorGroup;
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
// Curtain Window Function (unchanged)
function createCurtainWindow(width, height, posX, posY, posZ) {
    const group = new THREE.Group();
    group.rotation.y = Math.PI / 2;
    group.position.set(posX, posY, posZ);

    const frameThickness = 15;
    const frameGeometry = new THREE.BoxGeometry(width, height, frameThickness);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 0.6 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0, 0);
    group.add(frame);

    const textureLoader = new THREE.TextureLoader();
    const cityTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const glassGeometry = new THREE.PlaneGeometry(width - 20, height - 20);
    const glassMaterial = new THREE.MeshBasicMaterial({
        map: cityTexture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, 0, frameThickness / 2 + 0.1);
    group.add(glass);

    const railGeometry = new THREE.CylinderGeometry(5, 5, width + 20, 16);
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, height / 2 + 10, frameThickness / 2 + 1);
    group.add(rail);

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

    group.userData.animate = (time) => {
        const amplitude = 2.5;
        const speed = 0.0015;
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
