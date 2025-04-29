// === Portal Class ===
// defines the portal object that lets players move between rooms or levels

class Portal extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, 'portal');
        this.active = true;
        this.cooldown = false;
        this.justTriggered = false;
    }

    checkCollision(player, maps, progress, backgroundImage, onPortalTriggered, onNewLevel) {
        const collision =
            player.position.x + (player.width * 0.5) > this.position.x &&
            player.position.x < this.position.x + this.width &&
            player.position.y < this.position.y + this.height &&
            player.position.y + player.height > this.position.y;

        if (collision && this.active && !this.cooldown) {
            this.cooldown = true;
            this.justTriggered = true;
            
            progress.visited++;

            if (window.game && typeof window.game.totalRoomsVisited !== 'undefined') {
                window.game.totalRoomsVisited++;
            }

            // === Lógica especial para la Bruja ===
            if (progress.level === 3) {
                if (progress.visited === 5) {
                    // Matar a la bruja → victoria
                    gameOver = true;
                    const victoryScreen = document.getElementById("victory-screen");
                    if (victoryScreen) victoryScreen.style.display = "flex";
                    return;
                }

                // NO subas de nivel, solo avanza de sala 4 (boss biome) a sala 5 (Witch)
            } 
            else if (progress.visited >= progress.rooms) {
                // Niveles 1 y 2: sí sube de nivel
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

            if (typeof onPortalTriggered === 'function') {
                onPortalTriggered();
            }

            setTimeout(() => {
                this.cooldown = false;
            }, 1000);
        }
    }
}
