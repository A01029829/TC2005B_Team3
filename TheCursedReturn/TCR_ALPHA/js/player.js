class Player extends AnimatedObject {
    constructor(position, spritePath, movementFrames, attackRow) {
        super(position, 64, 65, 'rgba(0,0,0,0)', 'player', 12);
        this.speed = 3;
        this.movementFrames = movementFrames;
        this.attackRow = attackRow;
        this.attacking = false;
        this.attackTimer = null;
        this.moving = false;
        this.lastDirection = 'down';
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });
        this.maxHealth = 10;
        this.health = this.maxHealth;
    }

    handleInput(keysPressed, keyMap, collisionMap) {
        this.moving = false;

        // handle attack
        if (keysPressed['k']) {
            this.attacking = true;
            this.spriteRect.y = this.attackRow[this.lastDirection];
            this.attackTimer = 10;
            return;
        }

        //  attack timing
        if (this.attacking && this.attackTimer !== null) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.attacking = false;
                this.attackTimer = null;
            }
            return;
        }

        // movement and update last direction
        for (let key in keysPressed) {
            if (keyMap[key] && key !== 'k') {
                const nextX = this.position.x + keyMap[key].dx * this.speed;
                const nextY = this.position.y + keyMap[key].dy * this.speed;

                if (!collisionMap || !collisionMap.isBlockedPixel(nextX, nextY)) {
                    this.position.x = nextX;
                    this.position.y = nextY;
                    this.spriteRect.y = keyMap[key].frameY;
                    this.lastDirection = this._getDirection(key); // track direction
                    this.moving = true;
                }
            }
        }
    }

    _getDirection(key) {
        switch (key) {
            case 'w': return 'up';
            case 'a': return 'left';
            case 's': return 'down';
            case 'd': return 'right';
            default: return this.lastDirection;
        }
    }

    updateAnimation(gameFrame, staggerFrames) {
        const totalFrames = 6;
        this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;
    }

    clampToBounds(canvasWidth, canvasHeight) {
        const spriteOffsetY = this.spriteRect?.height - 16 || 0;
        const spriteOffsetX = (this.spriteRect?.width - 16) / 2 || 0;

        this.position.x = Math.max(spriteOffsetX, Math.min(this.position.x, canvasWidth - this.width + spriteOffsetX));
        this.position.y = Math.max(spriteOffsetY, Math.min(this.position.y, canvasHeight - this.height + spriteOffsetY));
    }

    resetPosition() {
        this.position.x = 50;
        this.position.y = 300;
    }
}
