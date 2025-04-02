class Portal extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, 'portal');
        this.active = true;
    }

    checkCollision(player, maps, progress, backgroundImage, changeMapCallback, onNewLevel) {
        if (!this.active) return false;

        const p = player.position;
        const playerBox = { x: p.x, y: p.y, width: player.width, height: player.height };
        const portalBox = { x: this.position.x, y: this.position.y, width: this.width, height: this.height };

        const isOverlapping =
            playerBox.x < portalBox.x + portalBox.width &&
            playerBox.x + playerBox.width > portalBox.x &&
            playerBox.y < portalBox.y + portalBox.height &&
            playerBox.y + playerBox.height > portalBox.y;

        if (isOverlapping) {
            this.active = false;
            progress.visited++;

            if (progress.visited === progress.rooms) {
                progress.level++;
                progress.visited = 0;
                onNewLevel();
                if (progress.level > progress.maxLevels) {
                    window.location.href = "victory.html";
                    return true;
                }
            }

            let currentMap = null;
            for (const [mapName, mapPath] of Object.entries(maps)) {
                if (mapPath === backgroundImage.src || backgroundImage.src.endsWith(mapPath)) {
                    currentMap = mapName;
                    break;
                }
            }

            changeMapCallback(); // the Game object now handles the logic



            // Tell the game to update the collision map
            if (player.gameRef && player.gameRef.updateCollisionMap) {
                player.gameRef.updateCollisionMap();
            }

            // Reset player position
            player.resetPosition();

            // Reactivate portal after 1 second
            setTimeout(() => {
                this.active = true;
            }, 1000);

            return true;
        }

        return false;
    }
}
