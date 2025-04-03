// === Get Audio Canvas Element ===
// grabs the canvas element
const canvas = document.getElementById('audio');

// === Set Initial Background Music Volume ===
// sets default music volume to 50% when the page loads
document.getElementById('backgroundMusic').volume = 0.5;

// === Save Music Play State to localStorage ===
// when music starts playing, save that info and the volume to localStorage
document.getElementById('backgroundMusic').addEventListener('play', function() {
    localStorage.setItem('musicPlaying', 'true');
    localStorage.setItem('musicVolume', this.volume);
});

// === Auto-Play Music if It Was Playing Last Time ===
// when the page loads, check if music was playing before and resume it
window.addEventListener('load', function() {
    const music = document.getElementById('backgroundMusic');
    if (localStorage.getItem('musicPlaying') === 'true') {
        music.play();
        if (localStorage.getItem('musicVolume')) {
            music.volume = parseFloat(localStorage.getItem('musicVolume'));
        }
    }
});

// === Get DOM Elements for Audio Controls ===
// grab all the audio-related elements from the HTML
const backgroundMusic = document.getElementById('backgroundMusic');
const soundEffect = document.getElementById('soundEffect');
const musicVolume = document.getElementById('musicVolume');
const musicVolumeValue = document.getElementById('musicVolumeValue');
const muteMusic = document.getElementById('muteMusic');
const effectsVolume = document.getElementById('effectsVolume');
const effectsVolumeValue = document.getElementById('effectsVolumeValue');
const testSound = document.getElementById('testSound');

// === Initialize Audio Settings ===
// this sets up initial volumes, mute, and tries to play music
function initAudioSettings() {
    console.log("Initializing audio settings");

    // === Background Music Setup ===
    // load saved music volume or use default, also update the UI
    if (backgroundMusic) {
        const savedMusicVolume = localStorage.getItem('musicVolume') || "0.5";
        backgroundMusic.volume = parseFloat(savedMusicVolume);
        console.log("Music volume set to:", backgroundMusic.volume);

        // update volume slider and label
        if (musicVolume && musicVolumeValue) {
            musicVolume.value = savedMusicVolume;
            musicVolumeValue.textContent = `${Math.round(parseFloat(savedMusicVolume) * 100)}%`;
        }

        // set mute/unmute label based on saved setting
        if (localStorage.getItem('musicMuted') === 'true') {
            backgroundMusic.muted = true;
            if (muteMusic) muteMusic.textContent = '🔊 Turn On Sound';
        } else {
            backgroundMusic.muted = false;
            if (muteMusic) muteMusic.textContent = '🔇 Mute';
        }

        // try to play music right away
        playBackgroundMusic();
    }

    // === Sound Effects Setup ===
    // load saved sound effects volume or use default
    if (soundEffect) {
        const savedEffectsVolume = localStorage.getItem('effectsVolume') || "0.7";
        soundEffect.volume = parseFloat(savedEffectsVolume);

        // update slider and label
        if (effectsVolume && effectsVolumeValue) {
            effectsVolume.value = savedEffectsVolume;
            effectsVolumeValue.textContent = `${Math.round(parseFloat(savedEffectsVolume) * 100)}%`;
        }
    }
}

// === Setup All Event Listeners for Audio Controls ===
// adds interactivity to the sliders and buttons
function setupEventListeners() {

    // === Music Volume Slider ===
    // change music volume live and save the new value
    if (musicVolume && backgroundMusic && musicVolumeValue) {
        musicVolume.addEventListener('input', function() {
            const value = this.value;
            musicVolumeValue.textContent = `${Math.round(parseFloat(value) * 100)}%`;
            backgroundMusic.volume = parseFloat(value);
            localStorage.setItem('musicVolume', value);
            console.log("Music volume changed to:", value);
        });
    }

    // === Effects Volume Slider ===
    // change sound effect volume live and save it
    if (effectsVolume && soundEffect && effectsVolumeValue) {
        effectsVolume.addEventListener('input', function() {
            const value = this.value;
            effectsVolumeValue.textContent = `${Math.round(parseFloat(value) * 100)}%`;
            soundEffect.volume = parseFloat(value);
            localStorage.setItem('effectsVolume', value);
            console.log("Effects volume changed to:", value);
        });
    }

    // === Test Sound Effect Button ===
    // plays a sample effect sound when button is clicked
    if (testSound && soundEffect) {
        testSound.addEventListener('click', function() {
            console.log("Testing sound effect");
            soundEffect.currentTime = 0;
            soundEffect.play().catch(e => console.log("Error playing sound effect:", e));
        });
    }
}

// === Toggle Mute/Unmute Music Function ===
// allows user to mute or unmute background music
function toggleMute() {
    if (!backgroundMusic) return;

    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        if (muteMusic) muteMusic.textContent = '🔇 Mute';
        localStorage.setItem('musicMuted', 'false');
        console.log("Sound unmuted");
    } else {
        backgroundMusic.muted = true;
        if (muteMusic) muteMusic.textContent = '🔊 Turn On Sound';
        localStorage.setItem('musicMuted', 'true');
        console.log("Sound muted");
    }
}

// === Make Toggle Mute Available Globally ===
// allows toggleMute() to be called from HTML using onclick
window.toggleMute = toggleMute;

// === Try Playing Background Music Automatically ===
// tries to play music right away; if blocked, waits for user to interact with it
function playBackgroundMusic() {
    if (!backgroundMusic) return;

    let playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            console.log("Music started playing successfully");
            localStorage.setItem('musicPlaying', 'true');
        })
        .catch(error => {
            console.log("Auto-play failed:", error);

            // === Fallback: Wait for User Interaction to Play ===
            // this handles browsers blocking auto-play
            const startAudio = function() {
                console.log("Trying to play after user interaction");
                backgroundMusic.play()
                    .then(() => {
                        console.log("Music started after interaction");
                        localStorage.setItem('musicPlaying', 'true');
                    })
                    .catch(e => console.log("Error after interaction:", e));

                // remove once-only event listeners
                document.removeEventListener('click', startAudio);
                document.removeEventListener('touchstart', startAudio);
                document.removeEventListener('keydown', startAudio);
            };

            // add fallback listeners for multiple interaction types
            document.addEventListener('click', startAudio, { once: true });
            document.addEventListener('touchstart', startAudio, { once: true });
            document.addEventListener('keydown', startAudio, { once: true });

            console.log("Waiting for user interaction to play audio...");
        });
    }
}

// === Initialize Audio Setup When DOM Is Ready ===
// starts setup once HTML is fully loaded (not waiting for images or other stuff)
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready, setting up audio");
    initAudioSettings();
    setupEventListeners();
});

// === Retry Playing Music on Full Page Load ===
// in case music didn’t start earlier, try again after full page load
window.addEventListener('load', function() {
    if (backgroundMusic && backgroundMusic.paused) {
        console.log("Trying to play music on load event");
        playBackgroundMusic();
    }
});
