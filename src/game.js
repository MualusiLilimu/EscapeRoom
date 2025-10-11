// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want

// Game manager handles current level, current room, player

// Add these to game.js to support room switching with puzzles
import { level } from "./UI/HUD.js";

function createGame(scene, player, puzzleManager = null) {
  const levels = [];
  let currentLevelIndex = 0;
  let currentRoomIndex = 0;

  function addLevel(level) {
    levels.push(level);
  }


  // This function displays the level of the current room and returns that room to be rendered in a scene
  function getCurrentRoom() {
    if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.levelId == "level1"){
      window.level_num = 1;
    }
    else if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.levelId == "level2"){
      window.level_num = 2;
    }
    else if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.levelId == "level3"){
      window.level_num = 3;
    }
    else if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.levelId == "level4"){
      window.level_num = 4;
    }
    level();
    return levels[currentLevelIndex].rooms[currentRoomIndex];
  }


  function nextRoom() {
    // Deactivate current room's puzzle
    if (puzzleManager) {
      const currentRoom = getCurrentRoom();
      puzzleManager.deactivateRoom(currentRoom.userData.roomId);
    }
    
    currentRoomIndex++;
    const newRoom = levels[currentLevelIndex].rooms[currentRoomIndex];
    
    // Activate new room's puzzle
    if (puzzleManager && newRoom) {
      puzzleManager.activateRoom(newRoom.userData.roomId);
    }
    
    return newRoom;
  }
  
  function switchToRoom(levelIndex, roomIndex) {
    // Deactivate current room's puzzle
    if (puzzleManager) {
      const currentRoom = getCurrentRoom();
      puzzleManager.deactivateRoom(currentRoom.userData.roomId);
    }
    
    currentLevelIndex = levelIndex;
    currentRoomIndex = roomIndex;
    
    // Activate new room's puzzle
    if (puzzleManager) {
      const newRoom = getCurrentRoom();
      puzzleManager.activateRoom(newRoom.userData.roomId);
    }
    
    return getCurrentRoom();
  }

  function update() {
    // TODO: player.update()
    // TODO: check interactions, keys, doors, puzzles
  }

  return {
    addLevel,
    getCurrentRoom,
    nextRoom,
    switchToRoom,
    update
  };
}

export { createGame };