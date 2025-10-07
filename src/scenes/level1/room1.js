// Fixed version with proper variable declaration
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import {loadTexture} from '../../../utils/loader.js';
import { loadModel } from '../../../utils/loader.js';
import { Scene } from 'three';

// Fixed: Added 'const' declaration
const puzz1Models = new THREE.Group();
puzz1Models.name = "puzz1Models"; // Added name for easier debugging
export function createTexturedNote(
  scene,
  texturePath,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 }
) {
  loadModel(
    '/public/models/post_it_notes.glb',
    {
      x: position.x,
      y: position.y,
      z: position.z,
      scale: 5,
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
    },
    (notes) => {
      notes.name = "customNote";
      notes.userData.interactable = true;
      scene.add(notes);

      // Hide all other note meshes except the target
      notes.traverse((child) => {
        if (child.isMesh && child.name !== 'Object_8') {
          child.visible = false;
        }
      });

      // Load the overlay image (writing)
      const textureLoader = new THREE.TextureLoader();
      const targetNote = notes.getObjectByName('Object_8');

      if (!targetNote) {
        console.warn('Target note mesh not found!');
        return;
      }

      // Create a combined texture (base + overlay)
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Fill canvas with base sticky note color
      ctx.fillStyle = '#ffffaa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load PNG and draw it centered
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const combinedTexture = new THREE.CanvasTexture(canvas);
        combinedTexture.needsUpdate = true;

        // Apply texture to the note
        targetNote.material = new THREE.MeshStandardMaterial({
          map: combinedTexture,
          side: THREE.DoubleSide,
        });
      };
      img.src = texturePath;
    }
  );
}


// function to create walls
function createWall(width, height, depth, x, y, z, paint, path) {
  const wallgeometry = new THREE.BoxGeometry(width, height, depth);
  const wallmaterial = new THREE.MeshPhongMaterial({ map: path});
  const wall = new THREE.Mesh(wallgeometry, wallmaterial);
  wall.position.set(x, y, z);
  return wall;
}

// function to create a floor
function createFloor(width, height, depth, x, y, z, paint, path){
  const floorgeometry = new THREE.BoxGeometry(width, height, depth);
  const floormaterial = new THREE.MeshPhongMaterial({map: path});
  const floor = new THREE.Mesh(floorgeometry, floormaterial);
  floor.position.set(x, y, z);
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
  plane.rotation.x = -Math.PI / 2;
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
  return door;
}

