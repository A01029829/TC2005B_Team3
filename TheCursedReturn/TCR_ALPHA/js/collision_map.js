// === Collision Map Class Definition ===
// this class handles collision logic based on a 2D grid created from flat data.
class CollisionMap {
    constructor(flatData, widthInTiles, tileSize = 16) {

        // === Constructor: Setup Map Dimensions ===
        // flatData = array of 0s and 1s (like [0,0,1,0,1,...])
        // widthInTiles = how many tiles wide the map is
        // tileSize = pixel size of each tile (16x16)
        this.tileSize = tileSize;
        this.width = widthInTiles;
        this.height = Math.ceil(flatData.length / widthInTiles); // rows are auto-calculated
        this.grid = this.to2DArray(flatData, this.width); // converts 1D array into 2D grid
    }

    // === Convert Flat Data to 2D Array ===
    // takes the 1D collision data and slices it into rows based on map width
    to2DArray(data, width) {
        const result = [];
        for (let i = 0; i < data.length; i += width) {
            result.push(data.slice(i, i + width));
        }
        return result;
    }

    // === Check Pixel-Level Collision ===
    // you give it pixel coordinates (x, y) and it checks if there's a blocked tile there
    isBlockedPixel(x, y) {

        // optionally clamps values so they stay inside canvas bounds (912x608)
        const clampedX = Math.min(Math.max(0, x), 912 - 1);
        const clampedY = Math.min(Math.max(0, y), 608 - 1);

        // convert pixel coordinates to tile coordinates
        const col = Math.floor(clampedX / this.tileSize);
        const row = Math.floor(clampedY / this.tileSize);

        // return whether the tile is blocked
        return this.isBlockedTile(col, row);
    }

    // === Check Tile-Level Collision ===
    // you give it tile coordinates (column, row) and it returns true if it’s blocked
    isBlockedTile(col, row) {

        // returns true if out of bounds OR the tile is 1 (blocked)
        if (
            row < 0 ||
            col < 0 ||
            row >= this.grid.length ||
            col >= this.grid[0].length
        ) return true;
        return this.grid[row][col] === 1;
    }
}
