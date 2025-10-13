import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { loadTexture } from '../../../utils/loader.js';
import { loadModel } from '../../../utils/loader.js';

// function to create walls
function createWall(width, height, depth, x, y, z, paint, path) {
  const wallgeometry = new THREE.BoxGeometry(width, height, depth);
  const wallmaterial = new THREE.MeshPhongMaterial({ map: path });
  const wall = new THREE.Mesh(wallgeometry, wallmaterial);
  wall.position.set(x, y, z);
  wall.receiveShadow = true;
  return wall;
}

// function to create a floor
function createFloor(width, height, depth, x, y, z, paint, path) {
  const floorgeometry = new THREE.BoxGeometry(width, height, depth);
  const floormaterial = new THREE.MeshPhongMaterial({ map: path });
  const floor = new THREE.Mesh(floorgeometry, floormaterial);
  floor.position.set(x, y, z);
  floor.receiveShadow = true;
  return floor;
}

function createPlane(size = 10000, repeat = 1000, texturePath = null, color = "gray") {
  const loader = new THREE.TextureLoader();
  let material;

  if (texturePath) {
    const texture = loader.load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    material = new THREE.MeshStandardMaterial({ map: texture });
  } else {
    material = new THREE.MeshStandardMaterial({ color });
  }

  const geometry = new THREE.PlaneGeometry(size, size);
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2; // lay flat
  plane.receiveShadow = true;
  return plane;
}

// function to create a door
function createDoor(width, height, depth, x, y, z, texturePath = null, color = "brown") {
  let material;

  if (texturePath) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material = new THREE.MeshPhongMaterial({ map: texture });
  } else {
    material = new THREE.MeshPhongMaterial({ color });
  }

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const door = new THREE.Mesh(geometry, material);
  door.position.set(x, y, z);
  door.castShadow = true;
  door.receiveShadow = true;
  return door;
}