export function createRoom1() {
    const room = new THREE.Group();
    
    const plane = createPlane(20000, 1000, '/public/textures/pave.jpg');
    plane.name = "ground"; // Added name for debugging
    room.add(plane);

    const floortexture = loadTexture('/public/textures/tile.jpg');
    floortexture.wrapS = THREE.RepeatWrapping;
    floortexture.wrapT = THREE.RepeatWrapping;
    floortexture.repeat.set(1.5, 1);
    const walltexture = loadTexture('/public/textures/wall.jpg');
    const ceilingTexture = loadTexture('/public/textures/ceiling.jpg');
    walltexture.wrapS = THREE.RepeatWrapping;
    walltexture.wrapT = THREE.RepeatWrapping;

    // floor
    const floor1 = createFloor(30, 1, 30, 0, 0, 0, "white", floortexture); 
    floor1.name = "floor1";
    room.add(floor1);

    const floor2 = createFloor(60, 1, 15, 15, 0, 22.5, "white", floortexture);
    floor2.name = "floor2";
    room.add(floor2);

    //ceiling
    const ceiling1 = createFloor(30, 1, 30, 0, 16, 0, "white", ceilingTexture); 
    ceiling1.name = "ceiling1";
    room.add(ceiling1);

    const ceiling2 = createFloor(60, 1, 15, 15, 16, 22.5, "white", ceilingTexture);
    ceiling2.name = "ceiling2";
    room.add(ceiling2);
 
    // walls
    const wall1 = createWall(30, 15, 1, 0, 8, -14.5, "white", walltexture);
    wall1.receiveShadow = true;
    wall1.name = "wall1";
    room.add(wall1);

    const wall2 = createWall(1, 15, 30, 14.5, 8, 0, "white", walltexture);
    wall2.receiveShadow = true;
    wall2.name = "wall2";
    room.add(wall2);

    const wall3 = createWall(1, 15, 30, -14.5, 8, 0, "white", walltexture);
    wall3.receiveShadow = true;
    wall3.name = "wall3";
    room.add(wall3);

    const wall4 = createWall(1, 15, 15, -14.5, 8, 22.5, "white", walltexture);
    wall4.receiveShadow = true;
    wall4.name = "wall4";
    room.add(wall4);

    const wall5 = createWall(60, 15, 1, 15, 8, 29.5, "white", walltexture);
    wall5.receiveShadow = true;
    wall5.name = "wall5";
    room.add(wall5);

    const wall6 = createWall(31, 15, 1, 29.5, 8, 15.5, "white", walltexture);
    wall6.receiveShadow = true;
    wall6.name = "wall6";
    room.add(wall6);

    const wall7 = createWall(1, 15, 4, 44.5, 8, 18, "white", walltexture);
    wall7.receiveShadow = true;
    wall7.name = "wall7";
    room.add(wall7);

    const wall8 = createWall(1, 15, 4, 44.5, 8, 27, "white", walltexture);
    wall8.receiveShadow = true;
    wall8.name = "wall8";
    room.add(wall8);

    const wall9 = createWall(1, 5, 5, 44.5, 13, 22.5, "white", walltexture);
    wall9.receiveShadow = true;
    wall9.name = "wall9";
    room.add(wall9);

    //door
    const doorTexture = '/public/textures/door.jpeg';
    const door = createDoor(1, 10, 5, 44.5, 5.5, 22.5, doorTexture); 
    door.name = "door";
    room.add(door);

    //////////// Furnitures //////////////////////

    //cage
    loadModel('/public/models/cage.glb',
      {x: -8, y: 0, z: -9, scale: 0.05},
      (cage) => {
        cage.name = "cage";
        cage.userData.interactable = true;
        cage.userData.type = "cage";
        room.add(cage);
      }
    );


    const paintingtexture = loadTexture('/public/textures/painting-min.jpg');

    const painting = createFloor(7, 4.6, 0.1, 3.5, 8, -13.8, "white", paintingtexture); 
    const rgbtexture = loadTexture('/public/textures/rgb.png');

    const rgb = createFloor(7, 4.6, 0.1, 3.5, 8, 28.9, "white", rgbtexture);
    
    room.add(rgb)
    room.add(painting)
    const puzz1light1 = new THREE.PointLight(0xfff2cc, 10, 50); 
        puzz1light1.position.set(-13, 10, 20);
        puzz1light1.castShadow = false;
        puzz1light1.shadow.bias = -0.003;
        puzz1light1.name = "Light1";
        puzz1light1.traverse((child) => {
          if (child !== puzz1light1) {
            child.userData.parentName = "Light1";
          }
        });

    const puzz1light2 = new THREE.PointLight(0xfff2cc, 10, 50); 
        puzz1light2.position.set(-13, 10, 23);
        puzz1light2.castShadow = false;
        puzz1light2.shadow.bias = -0.003;
        puzz1light2.name = "Light2";
        puzz1light2.traverse((child) => {
          if (child !== puzz1light2) {
            child.userData.parentName = "Light2";
          }
        });
    
    const puzz1light3 = new THREE.PointLight(0xfff2cc, 10, 50); 
        puzz1light3.position.set(-13, 10, 26);
        puzz1light3.castShadow = false;
        puzz1light3.shadow.bias = -0.003;
        puzz1light3.name = "Light3";
        puzz1light3.traverse((child) => {
          if (child !== puzz1light3) {
            child.userData.parentName = "Light3";
          }
        });
   puzz1Models.add(puzz1light1);
   puzz1Models.add(puzz1light2);
   puzz1Models.add(puzz1light3);
   
    loadModel('/public/models/puzzLight.glb',
      {x: -14, y: 9, z: 20, scale: 0.03, rotation: {y: -Math.PI}},
      (light) => {
        light.name = "puzzLight1";
        light.userData.interactable = true;
        light.userData.type = "puzzLight1";
        // Set name on all children too
        light.traverse((child) => {
          if (child !== light) {
            child.userData.parentName = "puzzLight1";
          }
        });
        puzz1Models.add(light);
      }
    );
    loadModel('/public/models/key.glb',
      {x: -10, y: 0, z: 23, scale: 0.003, rotation: {x: Math.PI/2}},
      (loadkey) => {
        loadkey.name = "key1";
        loadkey.userData.interactable = true;
        loadkey.userData.type = "key1";
        // Set name on all children too
        loadkey.traverse((child) => {
          if (child !== loadkey) {
            child.userData.parentName = "key1";
          }
        });
        puzz1Models.add(loadkey);
      }
    );
    loadModel('/public/models/puzzLight.glb',
      {x: -14, y: 9, z: 23, scale: 0.03, rotation: {y: -Math.PI}},
      (light) => {
        light.name = "puzzLight2";
        light.userData.interactable = true;
        light.userData.type = "puzzLight2";
        // Set name on all children too
        light.traverse((child) => {
          if (child !== light) {
            child.userData.parentName = "puzzLight2";
          }
        });
        puzz1Models.add(light);
      }
    );
    loadModel('/public/models/puzzLight.glb',
      {x: -14, y: 9, z: 26, scale: 0.03, rotation: {y: -Math.PI}},
      (light) => {
        light.name = "puzzLight3";
        light.userData.interactable = true;
        light.userData.type = "puzzLight3";
        // Set name on all children too
        light.traverse((child) => {
          if (child !== light) {
            child.userData.parentName = "puzzLight3";
          }
        });
        puzz1Models.add(light);
      }
    );
    loadModel('/public/models/button.glb',
      {x: -14, y: 7, z: 20, scale: 0.3, rotation: {z: -Math.PI/2}},
      (light) => {
        light.name = "button1";
        light.userData.interactable = true;
        light.userData.type = "button1";
        // Set name on all children too
        light.traverse((child) => {
          if (child !== light) {
            child.userData.parentName = "button1";
          }
        });
        puzz1Models.add(light);
      }
    );
    loadModel('/public/models/button.glb',
      {x: -14, y: 7, z: 23, scale: 0.3, rotation: {z: -Math.PI/2}},
      (light) => {
        light.name = "button2";
        light.userData.interactable = true;
        light.userData.type = "button2";
        // Set name on all children too
        light.traverse((child) => {
          if (child !== light) {
            child.userData.parentName = "button2";
          }
        });
        puzz1Models.add(light);
      }
    );
    loadModel('/public/models/button.glb',
      {x: -14, y: 7, z: 26, scale: 0.3, rotation: {z: -Math.PI/2}},
      (light) => {
        light.name = "button3";
        light.userData.interactable = true;
        light.userData.type = "button3";
        // Set name on all children too
        light.traverse((child) => {
          if (child !== light) {
            child.userData.parentName = "button3";
          }
        });
        puzz1Models.add(light);
      }
    );
    room.add(puzz1Models);
    
    //locker
    loadModel('/public/models/locker.glb',
      {x: 13, y: 0, z: 0, scale: 6, rotation: {y: -Math.PI/2}},
      (locker) => {
        locker.name = "locker";
        locker.userData.interactable = true;
        room.add(locker);
      }
    );
    
    //dartboard
    loadModel('/public/models/dartboard.glb',
      {x: 13.7, y: 8, z: 9, scale: 0.7, rotation: {y: Math.PI/2}},
      (dartboard) => {
        dartboard.name = "dartboard";
        dartboard.userData.interactable = true;
        room.add(dartboard);
      }
    );
    
    //old couch
    loadModel('/public/models/old_couch.glb',
      {x: -11.5, y: 0, z: 9, scale: 0.06, rotation: {y: Math.PI/2}},
      (couch) => {
        couch.name = "old_couch";
        couch.userData.interactable = true;
        room.add(couch);
      }
    );

   
// Load post-it notes model
createTexturedNote(room, '/public/textures/love.png', { x: -2.5, y: 4.2, z: 8 },{ x: 0, y: Math.PI / 3, z: 0 });
createTexturedNote(room, '/public/textures/two.png', { x: 3.5, y: 6.2, z: -13.5},{ x: Math.PI/2, y:Math.PI/2, z: 0 });
createTexturedNote(room, '/public/textures/one.png', {x: -13.9, y: 5.8, z: 20},{ x: 0, y:Math.PI, z: Math.PI/2 });
createTexturedNote(room, '/public/textures/two.png', {x: -13.9, y: 5.8, z: 23},{ x: 0, y:Math.PI, z: Math.PI/2 });


    
    //old table
    loadModel('/public/models/old_wooden_table.glb',
      {x: -3, y: 4, z: 9, scale: 1.1, rotation: {y: Math.PI}},
      (table) => {
        table.name = "old_table";
        table.userData.interactable = true;
        room.add(table);
      }
    );

    loadModel('/public/models/painting.glb',
      {x: 3.5, y: 6.2, z: -15.7, scale: 1.1, rotation: {x:Math.PI/4}},
      (table) => {
        table.name = "painting";
        table.userData.interactable = true;
        room.add(table);
        console.log(table)
        table.traverse(child=>{
          if(child.isMesh) console.log(child.name);
        })
        
      }
    );
    
    //window
    loadModel('/public/models/window.glb',
      {x: -3, y: 6, z: 30, scale: 1.8, rotation: {y: 2*Math.PI}},
      (window) => {
        window.name = "window";
        window.userData.interactable = true;
        room.add(window);
      }
    );
    
    //chest
    loadModel('/public/models/chest.glb',
      {x: -11, y: 0, z: 23, scale: 0.004, rotation: {y: -Math.PI/2}},
      (chest) => {
        chest.name = "chest";
        chest.userData.interactable = true;
        room.add(chest);
      }
    );
    
    //wall lamp
    loadModel('/public/models/wall_lamp.glb',
      {x: 25, y: 8, z: 28, scale: 3, rotation: {y: Math.PI}},
      (lamp) => {
        lamp.name = "wall_lamp";
        lamp.castShadow = true;
        room.add(lamp);

        const wallLight = new THREE.SpotLight(0xffd27f, 2, 40, Math.PI / 2, 0.5, 1);
        wallLight.position.set(25, 8, 28);
        wallLight.target.position.set(25, 5, 20);
        wallLight.castShadow = true;
        wallLight.shadow.mapSize.width = 1024;
        wallLight.shadow.mapSize.height = 1024;
        wallLight.shadow.bias = -0.003;

        room.add(wallLight);
        room.add(wallLight.target);
      }
    );

    //ceiling light
    loadModel('/public/models/ceiling_light.glb',
      {x: -6, y: -17.5, z: -30, scale: 12, rotation: {y: -Math.PI/2}},
      (ceilingLight) => {
        ceilingLight.name = "ceiling_light";
        room.add(ceilingLight);

        const bulbLight = new THREE.PointLight(0xfff2cc, 50, 50); 
        bulbLight.position.set(0, 10, 10);
        bulbLight.castShadow = true;
        bulbLight.shadow.mapSize.width = 1024;
        bulbLight.shadow.mapSize.height = 1024;
        bulbLight.shadow.bias = -0.003;

        room.add(bulbLight);
      }
    );
    
    return {room,puzz1Models};
}
