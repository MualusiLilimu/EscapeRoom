// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want

// Game manager handles current level, current room, player

// Add these to game.js to support room switching with puzzles
import { level } from "./UI/HUD.js";
import { startCountdown , resetCountdown} from "./UI/HUD.js";

function createGame(scene, player, puzzleManager = null) {
  const levels = [];
  let currentLevelIndex = 0;
  let currentRoomIndex = 0;

  function addLevel(level) {
    levels.push(level);
  }


  // This function displays the level of the current room and returns that room to be rendered in a scene
  function getCurrentRoom() {
    
    if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.roomId == "level1-room1"){
      window.level_num = 1;
    }
    else if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.roomId == "level1-room2"){
      window.level_num = 2;
    }
    else if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.roomId == "level1-room3"){
      window.level_num = 3;
    }
    else if(levels[currentLevelIndex].rooms[currentRoomIndex].userData.roomId == "level1-room4"){
      window.level_num = 4;
    }
    level();
    return levels[currentLevelIndex].rooms[currentRoomIndex];
  }


function nextRoom() {
    // Deactivate current room's puzzle
    if (puzzleManager) {
        const currentRoom = levels[currentLevelIndex].rooms[currentRoomIndex];
        puzzleManager.deactivateRoom(currentRoom.userData.roomId);
    }

    // Move to next room
    currentRoomIndex++;
    const newRoom = levels[currentLevelIndex].rooms[currentRoomIndex];

    if (!newRoom) return null;

    // Update level number based on new room
    const roomId = newRoom.userData.roomId;
    const roomNumber = parseInt(roomId.split("-")[1].replace("room","")); 
    window.level_num = roomNumber;
    level();
    resetCountdown(5);
    startCountdown(5);
    // Activate new room's puzzle
    if (puzzleManager) {
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