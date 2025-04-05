// === Player Class ===
// Handles movement, attacks, health, and animation for the player character

class Player extends AnimatedObject {
    constructor(position, spritePath, movementFrames, attackRow) {

        // === Player Setup ===
        // uses AnimatedObject (so player has sprites/animation support)
        super(position, 64, 65, 'rgba(0,0,0,0)', 'player', 12);

        this.speed = 3; // movement speed
        this.movementFrames = movementFrames;
        this.attackRow = attackRow;

        // player state
        this.attacking = false;
        this.attackTimer = null;
        this.moving = false;
        this.lastDirection = 'down';

        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });

        // health setup
        this.maxHealth = 50;
        this.health = this.maxHealth;

        this.attackMagnitude = 5;
    }

    // === Handle Input and Move Player ===
    // handles movement, attacks, and collision detection
    handleInput(keysPressed, keyMap, collisionMap) {
        this.moving = false;

        // === Start Attack ===
        if (keysPressed['k']) {
            this.attacking = true;
            this.spriteRect.y = this.attackRow[this.lastDirection];
            this.attackTimer = 10; // attack duration (frames)
            return;
        }

        // === Attack Countdown ===
        if (this.attacking && this.attackTimer !== null) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.attacking = false;
                this.attackTimer = null;
            }
            return;
        }

        // === Move in Direction Based on Pressed Keys ===
        for (let key in keysPressed) {
            if (
                keyMap[key] &&
                typeof keyMap[key].dx === "number" &&
                typeof keyMap[key].dy === "number"
            ) {
                const nextX = this.position.x + keyMap[key].dx * this.speed;
                const nextY = this.position.y + keyMap[key].dy * this.speed;
        

                // check for collisions before moving
                if (!collisionMap || !collisionMap.isBlockedPixel(nextX, nextY)) {
                    this.position.x = nextX;
                    this.position.y = nextY;

                    this.spriteRect.y = keyMap[key].frameY; // set walking animation row
                    this.lastDirection = this._getDirection(key); // save direction for attacks
                    this.moving = true;
                }
            }
        }
    }

    // === Determine Direction Name from Key ===
    // just translates key presses into 'up', 'left', etc.
    _getDirection(key) {
        switch (key) {
            case 'w': return 'up';
            case 'a': return 'left';
            case 's': return 'down';
            case 'd': return 'right';
            default: return this.lastDirection;
        }
    }

    // === Update Animation Frame ===
    // controls the frame the sprite is currently showing
    updateAnimation(gameFrame, staggerFrames) {
        const totalFrames = 6;

        // Math.floor(gameFrame / staggerFrames): slows down animation by dividing the game frame
        // % totalFrames: loops the animation between 0 and 5
        this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;
    }

    // === Keep Player Inside Canvas Bounds ===
    clampToBounds(canvasWidth, canvasHeight) {
        // offsets are used because sprite graphics may overflow the actual hitbox (16x16)
        // these values compensate for that to avoid clipping out of bounds

        // spriteOffsetY: difference between sprite height and real height (extra pixels on top)
        const spriteOffsetY = this.spriteRect.height - 16 || 0;

        // spriteOffsetX: horizontal correction (e.g., half of extra width)
        const spriteOffsetX = (this.spriteRect.width - 16) / 2 || 0;

        // X: make sure player stays within canvas bounds (but accounts for sprite size)
        // Math.min: clamps max right edge
        // Math.max: clamps left edge
        this.position.x = Math.max(
            spriteOffsetX,
            Math.min(this.position.x, canvasWidth - this.width + spriteOffsetX)
        );

        // Y: same as above but vertical
        this.position.y = Math.max(
            spriteOffsetY,
            Math.min(this.position.y, canvasHeight - this.height + spriteOffsetY)
        );
    }

    // === Reset Player to Starting Position ===
    resetPosition() {
        this.position.x = 50;
        this.position.y = 300;
    }
}
