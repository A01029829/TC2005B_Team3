// === MapManager Class ===
// manages map selection, switching, and tracking the current map

class MapManager {
    constructor(maps, backgroundImage) {
        this.maps = maps; // object with map keys (like "woods1") and their image paths
        this.backgroundImage = backgroundImage; // image element to update on screen
        this.currentMapKey = null; // keeps track of the current map being shown
    }

    // === Change the Current Map Image ===
    // updates the background image and stores the new current map key
    changeMap(mapImagePath) {
        if (window.animationFrame) {
            // stops the current game loop frame if one exists, just in case
            cancelAnimationFrame(window.animationFrame);
        }
        this.backgroundImage.src = mapImagePath; // sets the actual image

        // finds the name (key) that matches this image path and saves it
        this.currentMapKey = Object.keys(this.maps).find(
            (key) => this.maps[key] === mapImagePath
        );

        // hide controls after the first map is changed
        showControls = false;
    }

    // === Select a Random Map (Avoid Repeats Until All Are Used) ===
    // picks a new map that hasn't been visited yet
    selectRandomMap(currentMapKey = null, usedSet = new Set()) {
        const mapKeys = Object.keys(this.maps);

        // filter out the current map and already-used maps
        const filteredKeys = mapKeys.filter(key => key !== currentMapKey && !usedSet.has(key));

        // if all maps have been used, reset the used list
        if (filteredKeys.length === 0) {
            usedSet.clear();
        }

        // recalculate the pool just in case we reset it
        const finalPool = mapKeys.filter(key => key !== currentMapKey && !usedSet.has(key));

        // Math.random() gives a random float between 0 and 1
        // Math.floor() turns it into a usable index
        const randomKey = finalPool[Math.floor(Math.random() * finalPool.length)];

        // add the selected key to the used set and switch to that map
        usedSet.add(randomKey);
        this.changeMap(this.maps[randomKey]);
        this.currentMapKey = randomKey;

        return randomKey;
    }

    // === Get the Name (Key) of the Current Map ===
    // returns the name (key) of the current map by comparing its image source
    getCurrentMapName() {
        for (const [name, path] of Object.entries(this.maps)) {

            // some browsers include full URL, so we also check if it ends with the path
            if (
                this.backgroundImage.src === path ||
                this.backgroundImage.src.endsWith(path)
            ) {
                return name;
            }
        }
        return null; // fallback in case no match is found
    }
}
