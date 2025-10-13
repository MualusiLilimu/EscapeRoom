// The heads-up display, e.g., timer countdown, collected items

// function that shows the current level the player is in
export function level(){
    const level_num = window.level_num;
    console.log(level_num);
    document.getElementById('levels').textContent = `${level_num}`;
}


//function that track the number of keys collected and updates the UI
export function key(){
    const num_of_keys = window.numOfKeys;
    document.getElementById('keys').textContent = `${num_of_keys}`;
}



// Function that sets time to 5 minuets for a player to solve the puzzle
const timeUpOverlay = document.getElementById("time_up");
timeUpOverlay.style.display = "none"; // hide initially

function startCountdown(durationMinutes = 5) {
    let totalSeconds = durationMinutes * 60;

    function updateCountdown() {
        if (!window.isPaused) totalSeconds--;

        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        document.getElementById('time-ui').textContent = `${minutes}:${seconds}`;

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timeUpOverlay.style.display = "flex"; 
            window.isPaused = true;
        }
    }

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}


// Start the countdown
startCountdown(5); // 5 minutes


// restart and quit logic

const restartBtn = document.getElementById("restart");
const quitBtn = document.getElementById("quit");

restartBtn.addEventListener("click", () => {
    
    document.getElementById("time_up").style.display = "none";

    // Reset game state
    window.isPaused = false;
    window.numOfKeys = 0;
    window.level_num = 0;

    // Reset keys and level
    key();
    level();

    // Reset the countdown (5 minutes again)
    startCountdown(5);

    // reset player position & reload the scene
    location.reload(); 
});

quitBtn.addEventListener("click", () => {
    // Quit logic
    window.isPaused = true;
    alert("Quit to main menu"); 
});




//pause and resume logic

const pauseResumeBtn = document.getElementById("menu");
const [pauseIcon, playIcon] = pauseResumeBtn.querySelectorAll("svg");
const pausedOverlay = document.getElementById("paused-overlay");

pauseIcon.style.display = "block";
playIcon.style.display = "none";

pauseResumeBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    window.isPaused = !window.isPaused;

    pauseIcon.style.display = window.isPaused ? "none" : "block";
    playIcon.style.display = window.isPaused ? "block" : "none";

    
    pausedOverlay.style.display = window.isPaused ? "block" : "none";

    console.log(window.isPaused ? "Game paused" : "Game resumed");
});
