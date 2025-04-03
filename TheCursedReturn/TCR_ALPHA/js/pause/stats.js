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

        // === Static Labels (real data could be added later) ===
        createText('#d5d4cc', '25px Arial', 'left', 'Enemigos derrotados', 100, 200);
        createText('#d5d4cc', '25px Arial', 'left', 'Puntuación', 100, 260);
        createText('#d5d4cc', '25px Arial', 'left', 'Clase elegida', 100, 320);
        createText('#d5d4cc', '25px Arial', 'left', 'Jefes eliminados', 100, 380);
        createText('#d5d4cc', '25px Arial', 'left', 'Duración', 100, 440);

        // Return hint
        createText('#d5d4cc', '35px serif', 'left', 'Regresa con "esc"', 335, 500);

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
