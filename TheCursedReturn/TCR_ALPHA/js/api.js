// Function used to ensure the gameAPI object is available
function ensureGameAPI() {
    if (!window.gameAPI) {
        //console.log("🔄 Restaurando gameAPI que se perdió");
        
        // Recreate object gameAPI if it doesn't exist
        window.gameAPI = {
            registerGameEvent: async function(data) {
                if (!data.clase && !data.claseElegida) {
                    // default value in case of missing class
                    data.claseElegida = localStorage.getItem('playerClass') || 'guerrero';
                    //console.log("⚠️ Campo clase faltante, usando valor por defecto:", datos.claseElegida);
                }

                //Removed because I'm using the constants.js file to map the events and biomes
                // // Mapping of events to ensure compatibility
                // const mappedEvents = {
                //     'checkpoints': 'checkpoints',
                //     'checkpoint': 'checkpoints',
                //     'check': 'checkpoints',
                //     'muerteM': 'muerteMaldicion',
                //     'muerteV': 'muerteVida',
                //     'inicio': 'inicio',
                //     'pausa': 'pausa',
                //     'salida': 'salida',
                // };
                
                // // Biome mapping to ensure compatibility
                // const mappedBiomes = {
                //     'woods': 'bosque',
                //     'snow': 'nieve',
                //     'desert': 'desierto',
                // };
                
                const { EVENT_MAPPINGS, BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};
                // Creation of object with correctly formatted fields for database
                const formattedData = {
                    id_partida: data.idPartida || data.id_partida,
                    eventoTrigger: EVENT_MAPPINGS?.[data.eventoTrigger] || data.eventoTrigger, //mappedEvents[datos.eventoTrigger] || datos.eventoTrigger,
                    claseElegida: data.clase || data.claseElegida,
                    tiempoPartida: data.tiempoPartida,
                    puntuacion: data.puntuacion || 0,
                    nivelActual: data.nivel || data.nivelActual || 1,
                    salaActual: data.sala || data.salaActual || 1,
                    biomaActual: BIOME_MAPPINGS?.[data.bioma] || data.biomaActual || 'bosque', //mappedBiomes[datos.bioma]
                    rankM: data.maldicion || data.rankM || 100,
                    vida: data.vida || 100,
                    enemigosCDerrotados: data.enemigosComunesDerrotados || data.enemigosCDerrotados || 0,
                    enemigosFDerrotados: data.enemigosFuertesDerrotados || data.enemigosFDerrotados || 0,
                    jefesDerrotados: data.jefesDerrotados || 0,
                    objetosEncontrados: data.ultimoObjetoEncontrado || data.objetosEncontrados || 'cofre'
                };
                
                // console.log("DEBUG - Enviando evento:", datosFormateados.eventoTrigger);
                // console.log("DEBUG - Bioma enviado:", datosFormateados.biomaActual);
                // console.log("DEBUG - Datos completos:", JSON.stringify(datosFormateados, null, 2));
                
                try {
                    const response = await fetch('http://localhost:5800/api/game-event', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formattedData)
                    });
                    
                    const result = await response.json();
                    console.log("API response:", result);
                    return result;
                } catch (error) {
                    console.error("Error al enviar evento:", error);
                    throw error;
                }
            },
        };
    }
    
    return window.gameAPI;
}

// Expose function to the global scope
window.ensureGameAPI = ensureGameAPI;

