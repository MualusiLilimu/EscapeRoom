// room2.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';





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
    // const curtainWindow = createCurtainWindow(300, 300, -roomWidth/2 - wallThickness/2 + 1, 300, 0);
    // room.add(curtainWindow);

    // Replace window with "picture" placeholder
const picture = createPictureOnWall(
    300, 300,
    -roomWidth/2 + 5, 300, 0,
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    Math.PI / 2  // <-- THIS IS THE ROTATION
);







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





// Load realistic sofa facing opposite the window
loadSofa(
    { x: 150, y: 0, z: -10 }, // adjust position as needed
    150,                       // scale
    room                     // add to the room group
);

// Load drawer at back wall, left corner
loadDrawer(
    { x: -roomWidth / 2 + 200, y: 0, z: -roomDepth / 2 + 150 }, // adjust as needed
    200,  // scale
    room
);


// Place table in front of sofa
loadTable(
    { x: 150, y: 0, z: 100 }, // tweak 'z' to control distance from sofa
    120, // scale to match room and sofa
    room
);

// Place treasure chest slightly behind sofa
loadTreasureChest(
    { x: 150, y: 0, z: -80 }, // tweak z for "behind"
    50,  // smaller scale so it fits
    room
);










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
    doorTexture.encoding = THREE.sRGBEncoding;

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


function loadSofa(position = {x:0, y:0, z:0}, scale = 1, sceneGroup) {
    const loader = new GLTFLoader();

    loader.load(
        'models/sofa/sofa_02_4k.gltf',
        function (gltf) {
            console.log("Sofa loaded successfully!"); // <- check console

            const sofa = gltf.scene;
            sofa.scale.set(scale, scale, scale);
            sofa.position.set(position.x, position.y, position.z);
            sofa.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            sceneGroup.add(sofa);
        },
        undefined,
        function (error) {
            console.error('Error loading sofa:', error);
        }
    );
}


function loadDrawer(position = {x:0, y:0, z:0}, scale = 1, sceneGroup) {
    console.log("Calling loadDrawer at position:", position, "with scale:", scale); // <- NEW

    const loader = new GLTFLoader();

    loader.load(
        'models/drwing/painted_wooden_cabinet_4k.gltf',
        function(gltf) {
            console.log("Drawer model loaded successfully!"); // <- NEW
            const drawer = gltf.scene;
            drawer.scale.set(scale, scale, scale);
            drawer.position.set(position.x, position.y, position.z);

            drawer.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            sceneGroup.add(drawer);
            console.log("Drawer added to sceneGroup!"); // <- NEW
        },
        undefined,
        function(error) {
            console.error('Error loading drawer:', error);
        }
    );
}

// Load round wooden table in front of sofa
function loadTable(position = {x:0, y:0, z:0}, scale = 1, sceneGroup) {
    const loader = new GLTFLoader();

    loader.load(
        'models/tafel/round_wooden_table_02_4k.gltf',
        function (gltf) {
            console.log("Table loaded successfully!");
            const table = gltf.scene;
            table.scale.set(scale, scale, scale);
            table.position.set(position.x, position.y, position.z);
            table.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            sceneGroup.add(table);
        },
        undefined,
        function (error) {
            console.error('Error loading table:', error);
        }
    );
}


// Load treasure chest
function loadTreasureChest(position = {x:0, y:0, z:0}, scale = 1, sceneGroup) {
    const loader = new GLTFLoader();

    loader.load(
        'models/treasure_chest_4k.gltf/treasure_chest_4k.gltf',
        function (gltf) {
            console.log("Treasure chest loaded successfully!");
            const chest = gltf.scene;
            chest.scale.set(scale, scale, scale);
            chest.position.set(position.x, position.y, position.z);

            chest.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            sceneGroup.add(chest);
        },
        undefined,
        function (error) {
            console.error('Error loading treasure chest:', error);
        }
    );
}


function createPictureOnWall(width, height, posX, posY, posZ, imageURL, rotationY = 0) {
    const group = new THREE.Group();
    group.position.set(posX, posY, posZ);
    group.rotation.y = rotationY; // rotate to face the room

    const frameThickness = 15;

    // FRAME
    const frameGeometry = new THREE.BoxGeometry(width, height, frameThickness);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 0.6 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0, 0);
    group.add(frame);

    // PICTURE
    const textureLoader = new THREE.TextureLoader();
    const pictureTexture = textureLoader.load(
        imageURL,
        () => { pictureTexture.encoding = THREE.sRGBEncoding; } // ensure correct colors
    );

    const pictureGeometry = new THREE.PlaneGeometry(width - 20, height - 20);
    const pictureMaterial = new THREE.MeshStandardMaterial({
        map: pictureTexture,
        side: THREE.FrontSide
    });

    const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);

    // Place picture slightly in front of the frame
    picture.position.set(0, 0, frameThickness / 2 + 0.5);
    group.add(picture);

    return group;
}



