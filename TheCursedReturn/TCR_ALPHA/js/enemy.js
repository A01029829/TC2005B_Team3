class Enemy extends AnimatedObject {
    constructor(position, speed, spritePath) {
        super(position, 64, 65, 'rgba(0,0,0,0)', 'enemy', 12);
        this.speed = speed;
        this.moving = false;
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });
    }

    moveToward(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) {
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            this.position.x += moveX;
            this.position.y += moveY;
            this.moving = true;
        } else {
            this.moving = false;
        }
    }

    updateAnimation(player, gameFrame, staggerFrames) {
        const dx = Math.abs(this.position.x - player.position.x);
        const dy = Math.abs(this.position.y - player.position.y);

        if (dx > dy) {
            this.spriteRect.y = this.position.x < player.position.x ? 11 : 9;
        } else {
            this.spriteRect.y = this.position.y < player.position.y ? 10 : 8;
        }

        if (this.moving) {
            this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % 9;
        } else {
            this.spriteRect.x = 0;
        }
    }

    resetPosition(centerX, centerY) {
        this.position.x = centerX + 100;
        this.position.y = centerY;
    }
}
