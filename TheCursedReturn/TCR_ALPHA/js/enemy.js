// === Enemy Class Definition ===
// This defines the enemy behavior, movement, animation, and basic attack logic
class Enemy extends AnimatedObject {
    constructor(position, speed, spritePath) {

        // === Constructor: Setup Enemy Object ===
        // inherits from AnimatedObject, sets size, type, and animation frame count (12)
        super(position, 64, 65, 'rgba(0,0,0,0)', 'enemy', 12);
        this.speed = speed; // how fast the enemy moves
        this.moving = false; // whether it's currently moving
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // sprite setup

        // === Basic Stats and State ===
        this.maxHealth = 20;
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
        this.attackMagnitude = 2; // strength of attack
    }

    // === Move Enemy Toward Player (if within range) ===
    moveToward(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;

        // Math.sqrt(dx * dx + dy * dy): pythagorean theorem
        // calculates the distance between the enemy and the player (the hypotenuse)
        const distance = Math.sqrt(dx * dx + dy * dy);

        const detectionRadius = 150; // enemy starts chasing if player is within this range
        if (distance > detectionRadius) {
            this.moving = false;
            return;
        }

        // Math.atan2(dy, dx): gives you the angle from enemy to player
        // super useful to know which direction to move in
        const angle = Math.atan2(dy, dx);

        // Math.cos(angle): gets the x-direction from the angle
        // Math.sin(angle): gets the y-direction from the angle
        // multiplying them by speed makes the enemy move toward the player
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;

        this.moving = true;
    }

    // === Update Sprite Animation Based on State ===
    updateAnimation(player, gameFrame, staggerFrames) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;

        // Math.abs: gets the absolute value (we don’t care if it's negative)
        // this helps us figure out if the enemy is more horizontal or vertical compared to the player
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
            this.spriteRect.y = 10; // idle
        }

        // Math.floor: rounds down to nearest whole number
        // we use it to switch frames smoothly every few game frames
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
