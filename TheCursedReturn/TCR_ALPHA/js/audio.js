// //const canvas = document.getElementById('audio');

// // Configura el volumen inicial (0.5 = 50%)
// document.getElementById('backgroundMusic').volume = 0.5;

// // Guardar el estado de reproducción en localStorage
// document.getElementById('backgroundMusic').addEventListener('play', function() {
//     localStorage.setItem('musicPlaying', 'true');
//     localStorage.setItem('musicVolume', this.volume);
// });

// // Comprobar si la música ya estaba reproduciéndose
// window.addEventListener('load', function() {
//     const music = document.getElementById('backgroundMusic');
//     if (localStorage.getItem('musicPlaying') === 'true') {
//         music.play();
//         if (localStorage.getItem('musicVolume')) {
//             music.volume = parseFloat(localStorage.getItem('musicVolume'));
//         }
//     }
// });

// // Referencias a elementos DOM - Verificamos si existen primero
// const backgroundMusic = document.getElementById('backgroundMusic');
// const soundEffect = document.getElementById('soundEffect');
// const musicVolume = document.getElementById('musicVolume');
// const musicVolumeValue = document.getElementById('musicVolumeValue');
// const muteMusic = document.getElementById('muteMusic');
// const effectsVolume = document.getElementById('effectsVolume');
// const effectsVolumeValue = document.getElementById('effectsVolumeValue');
// const testSound = document.getElementById('testSound');

// // Inicializar configuración de audio
// function initAudioSettings() {
//     console.log("Inicializando configuración de audio");
    
//     // Verificar si los elementos existen antes de interactuar con ellos
//     if (backgroundMusic) {
//         // Configurar el volumen inicial de la música
//         const savedMusicVolume = localStorage.getItem('musicVolume') || "0.5";
//         backgroundMusic.volume = parseFloat(savedMusicVolume);
//         console.log("Volumen de música establecido a:", backgroundMusic.volume);
        
//         // Actualizar el deslizador de volumen si existe
//         if (musicVolume && musicVolumeValue) {
//             musicVolume.value = savedMusicVolume;
//             musicVolumeValue.textContent = `${Math.round(parseFloat(savedMusicVolume) * 100)}%`;
//         }
        
//         // Verificar estado de silencio
//         if (localStorage.getItem('musicMuted') === 'true') {
//             backgroundMusic.muted = true;
//             if (muteMusic) muteMusic.textContent = '🔊 Activar sonido';
//         } else {
//             backgroundMusic.muted = false;
//             if (muteMusic) muteMusic.textContent = '🔇 Silenciar';
//         }
        
//         // Siempre intenta reproducir la música automáticamente
//         playBackgroundMusic();
//     }
    
//     // Configurar el volumen inicial de los efectos
//     if (soundEffect) {
//         const savedEffectsVolume = localStorage.getItem('effectsVolume') || "0.7";
//         soundEffect.volume = parseFloat(savedEffectsVolume);
        
//         // Actualizar el deslizador de efectos si existe
//         if (effectsVolume && effectsVolumeValue) {
//             effectsVolume.value = savedEffectsVolume;
//             effectsVolumeValue.textContent = `${Math.round(parseFloat(savedEffectsVolume) * 100)}%`;
//         }
//     }
// }

// // Configurar los eventos para los controles
// function setupEventListeners() {
//     // Control de volumen de música
//     if (musicVolume && backgroundMusic && musicVolumeValue) {
//         musicVolume.addEventListener('input', function() {
//             const value = this.value;
//             musicVolumeValue.textContent = `${Math.round(parseFloat(value) * 100)}%`;
//             backgroundMusic.volume = parseFloat(value);
//             localStorage.setItem('musicVolume', value);
//             console.log("Volumen de música ajustado a:", value);
//         });
//     }
    
//     // Control de volumen de efectos
//     if (effectsVolume && soundEffect && effectsVolumeValue) {
//         effectsVolume.addEventListener('input', function() {
//             const value = this.value;
//             effectsVolumeValue.textContent = `${Math.round(parseFloat(value) * 100)}%`;
//             soundEffect.volume = parseFloat(value);
//             localStorage.setItem('effectsVolume', value);
//             console.log("Volumen de efectos ajustado a:", value);
//         });
//     }
    
//     // Botón para probar efectos de sonido
//     if (testSound && soundEffect) {
//         testSound.addEventListener('click', function() {
//             console.log("Probando efecto de sonido");
//             soundEffect.currentTime = 0;
//             soundEffect.play().catch(e => console.log("Error al reproducir efecto:", e));
//         });
//     }
// }

// // Función para silenciar/activar el sonido
// function toggleMute() {
//     if (!backgroundMusic) return;
    
//     if (backgroundMusic.muted) {
//         backgroundMusic.muted = false;
//         if (muteMusic) muteMusic.textContent = '🔇 Silenciar';
//         localStorage.setItem('musicMuted', 'false');
//         console.log("Audio activado");
//     } else {
//         backgroundMusic.muted = true;
//         if (muteMusic) muteMusic.textContent = '🔊 Activar sonido';
//         localStorage.setItem('musicMuted', 'true');
//         console.log("Audio silenciado");
//     }
// }

// // Exponer la función para uso global
// window.toggleMute = toggleMute;

// // Función para intentar reproducir la música
// function playBackgroundMusic() {
//     if (!backgroundMusic) return;
    
//     let playPromise = backgroundMusic.play();
    
//     if (playPromise !== undefined) {
//         playPromise.then(_ => {
//             console.log("Reproducción de música iniciada con éxito");
//             localStorage.setItem('musicPlaying', 'true');
//         })
//         .catch(error => {
//             console.log("Error al reproducir música automáticamente:", error);
            
//             // Configurar evento para reproducir después de la interacción del usuario
//             const startAudio = function() {
//                 console.log("Intentando reproducir después de interacción del usuario");
//                 backgroundMusic.play()
//                     .then(() => {
//                         console.log("Reproducción iniciada después de interacción");
//                         localStorage.setItem('musicPlaying', 'true');
//                     })
//                     .catch(e => console.log("Error al reproducir después de interacción:", e));
                
//                 // Limpiar eventos
//                 document.removeEventListener('click', startAudio);
//                 document.removeEventListener('touchstart', startAudio);
//                 document.removeEventListener('keydown', startAudio);
//             };
            
//             // Múltiples tipos de interacción para mayor compatibilidad
//             document.addEventListener('click', startAudio, { once: true });
//             document.addEventListener('touchstart', startAudio, { once: true });
//             document.addEventListener('keydown', startAudio, { once: true });
            
//             // Mensaje para el usuario
//             console.log("Esperando interacción del usuario para reproducir audio...");
//         });
//     }
// }

// // Inicialización cuando el DOM esté listo
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("DOM cargado, iniciando configuración de audio");
    
//     initAudioSettings();
//     setupEventListeners();
// });

// // También intentamos iniciar la reproducción cuando la página está completamente cargada
// window.addEventListener('load', function() {
//     // Si aún no se está reproduciendo, intentamos de nuevo
//     if (backgroundMusic && backgroundMusic.paused) {
//         console.log("Intentando reproducir en evento 'load'");
//         playBackgroundMusic();
//     }
// });