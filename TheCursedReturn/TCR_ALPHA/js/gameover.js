// Load game over image
const gameOverImage = new Image();
gameOverImage.src = '../images/gameover.png';

function GameOver() {
    gameOver = true;
    ctx.drawImage(gameOverImage, 300, 100, 300, 300);
}