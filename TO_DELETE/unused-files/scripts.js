document.addEventListener("DOMContentLoaded", function() {
    updateTime();

    // Update time every second
    setInterval(updateTime, 1000);
});

function updateTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}`;
}


