// === Load Game Over Screen Images ===
// these are the main image, restart button, and menu button
const gameOverImage = new Image();
gameOverImage.src = '../images/game_over/gameover.png';

const gameOver_return = new Image();
gameOver_return.src = '../images/game_over/reiniciar.png';

const gameOver_menu = new Image();
gameOver_menu.src = '../images/game_over/menu.png';

// === Display Game Over Screen ===
// this gets triggered when the player dies or curse ends
function GameOver() {
    gameOver = true;

    // draw main game over image
    ctx.drawImage(gameOverImage, 300, 100, 300, 300);

    // draw restart and menu buttons
    ctx.drawImage(gameOver_return, 275, 375, 150, 66);
    ctx.drawImage(gameOver_menu, 425, 375, 200, 64);
}

// === Button Bounds for Click Detection ===
// these define where the restart and menu buttons are on the canvas
const returnWidth = 150;
const returnHeight = 66;
const returnX = 275;
const returnY = 375;

const menuWidth = 200;
const menuHeight = 64;
const menuX = 425;
const menuY = 375;

// === Handle Mouse Clicks on Game Over Screen ===
// detects if the player clicked on "Restart" or "Menu"
window.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();

    // scale mouse coordinates to canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    console.log("Canvas clicked");

    // mouse position relative to canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    console.log("Mouse pos:", mouseX, mouseY);
    console.log("Return button pos:", returnX, returnY);
    console.log("Return size:", gameOver_return.width + returnX, gameOver_return.height + returnY);

    // === Restart Button Clicked ===
    if (gameOver &&
        mouseX >= returnX && mouseX <= returnX + returnWidth &&
        mouseY >= returnY && mouseY <= returnY + returnHeight) {
        console.log("Restarting game...");
        window.location.reload();
    }

    // === Menu Button Clicked ===
    if (gameOver &&
        mouseX >= menuX && mouseX <= menuX + menuWidth &&
        mouseY >= menuY && mouseY <= menuY + menuHeight) {
        console.log("Returning to menu...");
        
        // Register the exit event in the game object if it exists
        if (window.game && typeof window.game.registerExit === 'function') {
            window.game.registerExit();
        }
        setTimeout(() => {
            window.location.href = "../html/inicio.html";
        }, 500);
    }
});