export function createRoom3() {
  const room = new THREE.Group();

  // Textures 
  const texturePaths = {
    floor: '/textures/Floor_3.jpg',
    wall: '/textures/Wall_3.jpg',
    ceiling: '/textures/Ceiling_3.jpg',
    pave: '/textures/Pave_3.jpg',
    door: '/textures/Door_3.jpg'
  };

  // load textures
  const floortexture = loadTexture(texturePaths.floor);
  const walltexture = loadTexture(texturePaths.wall);
  const ceilingTexture = loadTexture(texturePaths.ceiling);
  const paveTexture = loadTexture(texturePaths.pave);
  const doorTexture = loadTexture(texturePaths.door);

  // wrap & repeat tuning
  floortexture.wrapS = THREE.RepeatWrapping; floortexture.wrapT = THREE.RepeatWrapping; floortexture.repeat.set(4, 4);
  walltexture.wrapS = THREE.ClampToEdgeWrapping; walltexture.wrapT = THREE.ClampToEdgeWrapping; walltexture.repeat.set(1, 1);
  ceilingTexture.wrapS = THREE.RepeatWrapping; ceilingTexture.wrapT = THREE.RepeatWrapping; ceilingTexture.repeat.set(2, 2);

  // outside plane (moved below so no z-fight with floor)
  const plane = createPlane(20000, 500, texturePaths.pave);
  plane.position.y = -1.0;
  room.add(plane);

  // ---- Room dimensions ----
  const SIZE = 40;
  const HEIGHT = 15;

  // floor 
  const FLOOR_THICKNESS = 1.0;
  const floor = createFloor(SIZE, FLOOR_THICKNESS, SIZE, 0, 0, 0, "white", floortexture);
  room.add(floor);

  // ceiling
  const ceiling = createFloor(SIZE, 1, SIZE, 0, HEIGHT, 0, "white", ceilingTexture);
  room.add(ceiling);

  // walls
  const wallBack = createWall(SIZE, HEIGHT, 1, 0, HEIGHT / 2, -SIZE / 2 + 0.5, "white", walltexture);
  room.add(wallBack);

  // front wall segments + centered door 
  const doorWidth = 8;
  const doorHeight = 10;
  const wallDepth = 1;
  const frontSegWidth = (SIZE - doorWidth) / 2;

  const frontLeft = createWall(
    frontSegWidth,
    HEIGHT,
    wallDepth,
    - (doorWidth / 2 + frontSegWidth / 2),
    HEIGHT / 2,
    SIZE / 2 - 0.5,
    "white",
    walltexture
  );
  room.add(frontLeft);

  const frontRight = createWall(
    frontSegWidth,
    HEIGHT,
    wallDepth,
    (doorWidth / 2 + frontSegWidth / 2),
    HEIGHT / 2,
    SIZE / 2 - 0.5,
    "white",
    walltexture
  );
  room.add(frontRight);

  const wallLeft = createWall(1, HEIGHT, SIZE, -SIZE / 2 + 0.5, HEIGHT / 2, 0, "white", walltexture);
  room.add(wallLeft);
  const wallRight = createWall(1, HEIGHT, SIZE, SIZE / 2 - 0.5, HEIGHT / 2, 0, "white", walltexture);
  room.add(wallRight);

  // Door
  const door = createDoor(doorWidth, doorHeight, 1, 0, doorHeight / 2, SIZE / 2 - 0.8, texturePaths.door);
  door.castShadow = true;
  room.add(door);

  // Header above the door 
  const headerHeight = HEIGHT - doorHeight;
  if (headerHeight > 0) {
    const header = createWall(
      doorWidth,
      headerHeight,
      wallDepth,
      0,
      doorHeight + headerHeight / 2,
      SIZE / 2 - 0.5,
      "white",
      walltexture
    );
    room.add(header);
  }

  // skirting (position top flush with floor top)
  const skThick = 0.25;
  const floorTopY = 0 + FLOOR_THICKNESS / 2; // 0.5
  const skCenterY = floorTopY - skThick / 2;
  const skBack = createWall(SIZE, skThick, skThick, 0, skCenterY, -SIZE / 2 + skThick / 2, "white", walltexture);
  const skFront = createWall(SIZE, skThick, skThick, 0, skCenterY, SIZE / 2 - skThick / 2, "white", walltexture);
  const skLeft = createWall(skThick, skThick, SIZE, -SIZE / 2 + skThick / 2, skCenterY, 0, "white", walltexture);
  const skRight = createWall(skThick, skThick, SIZE, SIZE / 2 - skThick / 2, skCenterY, 0, "white", walltexture);
  [skBack, skFront, skLeft, skRight].forEach(s => room.add(s));

  // ---- Lighting ----
  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  room.add(ambient);

  // Light attached to the ceiling lamp model

  const doorSpot = new THREE.SpotLight(0xffd27f, 1.2, 40, Math.PI / 6, 0.4, 1);
  doorSpot.position.set(0, HEIGHT - 4, SIZE / 2 - 3);
  doorSpot.target.position.set(0, 3.5, SIZE / 2 - 1);
  doorSpot.castShadow = true;
  doorSpot.shadow.mapSize.width = 1024;
  doorSpot.shadow.mapSize.height = 1024;
  room.add(doorSpot);
  room.add(doorSpot.target);

  const dir = new THREE.DirectionalLight(0xffffff, 0.3);
  dir.position.set(-30, 40, 20);
  dir.castShadow = true;
  dir.shadow.mapSize.width = 2048;
  dir.shadow.mapSize.height = 2048;
  room.add(dir);

  // ----------------- MODELS -----------------

  // Ceiling lamp model: positioned at center of room on ceiling
  loadModel('/models/ceiling_lamp.glb', {}, (lamp) => {
    const bbox = new THREE.Box3().setFromObject(lamp);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale lamp to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.1;
    const uniformScale = desiredMax / maxHorizontal;
    lamp.scale.multiplyScalar(uniformScale);

    // Position at center of room on ceiling
    lamp.position.set(0, HEIGHT - 1, 0);
    
    // Add light to the lamp
    const bulbLight = new THREE.PointLight(0xfff7e6, 8, 80);
    bulbLight.position.set(0, 0, 0); // Relative to lamp position
    bulbLight.castShadow = true;
    bulbLight.shadow.mapSize.width = 2048;
    bulbLight.shadow.mapSize.height = 2048;
    bulbLight.shadow.bias = -0.003;
    lamp.add(bulbLight);

    lamp.castShadow = true;
    lamp.receiveShadow = true;
    room.add(lamp);
  });


  // Couch model: centered in the room and scaled to fit comfortably
  loadModel('/models/old_couch.glb', {}, (couch) => {
    // Compute current size
    const bbox = new THREE.Box3().setFromObject(couch);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Target the longest horizontal side (x or z) to be 40% of room size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.3;
    const uniformScale = desiredMax / maxHorizontal;
    couch.scale.multiplyScalar(uniformScale);

    // Recompute bounds after scaling to floor the model properly
    const bboxScaled = new THREE.Box3().setFromObject(couch);

    // Center in XZ and place on floor (y = 0 top surface)
    couch.position.set(10, 0, 0);
    const bottomY = bboxScaled.min.y;
    couch.position.y -= bottomY;

    // Face the door/front if needed
    couch.rotation.y = Math.PI/2;

    couch.castShadow = true;
    couch.receiveShadow = true;
    room.add(couch);
  });


  // TV model: placed at room center and scaled to fit
  loadModel('/models/tv.glb', {}, (tv) => {
    const bbox = new THREE.Box3().setFromObject(tv);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Keep TV relatively compact at the center
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.15;
    const uniformScale = desiredMax / maxHorizontal;
    tv.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(tv);
    tv.position.set(18, 0, 0);
    const bottomY = bboxScaled.min.y;
    tv.position.y -= bottomY;
    tv.rotation.y = Math.PI/2;

    tv.castShadow = true;
    tv.receiveShadow = true;
    room.add(tv);
  });

  // Dead body model: placed at room center
  loadModel('/models/dead_body.glb', {}, (body) => {
    const bbox = new THREE.Box3().setFromObject(body);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale body to reasonable size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.2;
    const uniformScale = desiredMax / maxHorizontal;
    body.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(body);
    body.position.set(0, 0.5, 0);
    const bottomY = bboxScaled.min.y;
    body.position.y -= bottomY;

    body.castShadow = true;
    body.receiveShadow = true;
    room.add(body);
  });

  // Chucky doll model: placed next to the couch
  loadModel('/models/chucky.glb', {}, (doll) => {
    const bbox = new THREE.Box3().setFromObject(doll);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale doll to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.05;
    const uniformScale = desiredMax / maxHorizontal;
    doll.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(doll);
    // Position next to couch (couch is at x=10, so place doll at x=15)
    doll.position.set(15, 1, -15);
    const bottomY = bboxScaled.min.y;
    doll.position.y -= bottomY;
    doll.rotation.y = -Math.PI/2;

    doll.castShadow = true;
    doll.receiveShadow = true;
    room.add(doll);
  });

  // Bloody cabinet model: placed at room center
  loadModel('/models/bloody_cabinet.glb', {}, (cabinet) => {
    const bbox = new THREE.Box3().setFromObject(cabinet);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale cabinet to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.3;
    const uniformScale = desiredMax / maxHorizontal;
    cabinet.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(cabinet);
    cabinet.position.set(-17.6, 0, 0);
    const bottomY = bboxScaled.min.y;
    cabinet.position.y -= bottomY;

    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    room.add(cabinet);
  });

  // Human skull model: placed at room center
  loadModel('./models/human_skull.glb', {}, (skull) => {
    const bbox = new THREE.Box3().setFromObject(skull);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale skull to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.08;
    const uniformScale = desiredMax / maxHorizontal;
    skull.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(skull);
    skull.position.set(20, 0, 12);
    const bottomY = bboxScaled.min.y;
    skull.position.y -= bottomY;

    skull.rotation.y = -Math.PI/2;
    skull.castShadow = true;
    skull.receiveShadow = true;
    room.add(skull);
  });

  // Display cabinet model: placed at room center
  loadModel('/models/display_cabinet.glb', {}, (displayCabinet) => {
    const bbox = new THREE.Box3().setFromObject(displayCabinet);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale display cabinet to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.25;
    const uniformScale = desiredMax / maxHorizontal;
    displayCabinet.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(displayCabinet);
    displayCabinet.position.set(-10, 0, 18);
    const bottomY = bboxScaled.min.y;
    displayCabinet.position.y -= bottomY;
    displayCabinet.rotation.y = Math.PI/2;

    displayCabinet.castShadow = true;
    displayCabinet.receiveShadow = true;
    room.add(displayCabinet);
  });

  // Metal cabinet model: placed at room center
  loadModel('/models/metal_cabinet.glb', {}, (metalCabinet) => {
    const bbox = new THREE.Box3().setFromObject(metalCabinet);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale metal cabinet to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.22;
    const uniformScale = desiredMax / maxHorizontal;
    metalCabinet.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(metalCabinet);
    metalCabinet.position.set(10, 0, -18.2);
    const bottomY = bboxScaled.min.y;
    metalCabinet.position.y -= bottomY;
    metalCabinet.rotation.y = Math.PI/2;

    metalCabinet.castShadow = true;
    metalCabinet.receiveShadow = true;
    room.add(metalCabinet);
  });

  // Torture table model: placed at room center
  loadModel('/models/torture_table.glb', {}, (tortureTable) => {
    const bbox = new THREE.Box3().setFromObject(tortureTable);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale torture table to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.15;
    const uniformScale = desiredMax / maxHorizontal;
    tortureTable.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(tortureTable);
    tortureTable.position.set(-18, 0, 15);
    const bottomY = bboxScaled.min.y;
    tortureTable.position.y -= bottomY;
    tortureTable.rotation.y = Math.PI/2;

    tortureTable.castShadow = true;
    tortureTable.receiveShadow = true;
    room.add(tortureTable);
  });

  // Gore model: placed at room center
  loadModel('/models/gore.glb', {}, (gore) => {
    const bbox = new THREE.Box3().setFromObject(gore);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale gore to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.12;
    const uniformScale = desiredMax / maxHorizontal;
    gore.scale.multiplyScalar(uniformScale);

    // Recompute to sit on floor
    const bboxScaled = new THREE.Box3().setFromObject(gore);
    gore.position.set(-5, 0.5, 0);
    const bottomY = bboxScaled.min.y;
    gore.position.y -= bottomY;

    gore.castShadow = true;
    gore.receiveShadow = true;
    room.add(gore);
  });

  // Painting model: hung on wall above torture table
  loadModel('/models/painting.glb', {}, (painting) => {
    const bbox = new THREE.Box3().setFromObject(painting);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Scale painting to appropriate size
    const maxHorizontal = Math.max(size.x, size.z) || 1;
    const desiredMax = SIZE * 0.08;
    const uniformScale = desiredMax / maxHorizontal;
    painting.scale.multiplyScalar(uniformScale);

    painting.position.set(-19, 5, 8);
    
    // Rotate to face into the room
    painting.rotation.y = 0;

    painting.castShadow = true;
    painting.receiveShadow = true;
    room.add(painting);
  });


  // Chest model: added using the same loadModel callback pattern as Room1
  loadModel('/models/chest.glb',
    { x: -SIZE / 2.3 + 2, y: 0, z: -SIZE / 2 + 6, scale: 0.005, rotation: { y: Math.PI / 2 } },
    (chest) => {
      chest.castShadow = true;
      chest.receiveShadow = true;
      room.add(chest);
    }
  );

  // ensure all meshes cast and receive shadows properly
  room.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return room;
}
