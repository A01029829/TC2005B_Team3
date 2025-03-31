const title_audio = new Image();
title_audio.src = '../images/pause/audio_title.png';

function drawAudio() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.drawImage(background_stats, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(title_audio, 200, 75, title_stats.naturalWidth * 0.5, title_stats.naturalHeight * 0.5);

    createText('#d5d4cc', '35px serif', 'left', 'Regresa con "esc"', 335, 500); 

    requestAnimationFrame(drawAudio);
}