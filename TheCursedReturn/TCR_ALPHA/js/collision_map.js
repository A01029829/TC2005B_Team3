class CollisionMap {
    constructor(flatData, widthInTiles, tileSize = 16) {
        this.tileSize = tileSize;
        this.width = widthInTiles;
        this.height = Math.ceil(flatData.length / widthInTiles);
        this.grid = this.to2DArray(flatData, this.width);
    }

    to2DArray(data, width) {
        const result = [];
        for (let i = 0; i < data.length; i += width) {
            result.push(data.slice(i, i + width));
        }
        return result;
    }

    isBlockedPixel(x, y) {
        // Optional: clamp values to valid canvas size if needed
        const clampedX = Math.min(Math.max(0, x), 912 - 1);
        const clampedY = Math.min(Math.max(0, y), 608 - 1);
        const col = Math.floor(clampedX / this.tileSize);
        const row = Math.floor(clampedY / this.tileSize);
        return this.isBlockedTile(col, row);
    }
    

    isBlockedTile(col, row) {
        if (
            row < 0 ||
            col < 0 ||
            row >= this.grid.length ||
            col >= this.grid[0].length
        ) return true;
        return this.grid[row][col] === 1;
    }
}
