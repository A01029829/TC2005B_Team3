// Load game over image
const gameOverImage = new Image();
gameOverImage.src = '../images/game_over/gameover.png';
const gameOver_return = new Image();
gameOver_return.src = '../images/game_over/reiniciar.png';
const gameOver_menu = new Image();
gameOver_menu.src = '../images/game_over/menu.png';


function GameOver() {
    gameOver = true;
    ctx.drawImage(gameOverImage, 300, 100, 300, 300);
    ctx.drawImage(gameOver_return, 275, 375, 150, 66);
    ctx.drawImage(gameOver_menu, 425, 375, 200, 64);
}

const returnWidth = 150;
const returnHeight = 66;
const returnX = 275;
const returnY = 375;
const menuWidth = 200;
const menuHeight = 64;
const menuX = 425;
const menuY = 375;


window.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    console.log("Click en el canvas");

    // Pos del mouse en el canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    console.log("Pos mouse: ", mouseX, mouseY);
    console.log("Pos return: ", returnX, returnY);
    console.log("return", gameOver_return.width + returnX, gameOver_return.height + returnY);

    // Reiniciar
    if (gameOver && mouseX >= returnX && mouseX <= returnX + returnWidth &&
        mouseY >= returnY && mouseY <= returnY + returnHeight) {
        console.log("Reiniciar");
        window.location.reload();
    }

    // Ir al menu
    if (gameOver && mouseX >= menuX && mouseX <= menuX + menuWidth &&
        mouseY >= menuY && mouseY <= menuY + menuHeight) {
        console.log("Menu");
        window.location.href = "../html/inicio.html";
    }
});