function main() {
    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();

            const userEmail = document.querySelector('input[name="correo"]').value;
            const userName = document.querySelector('input[name="nombreUsuario"]').value;
            const userPassword = document.querySelector('input[name="contrasena"]').value;

            if (!userEmail || !userName || !userPassword) {
                alert("Por favor complete todos los campos");
                return false;
            }

            // Email validation 
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(userEmail)) {
                alert("Por favor ingrese un correo electrónico válido.");
                return;
            }

            // Username validation 
            const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
            if (!usernameRegex.test(userName)) {
                alert("El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números, puntos y guiones bajos.");
                return;
            }

            // Password validation (example: at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(userPassword)) {
                alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
                return;
            }

            // Proceed with the fetch request
            const dataObj = { correo: userEmail, nombreUsuario: userName, contrasena: userPassword };


            let response = await fetch('http://localhost:5800/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataObj),
            });

            try {
                // Handle JSON response
                const result = await response.json();

                // If response is OK, show success message
                if (response.ok) {
                    console.log(result);
                    
                    // Guardar IDs importantes en localStorage para usarlos después
                    localStorage.setItem('currentPlayerId', result.id_jugador);
                    localStorage.setItem('currentPartidaId', result.id_partida);
                    localStorage.setItem('currentPlayerName', result.nombreUsuario);
                    
                    // Go to html clases
                    console.log("Redirecting to clases.html");
                    window.location.href = "../html/clases.html";
                }
                // If there's a specific error message from the server, show it
                else {
                    switch (response.status) {
                        case 400:
                            // Bad request - validation errors
                            // alert(responseData.message || "Datos inválidos. Por favor verifique su información.");
                            alert ("Datos inválidos. Por favor verifique su información.");
                            break;
                        case 401:
                            // Unauthorized - wrong password
                            //alert(responseData.message || "Credenciales incorrectas");
                            alert ("Credenciales incorrectas");
                            break;
                        case 409:
                            // Conflict - username already exists
                            //alert(responseData.message || "El nombre de usuario o correo ya está en uso");
                            alert ("El nombre de usuario o correo ya está en uso");
                            break;
                        case 500:
                            // Server error
                            //alert(responseData.message || "Error interno del servidor. Intente más tarde.");
                            alert ("Error interno del servidor. Intente más tarde.");
                            break;
                        default:
                            // Generic error
                            //alert(responseData.message || `Error: ${response.status}`);
                            alert (`Error: ${response.status}`);
                    }
                }
            }
            catch (error) {
                // Error handling JSON 
                console.error("Error processing response:", error);
                alert(`Error: ${response.statusText || "Error desconocido"}`);
            }
        };
    }

    // Function to load the leaderboard when the page loads
    async function loadLeaderboard() {
        const resultContainer = document.getElementById('getResultsID');
        if (!resultContainer) {
            console.log("Elemento getResultsID no encontrado, saltando carga del leaderboard");
            return;
        }
        try {
            let response = await fetch('http://localhost:5800/api/leaderboard', {
                method: 'GET'
            });
            
            if (response.ok) {
                let results = await response.json();
                
                if (results.length > 0) {
                    displayLeaderboard(results);
                } else {
                    container.innerHTML = '<p class="no-data">No leaderboard data available.</p>';
                }
            } else {
                resultContainer.innerHTML = `Error: ${response.status}`;
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            if (document.getElementById('getResultsID')) {
                document.getElementById('getResultsID').innerHTML = `Error fetching leaderboard data: ${error.message}`;
            }
        }
    }

    // Function to display the leaderboard data
    function displayLeaderboard(data) {
        const container = document.getElementById('getResultsID');
        if (!container) {
            console.error("Elemento getResultsID no encontrado al intentar mostrar leaderboard");
            return;
        }
        container.innerHTML = '';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create header row
        const headerRow = table.insertRow(-1);
        headerRow.className = 'header-row';
        
        // Define headers we want to display
        const headers = [
            'Usuario', 
            'Puntuación'
        ];
        
        // Add header cells
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.innerHTML = headerText;
            headerRow.appendChild(headerCell);
        });
        
        // Add data rows
        data.forEach((player, index) => {
            const row = table.insertRow(-1);
            
            // Add rank cell (position in leaderboard)
            const rankCell = row.insertCell(-1);
            rankCell.innerHTML = index + 1;
            
            // Add player data cells
            addCell(row, player.nombreUsuario);
            addCell(row, player.PuntuacionFinal);
            
            // Add class to highlight the first place
            if (index === 0) {
                row.className = 'first-place';
            }
        });
        
        // Add table to the container
        container.appendChild(table);
    }
    
    // Helper function to add a cell to a row
    function addCell(row, content) {
        const cell = row.insertCell(-1);
        cell.innerHTML = content;
    }

    // Load the the user is in the statistics page
    if (document.getElementById('getResultsID')) {
        loadLeaderboard();
    }
}

// === SECCIÓN DE EVENTOS DE JUEGO ===
// Estas funciones manejan el registro de eventos del juego

