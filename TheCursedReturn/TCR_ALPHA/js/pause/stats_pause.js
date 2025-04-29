// === Stats Screen ===
// Displays player stats during pause mode when the "stats" button is selected

// === Load Stats Screen Images ===
const background_stats = new Image();
background_stats.src = '../images/pause/stats_bg.png';

const title_stats = new Image();
title_stats.src = '../images/pause/stats_title.png';

// === Draw Stats Screen ===
// Clears canvas and draws background, title, and placeholder stats text
function drawStats() {
    if (stats_bool) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.drawImage(background_stats, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(title_stats, 200, 75, title_stats.naturalWidth * 0.5, title_stats.naturalHeight * 0.5);

        let enemigosEliminados = 0;
        let puntuacion = 0;
        let claseElegida = "";
        let jefesEliminados = 0;
        let duracionJuego = "00:00:00";
        let nivelMaldicion = 100;

        const game= window.game;

        if (typeof game !== 'undefined') {
            enemigosEliminados = (game.stats?.weakEnemiesDefeated || 0) + 
                                 (game.stats?.strongEnemiesDefeated || 0);
            puntuacion = game.score || 0;
            claseElegida = localStorage.getItem('playerClass') || "guerrero";
            claseElegida = claseElegida.charAt(0).toUpperCase() + claseElegida.slice(1);
            jefesEliminados = game.stats?.bossesDefeated || 0;
            
            // Formatting time for user visualization
            const segundosTotales = Math.floor((game.elapsedTime || 0) / 1000);
            const minutos = Math.floor(segundosTotales / 60);
            const segundos = segundosTotales % 60;
            duracionJuego = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            
            // Get curse value from localStorage or API
            nivelMaldicion = getCurseValue ? getCurseValue() : 100;
        }

        // === Static Labels (real data could be added later) ===
        createText('#d5d4cc', '25px Arial', 'left', 'Enemigos derrotados', 100, 200);
        createText('#d5d4cc', '25px Arial', 'right', enemigosEliminados.toString(), 800, 200);

        createText('#d5d4cc', '25px Arial', 'left', 'Puntuación', 100, 260);
        createText('#d5d4cc', '25px Arial', 'right', puntuacion.toString(), 800, 260);

        createText('#d5d4cc', '25px Arial', 'left', 'Clase elegida', 100, 320);
        createText('#d5d4cc', '25px Arial', 'right', claseElegida.toString(), 800, 320);

        createText('#d5d4cc', '25px Arial', 'left', 'Jefes eliminados', 100, 380);
        createText('#d5d4cc', '25px Arial', 'right', jefesEliminados.toString(), 800, 380);

        createText('#d5d4cc', '25px Arial', 'left', 'Duración', 100, 440);
        createText('#d5d4cc', '25px Arial', 'right', duracionJuego.toString(), 800, 440);

        createText('#d5d4cc', '25px Arial', 'left', 'Maldición', 100, 500);
        createText('#d5d4cc', '25px Arial', 'right', `${nivelMaldicion.toString()}%`, 800, 500);

        // Return hint
        createText('#d5d4cc', '35px serif', 'left', 'Regresa con "Esc"', 335, 575);

        requestAnimationFrame(drawStats);
    }
}

// === Draw Custom Text on Canvas ===
// Helper to draw formatted text anywhere on screen
function createText(color, font, align, text, x, y) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

window.drawStats = drawStats;
