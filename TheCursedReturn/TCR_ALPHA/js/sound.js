// === Sound Map ===
// maps sound action names to their audio file paths
const soundMap = {
    bow: "../audio/bow.wav",
    sword: " ../audio/sword.wav",
    ambiencejiji: "../audio/ambience_jiji.wav",
    spell: "../audio/spell.wav",
    dash: "../audio/dash.wav",
    hit: "../audio/hit.wav", 
    chest: "../audio/chest.wav",  
    gunsmith: "../audio/gunsmith.wav",
    healer: "../audio/healer.wav",
};

// === Game Sounds Storage ===
// stores all game sound objects for global control
const gameSounds = [];

// === Sound Class ===
// controls playback, volume, loop, and switching of sounds
class Sound {
    constructor(action, loop = false, volume = 1.0) {
        this.action = action;     // sound identifier (e.g., 'bow', 'sword')
        this.loop = loop;         // whether the sound should loop
        this.volume = volume;     // playback volume
        this.audio = null;        // audio object reference
        this.fadeInterval = null; // reserved for fade effects
    }

    // === Ensure Audio Object Exists ===
    _ensureAudio() {
        if (!this.audio) {
            this.audio = new Audio(soundMap[this.action]);
            this.audio.loop = this.loop;
            this.audio.volume = this.volume;
        }
    }

    // === Play the Sound ===
    play() {
        this._ensureAudio();
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`${this.action} sound started playing`);
                })
                .catch((error) => {
                    console.warn(`${this.action} sound play was blocked by the browser.`, error);
                });
        }
    }

    // === Toggle Mute ===
    muted() {
        if (this.audio) {
            this.audio.muted = !this.audio.muted;
        }
    }

    // === Pause the Sound ===
    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    // === Stop the Sound and Reset to Start ===
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    // === Set Volume ===
    setVolume(volume) {
        this.volume = volume;
        if (this.audio) {
            this.audio.volume = volume;
        }
    }

    // === Enable or Disable Looping ===
    setLoop(loop) {
        this.loop = loop;
        if (this.audio) {
            this.audio.loop = loop;
        }
    }

    // === Switch to a Different Sound Action ===
    setSound(action) {
        const soundFile = soundMap[action];
        if (soundFile) {
            const isPlaying = this.audio && !this.audio.paused;
            if (this.audio) {
                this.audio.pause();
            }
            this.action = action;
            this.audio = new Audio(soundFile);
            this.audio.loop = true;
            this.audio.volume = 0.5;
            if (isPlaying){
                this.audio.play();
            } 
        } else {
            console.log(`No sound associated to: ${action}`);
        }
    }
}

// === Create Sound Objects for Each Action ===
const bowSound = new Sound('bow', false, 1.0);
const swordSound = new Sound('sword', false, 1.0);
const spellSound = new Sound('spell', false, 1.0);
const dashSound = new Sound('dash', false, 1.0);
const hitSound = new Sound('hit', false, 1.0);
const chestSound = new Sound('chest', false, 1.0);
const gunsmithSound = new Sound('gunsmith', false, 1.0);
const healerSound = new Sound('healer', false, 1.0);

// === Add All Sounds to Global Array ===
gameSounds.push(bowSound);
gameSounds.push(swordSound);
gameSounds.push(spellSound);
gameSounds.push(dashSound);
gameSounds.push(hitSound);
gameSounds.push(chestSound);
gameSounds.push(gunsmithSound);
gameSounds.push(healerSound);
