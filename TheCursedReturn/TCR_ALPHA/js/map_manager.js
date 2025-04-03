// === MapManager Class ===
// manages map selection, switching, and tracking the current map
class MapManager {
    constructor(maps, backgroundImage) {
        this.maps = maps; // object with map keys and their image paths
        this.backgroundImage = backgroundImage; // image element to update
        this.currentMapKey = null; // key of the current map in use
    }

    // === Change the Current Map Image ===
    // updates the background image and sets the new current map key
    changeMap(mapImagePath) {
        if (window.animationFrame) {
            cancelAnimationFrame(window.animationFrame); // stop the current game loop if active
        }

        console.log("Changing map to:", mapImagePath);
        this.backgroundImage.src = mapImagePath;

        // find and store the key that corresponds to the selected image path
        this.currentMapKey = Object.keys(this.maps).find(
            (key) => this.maps[key] === mapImagePath
        );
    }

    // === Select a Random Map (Avoid Repeats Until All Are Used) ===
    // picks a map that’s not the current one or already used in this run
    selectRandomMap(currentMapKey = null, usedSet = new Set()) {
        const mapKeys = Object.keys(this.maps);
        const filteredKeys = mapKeys.filter(key => key !== currentMapKey && !usedSet.has(key));

        // if all maps have been used, clear the set and allow reuse
        if (filteredKeys.length === 0) {
            usedSet.clear();
        }

        // re-filter in case we just reset
        const finalPool = mapKeys.filter(key => key !== currentMapKey && !usedSet.has(key));
        const randomKey = finalPool[Math.floor(Math.random() * finalPool.length)];

        // change to the selected map
        usedSet.add(randomKey);
        this.changeMap(this.maps[randomKey]);
        this.currentMapKey = randomKey;
        return randomKey;
    }

    // === Get the Name (Key) of the Current Map ===
    // matches current background image with the known map paths
    getCurrentMapName() {
        for (const [name, path] of Object.entries(this.maps)) {
            if (
                this.backgroundImage.src === path ||
                this.backgroundImage.src.endsWith(path)
            ) {
                return name;
            }
        }
        return null;
    }
}
