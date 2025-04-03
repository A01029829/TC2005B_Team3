// === Portal Class ===
// defines the portal object that lets players move between rooms or levels
class Portal extends GameObject {
    constructor(position, width, height, color) {
        // inherits from GameObject
        super(position, width, height, color, 'portal');
        this.active = true; // determines if portal is usable
    }

    // === Check if Player Collides with the Portal ===
    // handles room switching, level progression, and map updating
    checkCollision(player, maps, progress, backgroundImage, changeMapCallback, onNewLevel) {
        console.log("Portal active?", this.active);
        if (!this.active) return false;

        // define hitboxes for player and portal
        const p = player.position;
        const playerBox = { x: p.x, y: p.y, width: player.width, height: player.height };
        const portalBox = { x: this.position.x, y: this.position.y, width: this.width, height: this.height };

        // === Collision Check ===
        const isOverlapping =
            playerBox.x < portalBox.x + portalBox.width &&
            playerBox.x + playerBox.width > portalBox.x &&
            playerBox.y < portalBox.y + portalBox.height &&
            playerBox.y + playerBox.height > portalBox.y;

        // === If Player Enters Portal ===
        if (isOverlapping) {
            this.active = false; // deactivate portal after use
            progress.visited++;  // track room visits

            // === Level Transition Check ===
            if (progress.visited === progress.rooms) {
                progress.level++;
                progress.visited = 0;
                onNewLevel(); // display level-up notification

                if (progress.level > progress.maxLevels) {
                    window.location.href = "victory.html"; // game ends in victory
                    return true;
                }
            }

            // === Identify Current Map (by comparing image src) ===
            let currentMap = null;
            for (const [mapName, mapPath] of Object.entries(maps)) {
                if (mapPath === backgroundImage.src || backgroundImage.src.endsWith(mapPath)) {
                    currentMap = mapName;
                    break;
                }
            }

            // === Tell Game to Switch Map ===
            changeMapCallback(); // main game object handles enemy/map change

            // === Update Collision Map If Available ===
            if (player.gameRef && player.gameRef.updateCollisionMap) {
                player.gameRef.updateCollisionMap();
            }

            // === Reset Player Position After Teleporting ===
            player.resetPosition();

            return true;
        }

        return false;
    }
}
