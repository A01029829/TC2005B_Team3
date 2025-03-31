(function() {
    class AudioManager {
        constructor() {
            // Musica de fondo
            this.backgroundMusic = new Audio('../audio/ambience.wav');
            this.backgroundMusic.loop = true;

            // Efectos de sonido
            this.soundEffects = {
                Sword: new Audio('../audio/sword.mp3')
            };

            // Config inicial
            this.musicVolume = 0.34; 
            this.effectsVolume = 0.50; 

            // Mostrar controles de audio
            this.musicVolumeSlider = null;
            this.musicToggleBtn = null;
            this.effectsVolumeSlider = null;
            this.testEffectBtn = null;
        }

        initializeAudioControls() {
            // Slider de volumen de musica
            this.musicVolumeSlider = document.createElement('input');
            this.musicVolumeSlider.type = 'range';
            this.musicVolumeSlider.id = 'music-volume-slider';
            this.musicVolumeSlider.min = 0;
            this.musicVolumeSlider.max = 1;
            this.musicVolumeSlider.step = 0.01;
            this.musicVolumeSlider.value = this.musicVolume;
            this.musicVolumeSlider.addEventListener('input', (e) => this.setMusicVolume(e.target.value));

            // Boton de activar/desactivar musica
            this.musicToggleBtn = document.createElement('button');
            this.musicToggleBtn.id = 'music-toggle-btn';
            this.musicToggleBtn.textContent = 'Activar Sonido';
            this.musicToggleBtn.addEventListener('click', () => this.toggleMusic());

            // Slider de volumen de efectos
            this.effectsVolumeSlider = document.createElement('input');
            this.effectsVolumeSlider.type = 'range';
            this.effectsVolumeSlider.id = 'effects-volume-slider';
            this.effectsVolumeSlider.min = 0;
            this.effectsVolumeSlider.max = 1;
            this.effectsVolumeSlider.step = 0.01;
            this.effectsVolumeSlider.value = this.effectsVolume;
            this.effectsVolumeSlider.addEventListener('input', (e) => this.setEffectsVolume(e.target.value));

            // Boton de probar efecto
            this.testEffectBtn = document.createElement('button');
            this.testEffectBtn.id = 'test-effect-btn';
            this.testEffectBtn.textContent = 'Probar Efecto';
            this.testEffectBtn.addEventListener('click', () => this.playTestEffect());

            return {
                musicVolumeSlider: this.musicVolumeSlider,
                musicToggleBtn: this.musicToggleBtn,
                effectsVolumeSlider: this.effectsVolumeSlider,
                testEffectBtn: this.testEffectBtn
            };
        }

        setMusicVolume(volume) {
            this.musicVolume = parseFloat(volume);
            this.backgroundMusic.volume = this.musicVolume;
            
            // Actualizar el display de volumen
            if (this.musicVolumeSlider) {
                this.musicVolumeSlider.value = this.musicVolume;
            }
        }

        setEffectsVolume(volume) {
            this.effectsVolume = parseFloat(volume);
            Object.values(this.soundEffects).forEach(effect => {
                effect.volume = this.effectsVolume;
            });
            
            // Actualizar el display de volumen
            if (this.effectsVolumeSlider) {
                this.effectsVolumeSlider.value = this.effectsVolume;
            }
        }

        toggleMusic() {
            if (this.backgroundMusic.paused) {
                this.backgroundMusic.play();
                this.musicToggleBtn.textContent = 'Desactivar Sonido';
            } else {
                this.backgroundMusic.pause();
                this.musicToggleBtn.textContent = 'Activar Sonido';
            }
        }

        playTestEffect() {
            // Reproducir un efecto de sonido aleatorio
            const effectKeys = Object.keys(this.soundEffects);
            const randomEffect = this.soundEffects[effectKeys[Math.floor(Math.random() * effectKeys.length)]];
            randomEffect.currentTime = 0;
            randomEffect.play();
        }

        pauseAll() {
            this.backgroundMusic.pause();
            Object.values(this.soundEffects).forEach(effect => effect.pause());
        }

        resumeAll() {
            this.backgroundMusic.play();
        }
    }

    // Exportar la clase AudioManager
    window.AudioManager = AudioManager;
})();

// Crear una instancia de AudioManager
const audioManager = new AudioManager();