/**
 * Modificar la función registrarEventoJuego
 * Registra un evento de juego en la base de datos
 * @param {Object} data - Datos del evento a registrar
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
async function registerGameEvent(data) {
    // Verify and adjust the class field in case it's missing
    if (!data.clase && !data.claseElegida) {
        data.claseElegida = localStorage.getItem('playerClass') || 'guerrero';
        //console.log("Campo clase faltante, usando valor por defecto:", datos.claseElegida);
    }

    //Removed because I'm using the constants.js file to map the events and biomes
    // // Mapping of events to ensure compatibility
    // const mappedEvents = {
    //     'checkpoints': 'check',
    //     'inicio': 'inicio',
    //     'pausa': 'pausa',
    //     'salida': 'salida',
    //     'muerteMaldicion': 'muerteM',
    //     'muerteVida': 'muerteV',
    // };
    
    // // Biome mapping to ensure compatibility
    // const mappedBiomes = {
    //     'woods': 'bosque',
    //     'snow': 'nieve',
    //     'desert': 'desierto',
    // };

    const { EVENT_MAPPINGS, BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};

    // Creation of object with correctly formatted fields for database
    const formattedData = {
        id_partida: data.idPartida || data.id_partida,
        eventoTrigger: EVENT_MAPPINGS?.[data.eventoTrigger] || data.eventoTrigger,
        claseElegida: data.clase || data.claseElegida,
        tiempoPartida: data.tiempoPartida,
        puntuacion: data.puntuacion || 0,
        nivelActual: data.nivel || data.nivelActual || 1,
        salaActual: data.sala || data.salaActual || 1,
        biomaActual: BIOME_MAPPINGS?.[data.bioma] || data.biomaActual || 'bosque',
        rankM: data.maldicion || data.rankM || 100,
        vida: data.vida || 100,
        enemigosCDerrotados: data.enemigosComunesDerrotados || data.enemigosCDerrotados || 0,
        enemigosFDerrotados: data.enemigosFuertesDerrotados || data.enemigosFDerrotados || 0,
        jefesDerrotados: data.jefesDerrotados || 0,
        objetosEncontrados: data.ultimoObjetoEncontrado || data.objetosEncontrados || 'cofre'
    };
    
    // console.log("DEBUG - Enviando evento:", datosFormateados.eventoTrigger);
    // console.log("DEBUG - Bioma enviado:", datosFormateados.biomaActual);
    // console.log("DEBUG - Datos completos:", JSON.stringify(datosFormateados, null, 2));
    
    try {
        const response = await fetch('http://localhost:5800/api/game-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedData)
        });
        
        const result = await response.json();
        console.log("API response:", result);
        return result;
    } catch (error) {
        console.error("Error al enviar evento:", error);
        throw error;
    }
}

/**
 * Registra el inicio de una partida
 * @param {number} matchId - ID de la partida 
 * @param {string} selectedClass - Clase elegida por el jugador
 * @returns {Promise} - Resultado de la operación
 */
