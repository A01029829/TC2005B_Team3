// === Portal Class ===
// defines the portal object that lets players move between rooms or levels

class Portal extends GameObject {
    constructor(position, width, height, color) {

        // inherits from GameObject, adds portal-specific behavior
        super(position, width, height, color, 'portal');
        this.active = true; // portal starts as usable
        this.cooldown = false; // cooldown to prevent immediate re-triggering
        this.justTriggered = false; // flag to detect transitions
    }

    // === Check if Player Collides with the Portal ===
    // handles room switching, level progression, map updating, and victory condition
    checkCollision(player, maps, progress, backgroundImage, onPortalTriggered, onNewLevel) {
        const collision =
            player.position.x + (player.width * 0.5) > this.position.x &&
            player.position.x < this.position.x + this.width &&
            player.position.y < this.position.y + this.height &&
            player.position.y + player.height > this.position.y;

        if (collision && this.active && !this.cooldown) {
            //console.log("¡PORTAL ACTIVADO! Cambiando sala...");
            this.cooldown = true;
            this.justTriggered = true; // Esta línea es crucial
            
            //console.log("%c Portal activado: justTriggered = true", "color: lime; font-weight: bold; font-size: 14px");
            
            // Increase the visited room count
            progress.visited++;
            
            // Increase the total rooms visited count in the game object
            if (window.game && typeof window.game.totalRoomsVisited !== 'undefined') {
                window.game.totalRoomsVisited++;
                //console.log(`Total de salas visitadas actualizado: ${window.game.totalRoomsVisited}`);
            }
            
            // Verify if the player has visited all rooms in the current level
            if (progress.visited >= progress.rooms) {
                progress.visited = 0;
                progress.level++;
                
                if (progress.level > progress.maxLevels) {
                    gameOver = true;
                    const victoryScreen = document.getElementById("victory-screen");
                    if (victoryScreen) victoryScreen.style.display = "flex";
                    return;
                }
                
                if (typeof onNewLevel === 'function') {
                    onNewLevel();
                }
            }
            
            // Execute function to activate the portal
            if (typeof onPortalTriggered === 'function') {
                onPortalTriggered();
            }
            
            setTimeout(() => {
                this.cooldown = false;
            }, 1000);
        }
    }
}
