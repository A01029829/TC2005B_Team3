// === Collision Map Class Definition ===
// this class handles collision logic based on a 2D grid created from flat data (arrays of 0s and 1s).

class CollisionMap {
    constructor(flatData, widthInTiles, tileSize = 16) {

        // === Constructor: Setup Map Dimensions ===
        // flatData = array of 0s and 1s (like [0,0,1,0,1,...])
        // widthInTiles = how many tiles wide the map is
        // tileSize = pixel size of each tile (16x16)
        this.tileSize = tileSize;
        this.width = widthInTiles;

        // Math.ceil: rounds up to the nearest whole number
        // here it's used to figure out how many rows are needed to fit the entire array into rows of 'widthInTiles' columns
        this.height = Math.ceil(flatData.length / widthInTiles);

        // Convert array into a grid (2D array)
        this.grid = this.to2DArray(flatData, this.width);
    }

    // === Convert Flat Data to 2D Array ===
    // turns the array into rows based on the width
    to2DArray(data, width) {
        const result = [];
        for (let i = 0; i < data.length; i += width) {
            // data.slice(start, end): copies a chunk of the array from index 'i' to 'i + width' (not including the end)
            result.push(data.slice(i, i + width));
        }
        return result;
    }

    // === Check Pixel-Level Collision ===
    // you give it pixel coordinates (x, y) and it checks if there's a blocked tile there
    isBlockedPixel(x, y) {

        // Math.max: makes sure the value doesn't go below 0
        // Math.min: makes sure it doesn't go past the canvas edge
        // together they "clamp" the values between 0 and the canvas size
        const clampedX = Math.min(Math.max(0, x), 912 - 1);
        const clampedY = Math.min(Math.max(0, y), 608 - 1);

        // Math.floor: rounds down to the nearest whole number
        // we use this to figure out which tile the pixel belongs to
        const col = Math.floor(clampedX / this.tileSize);
        const row = Math.floor(clampedY / this.tileSize);

        // ask the grid if that tile is blocked
        return this.isBlockedTile(col, row);
    }

    // === Check Tile-Level Collision ===
    // you give it tile coordinates (column, row) and it returns true if it’s blocked
    isBlockedTile(col, row) {
        // if the row or column is out of bounds OR the tile value is 1 (blocked), return true
        if (
            row < 0 ||
            col < 0 ||
            row >= this.grid.length ||
            col >= this.grid[0].length
        ) return true;

        // tile is blocked if its value is 1
        return this.grid[row][col] === 1;
    }
}
