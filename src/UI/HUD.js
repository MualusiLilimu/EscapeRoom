// -------------------------
// HUD.js
// -------------------------

// Global game state
window.isPaused = true; 
window.numOfKeys = 0;
window.level_num = 0;

let timerInterval;
let timerStarted = false;

// -------------------------
// Level & Keys UI
// -------------------------
export function level() {
    document.getElementById('levels').textContent = `${window.level_num}`;
}

export function key() {
    document.getElementById('keys').textContent = `${window.numOfKeys}`;
}

// -------------------------
// Countdown Timer
// -------------------------
const timeUpOverlay = document.getElementById("time_up");
timeUpOverlay.style.display = "none"; // hide initially

const caughtOverlay = document.getElementById("caught_timeup");
caughtOverlay.style.display = "none"; // hide initially

function showCaughtScreen(duration = 3000) {
    caughtOverlay.style.display = "flex";
    caughtOverlay.style.opacity = "1";

    setTimeout(() => {
        // Fade out smoothly
        caughtOverlay.style.transition = "opacity 1s ease";
        caughtOverlay.style.opacity = "0";
        setTimeout(() => {
            caughtOverlay.style.display = "none";
            caughtOverlay.style.opacity = "1"; 
            caughtOverlay.style.transition = ""; 
        }, 1000);
    }, duration);
}

export function startCountdown(durationMinutes = 5) {
    let totalSeconds = durationMinutes * 60;

    function updateCountdown() {
        if (!window.isPaused) totalSeconds--;

        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        document.getElementById('time-ui').textContent = `${minutes}:${seconds}`;

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            window.isPaused = true;

            // Notify listeners that time is up
            try {
                window.dispatchEvent(new CustomEvent('game:timeup'));
            } catch (_) {}

            // Allow external logic (e.g., explosion) to defer UI
            const shouldDefer = typeof window.shouldDeferTimeUpUI === 'function' && window.shouldDeferTimeUpUI();
            if (!shouldDefer) {
                // Default behavior: show overlays immediately
                timeUpOverlay.style.display = "flex";
                renderDeathCardIfExploded();
            }
        }
    }

    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
}

export function resetCountdown(durationMinutes = 5) {
    if (timerInterval) clearInterval(timerInterval);

    const totalSeconds = durationMinutes * 60;
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    document.getElementById('time-ui').textContent = `${minutes}:${seconds}`;
    timeUpOverlay.style.display = "none";
    caughtOverlay.style.display = "none";
    window.isPaused = false;

    startCountdown(durationMinutes);
}

// Expose a helper to show the time-up UI on demand (used when deferring)
window.showTimeUpUI = function() {
    try {
        timeUpOverlay.style.display = "flex";
        renderDeathCardIfExploded();
    } catch (_) {}
};

function renderDeathCardIfExploded() {
    try {
        const wrapper = document.getElementById('time_up');
        if (!wrapper) return;
        if (!window.wasExploded) return;
        // Clear and build custom content
        wrapper.innerHTML = '';
        const img = document.createElement('img');
        img.src = '/textures/scream.png';
        img.alt = 'Scream';
        img.className = 'death-image';
        const title = document.createElement('div');
        title.className = 'death-title';
        title.textContent = 'YOU DIED';
        const restart = document.createElement('button');
        restart.id = 'restart';
        restart.textContent = 'Restart';
        const quit = document.createElement('a');
        quit.id = 'quit';
        quit.href = '/menu';
        quit.textContent = 'Quit';
        wrapper.appendChild(img);
        wrapper.appendChild(title);
        wrapper.appendChild(restart);
        wrapper.appendChild(quit);
        // Reattach listeners
        restart.addEventListener('click', () => {
            wrapper.style.display = 'none';
            window.isPaused = false;
            window.numOfKeys = 0;
            window.level_num = 0;
            key();
            level();
            startCountdown(5);
            location.reload();
        });
        quit.addEventListener('click', () => {
            window.isPaused = true;
        });
        // Reset flag after rendering once
        window.wasExploded = false;
    } catch (_) {}
}

// -------------------------
// Restart & Quit Logic
// -------------------------
document.getElementById("restart").addEventListener("click", () => {
    timeUpOverlay.style.display = "none";
    caughtOverlay.style.display = "none";

    window.isPaused = false;
    window.numOfKeys = 0;
    window.level_num = 0;

    key();
    level();

    startCountdown(5);

    location.reload();
});

document.getElementById("quit").addEventListener("click", () => {
    window.isPaused = true;
    alert("Quit to main menu");
});

// -------------------------
// Pause & Resume Logic
// -------------------------
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

// -------------------------
// Start Game Logic (Instructions Overlay)
// -------------------------
const instructionOverlay = document.getElementById('instruction-overlay');
const startButton = document.getElementById('start-game');

startButton.addEventListener('click', () => {
    instructionOverlay.style.display = 'none';
    window.isPaused = false;

    if (!timerStarted) {
        startCountdown(5); // 5 minutes
        timerStarted = true;
    }
});

// -------------------------
// Win UI helper
// -------------------------
window.showWinUI = function() {
    try {
        // mark the game as ended; prevent further input/updates
        window.isPaused = true;
        window.gameEnded = true;

        // remove any existing win overlay and create a credits roll
        let credits = document.getElementById('credits-roll');
        if (!credits) {
            credits = document.createElement('div');
            credits.id = 'credits-roll';
            const inner = document.createElement('div');
            inner.className = 'credits-inner';
            const list = document.createElement('div');
            list.className = 'credits-list';
            // credits content — alphabetical by last name (full names only)
            list.innerHTML = `
                <div style="font-size:32px; margin-bottom:18px; color:#ff4444;">THANK YOU FOR PLAYING</div>
                <div style="font-weight:700; font-size:22px; margin-bottom:8px;">CREDITS</div>
                <div>Mualusi Lilimu</div>
                <div>Steven Mabasa</div>
                <div>Takudzwa Mhizha</div>
                <div>Thendo Nelufule</div>
                <div>Siyabonga Nyembe</div>
                <div>Mumandafhadzi Siaga</div>
                <div style="margin-top:20px; font-size:18px;">Returning to the main menu...</div>
            `;
            inner.appendChild(list);
            credits.appendChild(inner);
            document.body.appendChild(credits);
        }
        // show credits and start the roll
        try { credits.style.display = 'flex'; } catch(_){}
        // after the animation finishes, redirect to the start page and enforce game over
        const duration = 12000; // ms; matches CSS animation credit-scroll 12s
        setTimeout(() => {
            try { credits.style.display = 'none'; } catch(_){}
            // final redirect to start page (root)
            try { window.location.href = '/'; } catch(_){}
        }, duration + 500);
    } catch (_) {}
};
