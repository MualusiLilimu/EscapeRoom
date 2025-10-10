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
function startCountdown(durationMinutes = 5) {
    let totalSeconds = durationMinutes * 60;

    function updateCountdown() {
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        document.getElementById('time-ui').textContent = `${minutes}:${seconds}`;

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
        } else {
            totalSeconds--;
        }
    }

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}

// Start the countdown
startCountdown(5); // 5 minutes