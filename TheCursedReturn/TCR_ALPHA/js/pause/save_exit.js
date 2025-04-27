// === Save and Exit Function ===
// This function handles saving the game state to the database
// and redirects the player back to the main menu

function saveAndExit() {
    //console.log("Estado actual de gameAPI:", window.gameAPI ? "disponible" : "no disponible");
    //console.log("Estado actual de game:", window.game ? "disponible" : "no disponible");

    // Verify if gameAPI is available in three different ways to ensure it's working properly
    if (!window.gameAPI && typeof ensureGameAPI !== 'function') {
        const script = document.createElement('script');
        script.src = '../js/api.js';
        script.onload = function() {
            console.log("API cargada dinámicamente, reintentando...");
            if (window.gameAPI) {
                saveAndExit();
            }
        };
        document.head.appendChild(script);
        return;
    }

    // 2nd verification for global scope
    if (!window.gameAPI) {
        console.error("gameAPI no está disponible");
        if (typeof window.ensureGameAPI === 'function') {
            window.ensureGameAPI();
        } else {
            console.error("No se puede restaurar gameAPI, función ensureGameAPI no encontrada");
            alert("Error: No se pudo establecer conexión con la base de datos");
            window.location.href = "../html/inicio.html";
            return;
        }
    }
    
    // 3rd verification for gameAPI object (DOM)
    const idPartida = localStorage.getItem('currentPartidaId');
    if (!idPartida) {
        console.error("No se encontró ID de partida en localStorage");
        window.location.href = "../html/inicio.html";
        return;
    }
    
    if (!idPartida) {
        console.error("No se encontró ID de partida en localStorage");
        alert("Error: Información de partida no disponible. Regresando al menú principal...");
        window.location.href = "../html/inicio.html";
        return;
    }

    // Time formatting function
    const timeFormatting = (ms) => {
        if (window.gameAPI && window.gameAPI.timeFormatting) {
            return window.gameAPI.timeFormatting(ms);
        }
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Message after saving a game
    const saveIndicator = document.createElement('div');
    saveIndicator.textContent = "Guardando y saliendo...";
    saveIndicator.style.position = "absolute";
    saveIndicator.style.top = "50%";
    saveIndicator.style.left = "50%";
    saveIndicator.style.transform = "translate(-50%, -50%)";
    saveIndicator.style.padding = "20px";
    saveIndicator.style.background = "rgba(0,0,0,0.8)";
    saveIndicator.style.color = "white";
    saveIndicator.style.borderRadius = "10px";
    saveIndicator.style.zIndex = "10000";
    saveIndicator.style.fontSize = "24px";
    document.body.appendChild(saveIndicator);
    
    // Save game state to the database
    if (window.game && typeof window.game.registerExit === 'function') {
        window.game.registerExit();
        setTimeout(() => {
            window.location.href = "../html/inicio.html";
        }, 1000);
    } else {
        console.error("No se pudo registrar la salida: método no disponible");
    }
    
    // Use a small timeout to let the message be read by the player
    setTimeout(() => {
        window.location.href = "../html/inicio.html";
    }, 800);
}
