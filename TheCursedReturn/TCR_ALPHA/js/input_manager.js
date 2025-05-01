// === InputManager Class ===
// handles keyboard input by tracking key states based on a key map

class InputManager {
    constructor(keyMap) {
        // === keysPressed stores which keys are currently held down ===
        this.keysPressed = {};

        // === keyMap maps accepted keys to in-game actions (like movement) ===
        this.keyMap = keyMap;

        // start listening for key events
        this.setupListeners();
    }

    // === Setup Key Press Listeners ===
    // adds event listeners to update keysPressed when keys go down/up
    setupListeners() {
        window.addEventListener("keydown", (event) => {
            if (this.keyMap[event.key]) {
                this.keysPressed[event.key] = true
            }
        });

        window.addEventListener("keyup", (event) => {
            if (this.keyMap[event.key]) {
                delete this.keysPressed[event.key];
            }
        });
    }

    // === Check If a Key Is Currently Pressed ===
    isPressed(key) {
        return !!this.keysPressed[key];
    }

    // === Get All Keys Currently Pressed ===
    getPressedKeys() {
        return Object.keys(this.keysPressed);
    }

    // === Reset All Pressed Keys ===
    reset() {
        this.keysPressed = {};
    }
}

// === Function to improve class Selection ===
function setupClassSelection() {
    // ensure it only runs on the class selection page
    if (!document.querySelector('.Knight') || !document.querySelector('.Archer') || !document.querySelector('.Wizard')) {
        return;
    }
    
    //console.log("Configurando selección de clases");
    
    // warrior
    document.querySelector('.Knight .class-button')?.addEventListener('click', () => {
        handleClassSelection('guerrero');
    });
    
    // archer
    document.querySelector('.Archer .class-button')?.addEventListener('click', () => {
        handleClassSelection('arquero');
    });
    
    // wizard
    document.querySelector('.Wizard .class-button')?.addEventListener('click', () => {
        handleClassSelection('hechicero');
    });
}

// auxiliar function to handle class selection and start the game
function handleClassSelection(claseElegida) {
    // match ID from sessionStorage (not using localStorage because class selection is only done once per session)
    const matchID = sessionStorage.getItem('currentPartidaId');
    
    if (!matchID) {
        matchID = localStorage.getItem('currentPartidaId');
        if (matchID) {
            sessionStorage.setItem('currentPartidaId', matchID);
        }
    }
    
    // save the selected class
    sessionStorage.setItem('playerClass', claseElegida);
    
    //console.log(`Clase seleccionada: ${claseElegida}, iniciando partida ${idPartida}`);
    
    // ensure gameAPI is available before calling the function
    if (window.gameAPI && typeof window.gameAPI.registrarInicio === 'function') {
        startMatchWithAPI(matchID, claseElegida);
    } else {
        console.log("gameAPI no disponible aún, esperando...");
        setTimeout(() => {
            if (window.gameAPI && typeof window.gameAPI.registrarInicio === 'function') {
                startMatchWithAPI(matchID, claseElegida);
            } else {
                console.error("Error: gameAPI no disponible después de espera");
                alert("Error: No se pudo cargar el sistema de registro. Intente recargar la página.");
            }
        }, 500);
    }
}

// function to start the game with gameAPI
function startMatchWithAPI(idPartida, claseElegida) {
    window.gameAPI.registrarInicio(idPartida, claseElegida)
        .then(result => {
            if (result.success) {
                window.location.href = "../html/interfaz.html";
            } else {
                console.error("Error al iniciar partida:", result.error);
                alert("Error al iniciar partida. Intente nuevamente.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error de conexión. Intente nuevamente.");
        });
}

// execute setupClassSelection when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupClassSelection);

// export the InputManager class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InputManager };
} else {
    // for browser environments
    window.InputManager = InputManager;
}
