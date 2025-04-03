class Enemy extends AnimatedObject {
    constructor(position, speed, spritePath) {
        super(position, 64, 65, 'rgba(0,0,0,0)', 'enemy', 12);
        this.speed = speed;
        this.moving = false;
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });
        this.maxHealth = 1;
        this.health = this.maxHealth;
        this.attacking = false;
        this.attackRow = { up: 53, left: 54, down: 55, right: 56 };
        this.lastDirection = 'down';
        // Change depending on the enemy
        this.attackMagnitude = 1;

    }

    moveToward(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        const detectionRadius = 150;
        if (distance > detectionRadius) {
            this.moving = false;
            return;
        }
    
        const angle = Math.atan2(dy, dx);
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;
        this.moving = true;
    }
    
    updateAnimation(player, gameFrame, staggerFrames) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
    
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                this.lastDirection = 'right';
            } else {
                this.lastDirection = 'left';
            }
        } else {
            if (dy > 0) {
                this.lastDirection = 'down';
            } else {
                this.lastDirection = 'up';
            }
        }        
    
        if (this.attacking) {
            this.spriteRect.y = this.attackRow[this.lastDirection];
        } else if (this.moving) {
            if (this.lastDirection === 'right') this.spriteRect.y = 11;
            if (this.lastDirection === 'left') this.spriteRect.y = 9;
            if (this.lastDirection === 'down') this.spriteRect.y = 10;
            if (this.lastDirection === 'up') this.spriteRect.y = 8;
        }
    
        if (this.attacking || this.moving) {
            this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % 4;
        } else {
            this.spriteRect.x = 0; // idle
        }
    }
    
    resetPosition(centerX, centerY) {
        this.position.x = centerX + 100;
        this.position.y = centerY;
    }
}
