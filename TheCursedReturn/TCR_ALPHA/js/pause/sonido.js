// === Audio Settings Screen ===
// Displays a screen related to audio settings when the pause menu "sound" option is selected

// === Load Title Image for Audio Screen ===
const title_audio = new Image();
title_audio.src = '../images/pause/audio_title.png';

// Array with game objects to show different rectangles that simbolize the volume
let volumeRectangles = [];
// If certain region is clicked, a rectangle will be added to the array
const minusVolume = new Image();
minusVolume.src = '../images/pause/minus_volume1.png';
const plusVolume = new Image();
plusVolume.src = '../images/pause/plus_volume.png';
// Mute buttons
const muteSounds = new Image();
muteSounds.src = '../images/pause/sound_mute.png';
const muteMusic = new Image();
muteMusic.src = '../images/pause/music_mute.png';

const minusVolumeWidth = 75;
const minusVolumeHeight = 75;
const minusVolumeX = 245;
const minusVolumeY = 225;

const plusVolumeWidth = 75;
const plusVolumeHeight = 75;
const plusVolumeX = 580;
const plusVolumeY = 225;

const muteVolumeWidth = 160;
const muteVolumeHeight = 75;
const muteVolumeX = 255;
const muteVolumeY = 350;

const muteMusicWidth = 175;
const muteMusicHeight = 75;
const muteMusicX = 475;
const muteMusicY = 350;

// Insert volume rectangles into the array
createVolumeRectangles();

// === Handle volume using the gameSounds array ===
function updateVolumes() {
    for (let i = 0; i < gameSounds.length; i++) {
        const sound = gameSounds[i];
        // Handle ambiance sounds - max volume 0.5
        if (sound.action === 'ambiencejiji') {
            // Scale from 0 to 0.5 based on rectangle count
            const newVolume = Math.min(0.5, volumeRectangles.length / 20);
            sound.setVolume(newVolume);
        } 
        // Handle all other sounds - max volume 1.0
        else {
            // Scale from 0 to 1.0 based on rectangle count
            const newVolume = volumeRectangles.length / 10;
            sound.setVolume(newVolume);
        }
    }
}

// === Handle Mute Sounds ===
function musicMute() {
    for (let i = 0; i < gameSounds.length; i++) {
        const sound = gameSounds[i];
        if (sound.action === 'ambiencejiji') {
            sound.muted();
        }
    }
}
function soundsMute() {
    for (let i = 0; i < gameSounds.length; i++) {
        const sound = gameSounds[i];
        if (sound.action !== 'ambiencejiji') {
            sound.muted();
        }
    }
}

// Delete a rectangle if the minus volume rectangle is clicked
window.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    if (mouseX > minusVolumeX && mouseX < minusVolumeX + minusVolumeWidth &&
        mouseY > minusVolumeY && mouseY < minusVolumeY + minusVolumeHeight) {
            if (volumeRectangles.length > 1) {
            volumeRectangles.pop();
            // Handle volume using the gameSounds array
            updateVolumes();
        }
    }

    if (mouseX > plusVolumeX && mouseX < plusVolumeX + plusVolumeWidth &&
        mouseY > plusVolumeY && mouseY < plusVolumeY + plusVolumeHeight) {
        if (volumeRectangles.length < 10) {
            // Add a new rectangle at the appropriate position
            let x = 325 + volumeRectangles.length * 25;
            let rect = new GameObject(new Vect(x, 242), 20, 40, "white");
            volumeRectangles.push(rect);
            // Handle volume using the gameSounds array
            updateVolumes();
        }
    }

    // Check if the mute sounds or mute music buttons are clicked
    if (mouseX > muteVolumeX && mouseX < muteVolumeX + muteVolumeWidth &&
        mouseY > muteVolumeY && mouseY < muteVolumeY + muteVolumeHeight) {
        soundsMute();
    }
    if (mouseX > muteMusicX && mouseX < muteMusicX + muteMusicWidth &&
        mouseY > muteMusicY && mouseY < muteMusicY + muteMusicHeight) {
        console.log("Mute music clicked");
        musicMute();
    }
})

// === Draw Audio Settings Screen ===
// Clears the canvas and draws the background, title, and instruction text
function drawAudio() {
    if (sonido_bool) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Reuses background_stats from stats screen
        ctx.drawImage(background_stats, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Uses title_stats for sizing (assuming both titles are the same size)
        ctx.drawImage(title_audio, 200, 75, title_stats.naturalWidth * 0.5, title_stats.naturalHeight * 0.5);

        // Draw the minus volume image
        ctx.drawImage(minusVolume, minusVolumeX, minusVolumeY, minusVolumeWidth, minusVolumeHeight);
        // Draw the plus volume image
        ctx.drawImage(plusVolume, plusVolumeX, plusVolumeY, plusVolumeWidth, plusVolumeHeight);

        // Draw the mute sounds image
        ctx.drawImage(muteSounds, muteVolumeX, muteVolumeY, muteVolumeWidth, muteVolumeHeight);
        // Draw the mute music image
        ctx.drawImage(muteMusic, muteMusicX, muteMusicY, muteMusicWidth, muteMusicHeight);

        // Draw the rectangles in the array
        for (let i = 0; i < volumeRectangles.length; i++) {
            volumeRectangles[i].draw(ctx);
        }

        // Instructional text to return with ESC
        createText('#d5d4cc', '35px serif', 'left', 'Regresa con "esc"', 320, 500);

        // Keep redrawing while in audio settings mode
        requestAnimationFrame(drawAudio);
    }
}

// === Handle volume rectangle ===
function createVolumeRectangles() {
    x = 325;
    y = 242;
    //Create 10 rectangles to show the volume
    for (let i = 0; i < 10; i++) {
        let rect = new GameObject(new Vect(x, y), 20, 40, "white");
        // Get the rectangles in the array
        volumeRectangles.push(rect);
        x += 20 + 5;
    }
}