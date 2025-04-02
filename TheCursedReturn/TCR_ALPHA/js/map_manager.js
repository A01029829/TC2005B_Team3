class MapManager {
    constructor(maps, backgroundImage) {
        this.maps = maps;
        this.backgroundImage = backgroundImage;
        this.currentMapKey = null;
    }

    changeMap(mapImagePath) {
        if (window.animationFrame) {
            cancelAnimationFrame(window.animationFrame);
        }
    
        console.log("Changing map to:", mapImagePath);
        this.backgroundImage.src = mapImagePath;
    
        this.currentMapKey = Object.keys(this.maps).find(
            (key) => this.maps[key] === mapImagePath
        );
    }
    
    selectRandomMap(currentMapKey = null, usedSet = new Set()) {
        const mapKeys = Object.keys(this.maps);
        const filteredKeys = mapKeys.filter(key => key !== currentMapKey && !usedSet.has(key));
    
        if (filteredKeys.length === 0) {
            usedSet.clear();
        }
    
        const finalPool = mapKeys.filter(key => key !== currentMapKey && !usedSet.has(key));
        const randomKey = finalPool[Math.floor(Math.random() * finalPool.length)];
    
        usedSet.add(randomKey);
        this.changeMap(this.maps[randomKey]);
        this.currentMapKey = randomKey;
        return randomKey;
    }
    

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
