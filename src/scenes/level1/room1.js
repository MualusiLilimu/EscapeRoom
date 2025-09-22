// Here is where the scene for room1 level1 will be coded (that is the collections of objects,puzzles and models for this level will be here)
// This file also Defines the geometry, textures, and objects for this room.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import {loadTexture} from '../../../utils/loader.js';





// everything you want to design for this ROOM you should do it inside createRoom function
// you are also free to create functions outside the createRoom function and call them inside afterwards


// function to create walls
function createWall(width, height, depth, x, y, z, paint,path) {
  const wallgeometry = new THREE.BoxGeometry(width, height, depth);
  const wallmaterial = new THREE.MeshPhongMaterial({ color: paint,map: path});
  const wall = new THREE.Mesh(wallgeometry, wallmaterial);

  wall.position.set(x, y, z);

  return wall;
}

// function to create a floor
function createFloor(width, height, depth, x, y, z, paint,path){
  const floorgeometry = new THREE.BoxGeometry(width, height, depth);
  const floormaterial = new THREE.MeshPhongMaterial({ color: paint,map: path});
  const floor = new THREE.Mesh(floorgeometry, floormaterial);

  floor.position.set(x, y, z);

  return floor
}

export function createRoom1() {
    const room = new THREE.Group();
    //TODO design a roome here

    const floortexture = loadTexture('../../../../public/textures/tile.jpg');
    const walltexture = loadTexture('');
    // floor
    const floor = createFloor(30,1,30,0,0,0,"gray",floortexture); 
    room.add(floor);

    // walls
    const wall1 = createWall(30,15,1,0,8,-14.5,"red",walltexture);
    room.add(wall1);

    const wall2 = createWall(1,15,30,14.5,8,0,"red",walltexture);
    room.add(wall2);

    const wall3 = createWall(1,15,30,-14.5,8,0,"red",walltexture);
    room.add(wall3);

  return room;
}

