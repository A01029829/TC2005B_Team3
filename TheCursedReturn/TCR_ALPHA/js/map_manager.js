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
    selectRandomMap(currentMapName = null) {
        const mapKeys = Object.keys(this.maps);
        const filteredKeys = currentMapName
            ? mapKeys.filter((key) => key !== currentMapName)
            : mapKeys;

        const randomKey = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
        this.changeMap(this.maps[randomKey]);
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