async function registerStart(matchId, selectedClass) {
    // Visual indicator when starting a game
    const saveIndicator = document.createElement('div');
    saveIndicator.textContent = "Iniciando partida...";
    saveIndicator.style.position = "fixed";
    saveIndicator.style.top = "50%";
    saveIndicator.style.left = "50%";
    saveIndicator.style.transform = "translate(-50%, -50%)";
    saveIndicator.style.padding = "20px 30px";
    saveIndicator.style.background = "rgba(0,0,0,0.85)";
    saveIndicator.style.color = "white";
    saveIndicator.style.fontSize = "20px";
    saveIndicator.style.fontWeight = "bold";
    saveIndicator.style.borderRadius = "10px";
    saveIndicator.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";
    saveIndicator.style.zIndex = "99999";
    
    document.body.appendChild(saveIndicator);

    // Set default values for the game state
    try {
        const result = await registerGameEvent({
            id_partida: matchId,
            eventoTrigger: 'inicio',
            claseElegida: selectedClass,
            tiempoPartida: '00:00:00',
            puntuacion: 0,
            nivelActual: 1,
            salaActual: 1,
            biomaActual: 'bosque',
            rankM: 100.00,
            vida: getInitialHealth(selectedClass),
            enemigosCDerrotados: 0,
            enemigosFDerrotados: 0,
            jefesDerrotados: 0,
            objetosEncontrados: 'cofre'
        });
        
        setTimeout(() => {
            if (document.body.contains(saveIndicator)) {
                document.body.removeChild(saveIndicator);
            }
        }, 4000);
        
        return result;
    } catch (error) {
        
        setTimeout(() => {
            if (document.body.contains(saveIndicator)) {
                document.body.removeChild(saveIndicator);
            }
        }, 4000);
        
        console.error("Error al registrar inicio:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Register a pause in the game
 * @param {Object} gameState - Actual game state
 * @returns {Promise} - Result of the operation
 */
async function registerPause(gameState) {
    return registerGameEvent({
        id_partida: gameState.idPartida,
        eventoTrigger: 'pausa',
        claseElegida: gameState.clase,
        tiempoPartida: gameState.tiempoPartida || '00:00:00',
        puntuacion: gameState.puntuacion || 0,
        nivelActual: gameState.nivel || 1,
        salaActual: gameState.sala || 1,
        biomaActual: gameState.bioma || 'bosque',
        rankM: gameState.maldicion || 100.00,
        vida: gameState.vida || 100.00,
        enemigosCDerrotados: gameState.enemigosComunesDerrotados || 0,
        enemigosFDerrotados: gameState.enemigosFuertesDerrotados || 0,
        jefesDerrotados: gameState.jefesDerrotados || 0,
        objetosEncontrados: gameState.ultimoObjetoEncontrado || 'cofre'
    });
}

/**
 * Register the exit of the game
 * @param {Object} gameState - Actual game state
 * @returns {Promise} - Result of the operation
 */
async function registerExit(gameState) {
    return registerGameEvent({
        id_partida: gameState.idPartida,
        eventoTrigger: 'salida',
        claseElegida: gameState.clase,
        tiempoPartida: gameState.tiempoPartida || '00:00:00',
        puntuacion: gameState.puntuacion || 0,
        nivelActual: gameState.nivel || 1,
        salaActual: gameState.sala || 1,
        biomaActual: gameState.bioma || 'bosque',
        rankM: gameState.maldicion || 100.00,
        vida: gameState.vida || 100.00,
        enemigosCDerrotados: gameState.enemigosComunesDerrotados || 0,
        enemigosFDerrotados: gameState.enemigosFuertesDerrotados || 0,
        jefesDerrotados: gameState.jefesDerrotados || 0,
        objetosEncontrados: gameState.ultimoObjetoEncontrado || 'cofre'
    });
}

/**
 * Register a death in the game
 * @param {Object} gameState - Actual game state
 * @param {string} deathType - Type of death (e.g., 'muerteM', 'muerteV')
 * @returns {Promise} - Result of the operation
 */
async function registerDeath(gameState, deathType) {
    return registerGameEvent({
        id_partida: gameState.idPartida,
        eventoTrigger: deathType,
        claseElegida: gameState.clase,
        tiempoPartida: gameState.tiempoPartida || '00:00:00',
        puntuacion: gameState.puntuacion || 0,
        nivelActual: gameState.nivel || 1,
        salaActual: gameState.sala || 1,
        biomaActual: gameState.bioma || 'bosque',
        rankM: gameState.maldicion || 100.00,
        vida: gameState.vida || 100.00,
        enemigosCDerrotados: gameState.enemigosComunesDerrotados || 0,
        enemigosFDerrotados: gameState.enemigosFuertesDerrotados || 0,
        jefesDerrotados: gameState.jefesDerrotados || 0,
        objetosEncontrados: gameState.ultimoObjetoEncontrado || 'cofre'
    });
}

/**
 * Formats the time in milliseconds to HH:MM:SS
 * @param {number} milliseconds - Tiempo en milisegundos
 * @returns {string} - Time formatted as HH:MM:SS
 */
function formatTime(milliseconds) {
    const horas = Math.floor(milliseconds / 3600000);
    const minutos = Math.floor((milliseconds % 3600000) / 60000);
    const segundos = Math.floor((milliseconds % 60000) / 1000);
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

/**
 * Get the initial health based on the selected class
 * @param {string} selectedClass - Selected class of the player
 * @returns {number} - Initial health value
 */
function getInitialHealth(selectedClass) {
    switch (selectedClass) {
        case 'guerrero': return 120.00;
        case 'arquero': return 90.00;
        case 'hechicero': return 80.00;
        default: return 100.00;
    }
}

main();

// Export the functions to the global scope
window.gameAPI = {
    registrarEventoJuego: registerGameEvent,
    registrarInicio: registerStart,
    registrarPausa: registerPause,
    registrarSalida: registerExit,
    registrarMuerte: registerDeath,
    formatearTiempo: formatTime
};

console.log("gameAPI inicializada:", window.gameAPI);