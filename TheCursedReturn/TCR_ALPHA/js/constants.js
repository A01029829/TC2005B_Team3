// Biome mappings
const BIOME_MAPPINGS = {
    'woods': 'bosque',
    'snow': 'nieve',
    'desert': 'desierto',
};

// Mapping of events
const EVENT_MAPPINGS = {
    'checkpoints': 'checkpoints',
    'checkpoint': 'checkpoints',
    'check': 'checkpoints',
    'muerteM': 'muerteMaldicion',
    'muerteMaldicion': 'muerteMaldicion',
    'muerteV': 'muerteVida',
    'muerteVida': 'muerteVida',
    'inicio': 'inicio',
    'pausa': 'pausa',
    'salida': 'salida',
    'fin': 'fin'
};

// Initial class values
const CLASS_INITIAL_VALUES = {
    'guerrero': { vida: 120.00, ataque: 30, defensa: 20 },
    'arquero': { vida: 90.00, ataque: 40, defensa: 10 },
    'hechicero': { vida: 80.00, ataque: 50, defensa: 5 },
    'default': { vida: 100.00, ataque: 25, defensa: 15 }
};

// Formatting time function
function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Exporting constants
window.TCR_CONSTANTS = {
    BIOME_MAPPINGS,
    EVENT_MAPPINGS,
    CLASS_INITIAL_VALUES,
    formatTime
};