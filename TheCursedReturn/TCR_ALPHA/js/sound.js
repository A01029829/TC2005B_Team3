const soundMap = {
    bow: "../audio/bow.wav",
    sword: " ../audio/sword.wav",
    //ambiance: "../audio/ambiance.wav",
    ambiencejiji: "../audio/ambience_jiji.wav",
    spell: "../audio/spell.wav",
    dash: "../audio/dash.wav",
    hit: "../audio/hit.wav", 
    chest: "../audio/chest.wav",  
    gunsmith: "../audio/gunsmith.wav",
    healer: "../audio/healer.wav",
};

// Store all game sounds
const gameSounds = [];

// Control the different sounds in the game
class Sound {
    constructor(action, loop = false, volume = 1.0) {
        this.action = action;
        this.loop = loop;
        this.volume = volume;
        this.audio = null;
        this.fadeInterval = null;
    }

    _ensureAudio() {
        if (!this.audio) {
            this.audio = new Audio(soundMap[this.action]);
            this.audio.loop = this.loop;
            this.audio.volume = this.volume;
        }
    }

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

    muted() {
        if (this.audio) {
            this.audio.muted = !this.audio.muted;
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.audio) {
            this.audio.volume = volume;
        }
    }

    setLoop(loop) {
        this.loop = loop;
        if (this.audio) {
            this.audio.loop = loop;
        }
    }

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

// Create a new sound object for each action
const bowSound = new Sound('bow', false, 1.0);
const swordSound = new Sound('sword', false, 1.0);
const spellSound = new Sound('spell', false, 1.0);
const dashSound = new Sound('dash', false, 1.0);
const hitSound = new Sound('hit', false, 1.0);
const chestSound = new Sound('chest', false, 1.0);
const gunsmithSound = new Sound('gunsmith', false, 1.0);
const healerSound = new Sound('healer', false, 1.0);

// Add sounds to the gameSounds array
gameSounds.push(bowSound);
gameSounds.push(swordSound);
gameSounds.push(spellSound);
gameSounds.push(dashSound);
gameSounds.push(hitSound);
gameSounds.push(chestSound);
gameSounds.push(gunsmithSound);
gameSounds.push(healerSound);