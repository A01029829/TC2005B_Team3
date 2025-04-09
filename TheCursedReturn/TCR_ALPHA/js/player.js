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

        // dash setup
        this.dashing = false;
        this.dashCooldown = false;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;

        this.dashSpeed = 10; // dash movement speed
        this.dashDuration = 10; // frames the dash lasts
        this.dashCooldownDuration = 60; //frames before the player can dash again

        this.arrows = [];
        this.arrowCooldown = 0;

        this.lastDirection = 'down'; // default

    }

    // === Handle Input and Move Player ===
    // handles movement, attacks, and collision detection
    handleInput(keysPressed, keyMap, collisionMap) {
        this.moving = false;

        if (keyMap['k'] && keysPressed['k']) {
            if (this.classType === 'archer' && this.arrowCooldown <= 0) {
                setTimeout(() => {
                    this.shootArrow();
                }, 500); // sync with bow draw animation                
                this.arrowCooldown = 20; // frames between shots
            }
        
            this.attacking = true;
        } else {
            this.attacking = false;
        }        

        if (keysPressed[' '] && !this.dashing && !this.dashCooldown) {
            this.dashing = true;
            this.dashTimer = this.dashDuration;
            this.dashCooldown = true;
            this.dashCooldownTimer = this.dashCooldownDuration;
        }        

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
                let currentSpeed = this.speed;
                    if (this.dashing) {
                        currentSpeed = this.dashSpeed;
                    }

                const nextX = this.position.x + keyMap[key].dx * currentSpeed;
                const nextY = this.position.y + keyMap[key].dy * currentSpeed;
                this.lastDirection = keyMap[key].dir;        

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

        if (this.dashing) {
            this.dashTimer--;
            if (this.dashTimer <= 0) {
                this.dashing = false;
            }
        }
        
        if (this.dashCooldown) {
            this.dashCooldownTimer--;
            if (this.dashCooldownTimer <= 0) {
                this.dashCooldown = false;
            }
        }

        if (this.arrowCooldown > 0) this.arrowCooldown--;
        
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

    // === Arrow mechanics ===
shootArrow() {
    let arrowX = this.position.x;
    let arrowY = this.position.y;
    
    switch (this.lastDirection) {
        case 'up':
            arrowX += this.width / 2 - 64;
            arrowY -= 20;
            break;
        case 'down':
            arrowX += this.width / 2 - 64;
            arrowY += this.height - 100;
            break;
        case 'left':
            arrowX -= 22;
            arrowY += this.height / 2 - 65;
            break;
        case 'right':
            arrowX += this.width - 22;
            arrowY += this.height / 2 - 65;
            break;
    }

    const arrow = new Arrow(
        { x: arrowX, y: arrowY },
        this.lastDirection,
        this.arrowImage
    );
    this.arrows.push(arrow);
}


    // ===  Arrow direction based on animation row ===
    getDirection() {
            return this.lastDirection;
    }
    
    
}
