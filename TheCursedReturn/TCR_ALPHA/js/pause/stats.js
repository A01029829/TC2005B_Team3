const background_stats = new Image();
background_stats.src = '../images/pause/stats_bg.png';
const title_stats = new Image();
title_stats.src = '../images/pause/stats_title.png';

function drawStats() {
    if (stats_bool) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.drawImage(background_stats, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(title_stats, 200, 75, title_stats.naturalWidth * 0.5, title_stats.naturalHeight * 0.5);

        // Stats data
        createText('#d5d4cc', '25px Arial', 'left', 'Enemigos derrotados', 100, 200);
        createText('#d5d4cc', '25px Arial', 'left', 'Puntuación', 100, 260);
        createText('#d5d4cc', '25px Arial', 'left', 'Clase elegida', 100, 320);
        createText('#d5d4cc', '25px Arial', 'left', 'Jefes eliminados', 100, 380);
        createText('#d5d4cc', '25px Arial', 'left', 'Duración', 100, 440);
        createText('#d5d4cc', '35px serif', 'left', 'Regresa con "esc"', 335, 500);

        requestAnimationFrame(drawStats);
    }
}

function createText (color, font, align, text, x, y) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}