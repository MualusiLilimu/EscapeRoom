// Here is where the scene for room1 level1 will be coded (that is the collections of objects,puzzles and models for this level will be here)
// This file also Defines the geometry, textures, and objects for this room.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import {loadTexture} from '../../../utils/loader.js';



// everything you want to design for this ROOM you should do it inside createRoom function
// you are also free to create functions outside the createRoom function and call them inside afterwards


// function to create walls
function createWall(width, height, depth, x, y, z, paint,path) {
  const wallgeometry = new THREE.BoxGeometry(width, height, depth);
  const wallmaterial = new THREE.MeshPhongMaterial({ map: path});
  const wall = new THREE.Mesh(wallgeometry, wallmaterial);

  wall.position.set(x, y, z);

  return wall;
}

// function to create a floor
function createFloor(width, height, depth, x, y, z, paint,path){
  const floorgeometry = new THREE.BoxGeometry(width, height, depth);
  const floormaterial = new THREE.MeshPhongMaterial({map: path});
  const floor = new THREE.Mesh(floorgeometry, floormaterial);

  floor.position.set(x, y, z);

  return floor
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
  plane.receiveShadow = true; // so it catches shadows if you add lighting

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
    //TODO design a roome here
    const plane =  createPlane(20000,1000,'../../../../public/textures/pave.jpg');
    room.add(plane);

    const floortexture = loadTexture('../../../../public/textures/tile.jpg');
    floortexture.wrapS = THREE.RepeatWrapping;
    floortexture.wrapT = THREE.RepeatWrapping;
    floortexture.repeat.set(1.5, 1);
    const walltexture = loadTexture('../../../../public/textures/wall.jpg');
    walltexture.wrapS = THREE.RepeatWrapping;
    walltexture.wrapT = THREE.RepeatWrapping;

    // floor
    const floor1 = createFloor(30,1,30,0,0,0,"white",floortexture); 
    room.add(floor1);

    const floor2 = createFloor(60,1,15,15,0,22.5,"white",floortexture);
    room.add(floor2);
 
    // walls
    const wall1 = createWall(30,15,1,0,8,-14.5,"white",walltexture);
    room.add(wall1);

    const wall2 = createWall(1,15,30,14.5,8,0,"white",walltexture);
    room.add(wall2);

    const wall3 = createWall(1,15,30,-14.5,8,0,"white",walltexture);
    room.add(wall3);

    const wall4 = createWall(1,15,15,-14.5,8,22.5,"white",walltexture);
    room.add(wall4);

    const wall5 = createWall(60,15,1,15,8,29.5,"white",walltexture);
    room.add(wall5);

    const wall6 =  createWall(31,15,1,29.5,8,15.5,"white",walltexture);
    room.add(wall6);

    const wall7 = createWall(1,15,4,44.5,8,18,"white",walltexture);
    room.add(wall7);

    const wall8 = createWall(1,15,4,44.5,8,27,"white",walltexture);
    room.add(wall8);

    const wall9 = createWall(1,5,5,44.5,13,22.5,"white",walltexture);
    room.add(wall9);

    //door
    // add a door in wall1
    const doorTexture = '../../../../public/textures/door.jpeg'; // replace with your door texture
    const door = createDoor(1, 10, 5, 44.5, 5.5, 22.5, doorTexture); 
    room.add(door);


  return room;
}

