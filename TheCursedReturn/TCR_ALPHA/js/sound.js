const soundMap = {
    bow: "../audio/bow.wav",
    sword: " ../audio/sword.mp3",
    ambiance: " ../audio/ambiance.wav",
    ambiancejiji: " ../audio/ambiance_jiji.wav",
    spell: " ../audio/spell.wav",
    dash: " ../audio/dash.wav",
    // hurt2: " ../../assets/soundeffects/protagonist/hurt2.wav",
    // enemyhurt1: " ../../assets/soundeffects/protagonist/hurt2.wav",
    // hit: "../assets/sounds/hit.mp3",
    // walk: "../assets/soundeffects/protagonist/run.mp3",
    // regularLevelsMusic: "../assets/music/musica_menu_principal.mp3",
    // menuPrincipalMusic: "../assets/music/musical_cuartos_regulares.mp3",
    // musica_jefe: "../assets/music/cuerto_jefe_final_musica.mp3",

    // no_weapon: "../assets/soundeffects/weapon_box/no_weapon.mp3",
    // take_weapon: "../assets/soundeffects/weapon_box/take_weapon.wav",    
};

// Control the different sounds in the game
class Sound {
    constructor(action, loop = false, volume = 1.0, ) {
        this.action = action;
        this.audio = new Audio(soundMap[action]);
        this.audio.loop = loop;
        this.audio.volume = volume;
        this.fadeInterval = null;
    }

    play() {
        this.audio.play();
 
    }
    muted() {
        this.audio.muted = !this.audio.muted;
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }

    setLoop(loop) {
        this.audio.loop = loop;
    }

    setSound(action) {
        const soundFile = soundMap[action];
        if (soundFile) {
            const isPlaying = !this.audio.paused;
            this.audio.pause();
            this.audio = new Audio(soundFile);
            this.audio.loop = true;
            this.audio.volume = 0.5;
            if (isPlaying){
                this.audio.play();
            } 
        } else {
            console.log(`No hay sonido asociado a: ${action}`);
        }
    }
}