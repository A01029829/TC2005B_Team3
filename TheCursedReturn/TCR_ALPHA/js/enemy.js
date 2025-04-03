// === Enemy Class Definition ===
// this defines the enemy behavior, movement, animation, and basic attack logic
class Enemy extends AnimatedObject {
    constructor(position, speed, spritePath) {

        // === Constructor: Setup Enemy Object ===
        // inherits from AnimatedObject, sets size, type, and animation frame count (12)
        super(position, 64, 65, 'rgba(0,0,0,0)', 'enemy', 12);
        this.speed = speed; // how fast the enemy moves
        this.moving = false; // whether it's currently moving
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // sprite setup

        // === Basic Stats and State ===
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.attacking = false;

        // === Animation Row Info for Attacks ===
        this.attackRow = {
            up: 53,
            left: 54,
            down: 55,
            right: 56
        };

        this.lastDirection = 'down'; // used for facing direction
        this.attackMagnitude = 1; // strength of attack
    }

    // === Move Enemy Toward Player (if within range) ===
    moveToward(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // distance to player

        const detectionRadius = 150; // enemy starts chasing if player is within this range
        if (distance > detectionRadius) {
            this.moving = false;
            return;
        }

        const angle = Math.atan2(dy, dx); // direction to move in
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;
        this.moving = true;
    }

    // === Update Sprite Animation Based on State ===
    updateAnimation(player, gameFrame, staggerFrames) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;

        // === Determine Facing Direction Based on Player's Position ===
        if (Math.abs(dx) > Math.abs(dy)) {
            this.lastDirection = dx > 0 ? 'right' : 'left';
        } else {
            this.lastDirection = dy > 0 ? 'down' : 'up';
        }

        // === Select Sprite Row Based on Action and Direction ===
        if (this.attacking) {
            this.spriteRect.y = this.attackRow[this.lastDirection]; // attack animation
        } else if (this.moving) {
            // walking animations
            if (this.lastDirection === 'right') this.spriteRect.y = 11;
            if (this.lastDirection === 'left') this.spriteRect.y = 9;
            if (this.lastDirection === 'down') this.spriteRect.y = 10;
            if (this.lastDirection === 'up') this.spriteRect.y = 8;
        } else {
            this.spriteRect.y = 10; // idle (default is down)
        }

        // === Handle Frame Switching for Animation ===
        if (this.attacking || this.moving) {
            this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % 4;
        }
    }

    // === Reset Enemy Position to a Specific Point ===
    resetPosition(centerX, centerY) {
        this.position.x = centerX + 100; // spawns a bit offset from center
        this.position.y = centerY;
    }
}
