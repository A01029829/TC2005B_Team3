const soundMap = {
    bow: "../audio/bow.wav",
    sword: " ../audio/sword.mp3",
    ambiance: "../audio/ambiance.wav",
    ambiencejiji: "../audio/ambience_jiji.wav",
    spell: "../audio/spell.wav",
    dash: "../audio/dash.wav",   
};

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

    increaseVolume() {
        if (this.audio.volume < 1.0) {
            this.audio.volume += 0.1;
        }
    }

    decreaseVolume() {
        if (this.audio.volume > 0.0) {
            this.audio.volume -= 0.1;
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
