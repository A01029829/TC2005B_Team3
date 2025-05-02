// === Portal Class ===
// defines the portal object that lets players move between rooms or levels

class Portal extends GameObject {
    constructor(position, width, height, color) {
        // base setup — position, width, height, color, label
        super(position, width, height, color, 'portal');

        // === Portal properties ===
        this.active = true; // is the portal active?
        this.cooldown = false; // is the portal on cooldown?
        this.justTriggered = false; // was the portal just activated?
    }

    // === Check if player collides with the portal and handle room/level transitions ===
    checkCollision(player, maps, progress, backgroundImage, onPortalTriggered, onNewLevel) {
        if (!this.active || this.cooldown) return;
        
        // Specific logic for the Witch
        if (progress.level === 3 && progress.visited === 4) {
            if (window.game && window.game.enemies) {
                const witchIsAlive = window.game.enemies.some(enemy => 
                    enemy.type === 'witch' && enemy.variant === 'boss' && enemy.health > 0);
                if (witchIsAlive) {
                    return;
                }
            }
        }

        const collision =
            player.position.x + (player.width * 0.5) > this.position.x && // right side past portal left
            player.position.x < this.position.x + this.width &&           // left side before portal right
            player.position.y < this.position.y + this.height &&         // top before portal bottom
            player.position.y + player.height > this.position.y;         // bottom past portal top

        if (collision && this.active && !this.cooldown) {
            this.cooldown = true;       // activate cooldown
            this.justTriggered = true;  // mark as just triggered

            progress.visited++;         // increase rooms visited count

            // update global game counter if available
            if (window.game && typeof window.game.totalRoomsVisited !== 'undefined') {
                window.game.totalRoomsVisited++;
            }

            // === Special logic for the Witch final boss ===
            if (progress.level === 3) {
                if (progress.visited === 5) {
                    // defeat the Witch = trigger victory
                    gameOver = true;

                    // call victory handler if defined
                    if (window.game && typeof window.game.registerVictory === 'function') {
                        window.game.registerVictory();
                    }

                    // redirect to victory screen after short delay
                    setTimeout(() => {
                        window.location.href = '../html/victory.html';
                    }, 1500);
                    return;
                }

                // do not advance level, just move from room 4 (boss biome) to room 5 (Witch)
            } 
            else if (progress.visited >= progress.rooms) {
                // levels 1 and 2: advance to next level
                progress.visited = 0;
                progress.level++;

                if (progress.level > progress.maxLevels) {
                    gameOver = true;
                    const victoryScreen = document.getElementById("victory-screen");
                    if (victoryScreen) victoryScreen.style.display = "flex";
                    return;
                }

                // call new level handler if defined
                if (typeof onNewLevel === 'function') {
                    onNewLevel();
                }
            }

            // call portal trigger handler if defined
            if (typeof onPortalTriggered === 'function') {
                onPortalTriggered();
            }

            // reset cooldown after 1 second
            setTimeout(() => {
                this.cooldown = false;
            }, 1000);
        }
    }
}
