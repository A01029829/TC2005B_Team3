// === Portal Class ===
// defines the portal object that lets players move between rooms or levels

class Portal extends GameObject {
    constructor(position, width, height, color) {

        // inherits from GameObject, adds portal-specific behavior
        super(position, width, height, color, 'portal');
        this.active = true; // portal starts as usable
    }

    // === Check if Player Collides with the Portal ===
    // handles room switching, level progression, map updating, and victory condition
    checkCollision(player, maps, progress, backgroundImage, changeMapCallback, onNewLevel) {
        console.log("Portal active?", this.active);
        if (!this.active) return false;

        // === Define Player and Portal Bounding Boxes ===
        const p = player.position;
        const playerBox = {
            x: p.x,
            y: p.y,
            width: player.width,
            height: player.height
        };

        const portalBox = {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        };

        // === Axis Alligned Bounding Box Collision Check ===
        // checks if the player rectangle overlaps with the portal rectangle
        const isOverlapping =
            playerBox.x < portalBox.x + portalBox.width &&
            playerBox.x + playerBox.width > portalBox.x &&
            playerBox.y < portalBox.y + portalBox.height &&
            playerBox.y + playerBox.height > portalBox.y;

        // === If Player Steps Into Portal ===
        if (isOverlapping) {
            this.active = false; // deactivate so it's not triggered again immediately
            progress.visited++;  // count this room as visited

            // === Move to Next Level if All Rooms Visited ===
            if (progress.visited === progress.rooms) {
                progress.level++;
                progress.visited = 0;
                onNewLevel(); // show level-up UI

                // === Victory Condition ===
                if (progress.level > progress.maxLevels) {
                    // redirects to the victory screen
                    // this immediately changes the page using the browser
                    window.location.href = "victory.html";
                    return true;
                }
            }

            // === Identify Current Map by Image Source ===
            let currentMap = null;
            for (const [mapName, mapPath] of Object.entries(maps)) {
                // sometimes src includes full path, so we check with endsWith just in case
                if (mapPath === backgroundImage.src || backgroundImage.src.endsWith(mapPath)) {
                    currentMap = mapName;
                    break;
                }
            }

            // === Tell Game to Load a New Map ===
            // `changeMapCallback()` is a function passed from the main game class
            // it handles selecting a new map and resetting enemies
            changeMapCallback();

            // === Ask Game to Update Collision Map ===
            if (player.gameRef && player.gameRef.updateCollisionMap) {
                player.gameRef.updateCollisionMap();
            }

            // === Reset Player Position to Default ===
            player.resetPosition();

            return true;
        }

        return false;
    }
}
