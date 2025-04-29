// === Audio Settings Screen ===
// Displays a screen related to audio settings when the pause menu "sound" option is selected

// === Load Title Image for Audio Screen ===
const title_audio = new Image();
title_audio.src = '../images/pause/audio_title.png';

// Create an array with game objects to show different rectangles that simbolize the volume, when the image plus is hit 
// a rectangle will be added to the array when the image minus is hit a rectangle will be removed from the array
// Using the class Sound defined in sound.js
// Array with game objects to show different rectangles that simbolize the volume
let volumeRectangles = [];
// If certain region is clicked, a rectangle will be added to the array


// === Draw Audio Settings Screen ===
// Clears the canvas and draws the background, title, and instruction text
function drawAudio() {
    if (sonido_bool) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Reuses background_stats from stats screen
        ctx.drawImage(background_stats, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Uses title_stats for sizing (assuming both titles are the same size)
        ctx.drawImage(title_audio, 200, 75, title_stats.naturalWidth * 0.5, title_stats.naturalHeight * 0.5);

        // Instructional text to return with ESC
        createText('#d5d4cc', '35px serif', 'left', 'Regresa con "esc"', 335, 500);

        // Keep redrawing while in audio settings mode
        requestAnimationFrame(drawAudio);
    }
}
