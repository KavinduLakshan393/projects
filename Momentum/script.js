// ==========================================
// DIGITAL CLOCK LOGIC
// ==========================================
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('clock-display').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// STOPWATCH LOGIC
// ==========================================
let stopwatchInterval;
let secondsElapsed = 0;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function updateStopwatch() {
    secondsElapsed++;
    
    let hrs = Math.floor(secondsElapsed / 3600);
    let mins = Math.floor((secondsElapsed % 3600) / 60);
    let secs = secondsElapsed % 60;

    hrs = hrs < 10 ? '0' + hrs : hrs;
    mins = mins < 10 ? '0' + mins : mins;
    secs = secs < 10 ? '0' + secs : secs;

    stopwatchDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

// Start Button
startBtn.addEventListener('click', () => {
    if (!stopwatchInterval) { // Only start if not already running
        stopwatchInterval = setInterval(updateStopwatch, 1000);
    }
});

// Stop Button
stopBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null; // Reset interval to null so startBtn works again
});

// Reset Button
resetBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    secondsElapsed = 0;
    stopwatchDisplay.textContent = "00:00:00";
});
