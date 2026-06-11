// Digital Clock Logic
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock-display').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// Stopwatch Logic
let stopwatchInterval;
let secondsElapsed = 0;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

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

startBtn.addEventListener('click', () => {
    // Prevent multiple intervals from running at once
    clearInterval(stopwatchInterval); 
    stopwatchInterval = setInterval(updateStopwatch, 1000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
});
