// Ajustes
let stats_bool = false;
let sonido_bool = false;

const title = new Image();
title.src = '../images/pause/title.png';

const background_pause = new Image();
background_pause.src = '../images/pause/pause_bg.png';

const sonido = new Image();
sonido.src = '../images/pause/sonido.png';

const stats = new Image();
stats.src = '../images/pause/stats.png';

const save = new Image();
save.src = '../images/pause/save.png';

const resume = new Image();
resume.src = '../images/pause/resume.png';

function drawPause() {
    if (paused) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.drawImage(background_pause, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(title, 200, 50, title.naturalWidth * 0.5, title.naturalHeight * 0.5);

        ctx.drawImage(sonido, 380, 185, sonido.naturalWidth * 0.4, sonido.naturalHeight * 0.4);
        ctx.drawImage(stats, 350, 240, stats.naturalWidth * 0.4, stats.naturalHeight * 0.4);
        ctx.drawImage(save, 330, 295, save.naturalWidth * 0.4, save.naturalHeight * 0.4);
        ctx.drawImage(resume, 370, 350, resume.naturalWidth * 0.4, resume.naturalHeight * 0.4);

        requestAnimationFrame(drawPause);
    }
}

Promise.all([
    new Promise(resolve => title.onload = resolve),
    new Promise(resolve => background_pause.onload = resolve),
    new Promise(resolve => sonido.onload = resolve),
    new Promise(resolve => stats.onload = resolve),
    new Promise(resolve => save.onload = resolve),
    new Promise(resolve => resume.onload = resolve)
]).then(() => {
    const sonidoWidth = sonido.naturalWidth * 0.4;
    const sonidoHeight = sonido.naturalHeight * 0.4;
    const sonidoX = 380;
    const sonidoY = 185;

    const statsWidth = stats.naturalWidth * 0.4;
    const statsHeight = stats.naturalHeight * 0.4;
    const statsX = 350;
    const statsY = 240;

    const saveWidth = save.naturalWidth * 0.4;
    const saveHeight = save.naturalHeight * 0.4;
    const saveX = 330;
    const saveY = 295;

    const resumeWidth = resume.naturalWidth * 0.4;
    const resumeHeight = resume.naturalHeight * 0.4;
    const resumeX = 370;
    const resumeY = 350;

    window.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Pos del mouse en el canvas
        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        // Ir a pantalla de sonido
        if (paused && mouseX >= sonidoX && mouseX <= sonidoX + sonidoWidth &&
            mouseY >= sonidoY && mouseY <= sonidoY + sonidoHeight) {
            sonido_bool = true;
            drawAudio();
        }

        // Ir a pantalla de stats
        if (paused && mouseX >= statsX && mouseX <= statsX + statsWidth &&
            mouseY >= statsY && mouseY <= statsY + statsHeight) {
            stats_bool = true;
            drawStats();
        }

        // Guardar y salir
        if (paused && mouseX >= saveX && mouseX <= saveX + saveWidth &&
            mouseY >= saveY && mouseY <= saveY + saveHeight) {
            saveAndExit();
        }

        // Reanudar juego
        if (paused && mouseX >= resumeX && mouseX <= resumeX + resumeWidth &&
            mouseY >= resumeY && mouseY <= resumeY + resumeHeight) {
            paused = false;
            cancelAnimationFrame(drawPause);
            window.game.loop();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (paused && stats_bool) {
            if (event.key === "Escape") {
                stats_bool = false;
                drawPause();
            }
        } else if (paused && sonido_bool) {
            if (event.key === "Escape") {
                sonido_bool = false;
                drawPause();
            }
    }
});})
