// js/timer.js
import { updateTimerDisplay } from './ui.js'; // Import UI function

let timerIntervalId = null;
let handleTimeoutCallback = null; // Function to call when timer expires

function formatTime(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function startTimer(duration, onTimeout) {
    stopTimer(); // Ensure any existing timer is cleared
    handleTimeoutCallback = onTimeout; // Store the callback
    const startTime = Date.now();

    updateTimerDisplay(formatTime(duration), true); // Show timer immediately
    console.log("Timer started.");

    timerIntervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = duration - elapsedTime;

    //     if (remainingTime <= 0) {
    //         stopTimer(); // Stop interval first
    //         console.log("Timer expired.");
    //         if (handleTimeoutCallback) {
    //             handleTimeoutCallback(); // Call the timeout handler passed from main.js
    //         }
    //     } else {
    //         updateTimerDisplay(formatTime(remainingTime), true);
    //     }
    // }, 1000);
    if (remainingTime <= 0) {
        console.log("Timer expired.");
        // --- CHANGE HERE: Call callback BEFORE stopping ---
        if (handleTimeoutCallback) {
            handleTimeoutCallback(); // Call the timeout handler
        }
        stopTimer(); // Stop interval AFTER callback
        // --- END CHANGE ---
    } else {
        updateTimerDisplay(formatTime(remainingTime), true);
    }
}, 1000);
}

export function stopTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        updateTimerDisplay(formatTime(0), false); // Hide timer
        console.log("Timer stopped.");
    }
    //handleTimeoutCallback = null; // Clear callback
}
