// Digital Clock Logic
function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zeros (e.g., 5 seconds becomes 05)
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock-display').textContent = timeString;
}

// Call updateClock every 1000ms (1 second)
setInterval(updateClock, 1000);

// Initialize immediately so there is no 1-second delay on load
updateClock();
