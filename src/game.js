// Guys this is just the example skeleton of the game and you can add more staff as needed
// I just wanted to make it clear how things are linking to each other
// you can also add more files as you want


// Game manager handles current level, current room, player

function createGame(scene, player) {
  const levels = [];
  let currentLevelIndex = 0;
  let currentRoomIndex = 0;

  function addLevel(level) {
    levels.push(level);
  }

  function getCurrentRoom() {
    return levels[currentLevelIndex].rooms[currentRoomIndex];
  }

  function nextRoom() {
    currentRoomIndex++;
    
  }

  function update() {
    // TODO: player.update()
    // TODO: check interactions, keys, doors, puzzles
  }


  return {
    addLevel,
    getCurrentRoom,
    nextRoom,
    update
  };
}

export { createGame };
