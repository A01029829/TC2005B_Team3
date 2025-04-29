// === Enemy Stats Per Biome, Type and Variant ===
// defines enemy HP and damage depending on the biome, type, and variant
// HP is given per level: [Level1, Level2, Level3]
const ENEMY_STATS = {
    woods: {
        goblin: {
            weak:  { hp: [70, 100, 150], dmg: 10 },
            strong:{ hp: [200, 350, 500], dmg: 20 }
        },
        wolf: {
            boss: { hp: [1000, 1500, 2000], dmg: 25 }
        }
    },
    desert: {
        skeleton: {
            weak:  { hp: [70, 100, 150], dmg: 12 },
            semi:  { hp: [100, 150, 250], dmg: 18 },
            strong:{ hp: [200, 350, 500], dmg: 24 }
        }
    },
    snow: {
        lizard: {
            weak:  { hp: [70, 100, 150], dmg: 14 },
            strong:{ hp: [200, 350, 500], dmg: 22 }
        },
        minotaur: {
            boss: { hp: [1000, 1500, 2000], dmg: 28 }
        }
    },
    witch: {
        boss: { hp: [2000, 2500, 3000], dmg: 35 }
    }
};

// === Enemy Class Definition ===
// defines enemy behavior: movement, animation, stats, and appearance
class Enemy extends AnimatedObject {
    constructor(position, speed, spritePath, type, variant, biome, level){

        // === Constructor: Setup Enemy Object ===
        // inherits from AnimatedObject, sets size, type, and animation frame count (12)
        super(position, 64, 65, 'rgba(0,0,0,0)', 'enemy', 12);
        this.speed = speed; // movement speed
        this.moving = false; // is it currently walking?
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // set sprite configuration
        this.type = type;
        this.variant = variant;
        this.biome = biome;
        this.level = level;

        // default animation values
        this.walkFrames = 6;
        this.attackFrames = 6;
        this.attackTimer = 0;

        // === Assign Movement and Attack Rows Based on Type ===
        // (all of these were manually defined from sprite sheets)
        if (type === 'goblin' && variant === 'weak') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 0, left: 1, down: 2, right: 3 };          
        }

        else if (type === 'goblin' && variant === 'strong') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 53, left: 54, down: 55, right: 56 };
        }        
        
        else if (type === 'lizard' && variant === 'strong') {
            this.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
            this.attackRow = { up: 57, left: 58, down: 59, right: 60 };
        }

        else if (type === 'lizard' && variant === 'weak') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 12, left: 13, down: 14, right: 15 };
        }    
        
        else if (type === 'minotaur' && variant === 'boss') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 4, left: 5, down: 6, right: 7 };
        }

        else if (type === 'wolf' && variant === 'boss') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 53, left: 54, down: 55, right: 56 };
        }        
        
        else if (type === 'skeleton' && variant === 'weak') {
            this.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
            this.attackRow = { up: 57, left: 58, down: 59, right: 60 };
        }
        
        else if (type === 'skeleton' && variant === 'semi') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 53, left: 54, down: 55, right: 56 };
        }
        
        else if (type === 'skeleton' && variant === 'strong') {
            this.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
            this.attackRow = { up: 57, left: 58, down: 59, right: 60 };
        }
        
        /*
        else if (type === 'witch' && variant === 'boss') {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            this.attackRow = { up: 53, left: 54, down: 55, right: 56 };
        }
        */        


        // === Basic Stats ===
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.attacking = false;

        // === Animation Row Info for Attacks ===
        // === fallback for undefined attackRow (prevent crash) ===
        if (!this.attackRow) {
            this.attackRow = {
                up: 53,
                left: 54,
                down: 55,
                right: 56
            };
        }

        // Fallback: if movement or attack animations weren't defined
        if (!this.movementFrames) {
            this.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
        }
        if (!this.attackRow) {
            this.attackRow = { up: 53, left: 54, down: 55, right: 56 };
        }


         // === State and Attributes ===
        this.lastDirection = 'down'; // used for facing direction
        this.attackMagnitude = 2; // strength of attack
        
        if (variant === 'boss') {
            this.width = 98;
            this.height = 98;
        } 
    }

    // === Move Enemy Toward Player (if within range) ===
    moveToward(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;

        // Math.sqrt(dx * dx + dy * dy): pythagorean theorem
        // calculates the distance between the enemy and the player (the hypotenuse)
        const distance = Math.sqrt(dx * dx + dy * dy); // pythagorean theorem

        const detectionRadius = 150; // only move if player is close enough
        if (distance > detectionRadius) {
            this.moving = false;
            return; // do nothing if player is too far
        }

        // Math.atan2(dy, dx): gives you the angle from enemy to player
        // super useful to know which direction to move in
        const angle = Math.atan2(dy, dx);  // get angle toward player

        let pushX = 0;
        let pushY = 0;

        // === Avoid Overlapping Other Enemies ===
        this.gameRef.enemies.forEach(other => {
            if (other !== this) {
                const dx = this.position.x - other.position.x;
                const dy = this.position.y - other.position.y;
                const dist = Math.hypot(dx, dy);
                const minDist = 32; // separation between enemies

                if (dist < minDist && dist > 0) {
                    const overlap = minDist - dist;
                    pushX += (dx / dist) * overlap * 0.4;
                    pushY += (dy / dist) * overlap * 0.4;
                }
            }
        });

        // === Avoid Overlapping Static Objects (chests, healer, gunsmith) ===
        this.gameRef.staticObjects.forEach(obj => {
            if (obj) {
                const dx = this.position.x - obj.position.x;
                const dy = this.position.y - obj.position.y;
                const dist = Math.hypot(dx, dy);
                const minDist = 32;

                if (dist < minDist && dist > 0) {
                    const overlap = minDist - dist;
                    pushX += (dx / dist) * overlap * 0.4;
                    pushY += (dy / dist) * overlap * 0.4;
                }
            }
        });

        // === Intended Movement Direction ===
        let finalX = this.position.x + Math.cos(angle) * this.speed;
        let finalY = this.position.y + Math.sin(angle) * this.speed;
        
        // === Apply Movement If Not Blocked ===
        if (!this.gameRef.collisionMap.isBlockedPixel(finalX, this.position.y)) {
            this.position.x = finalX;
        }
        
        if (!this.gameRef.collisionMap.isBlockedPixel(this.position.x, finalY)) {
            this.position.y = finalY;
        }
        
        // === Apply Push to Avoid Overlap (after movement) ===
        const pushedX = this.position.x + pushX;
        const pushedY = this.position.y + pushY;
        
        if (!this.gameRef.collisionMap.isBlockedPixel(pushedX, this.position.y)) {
            this.position.x = pushedX;
        }
        
        if (!this.gameRef.collisionMap.isBlockedPixel(this.position.x, pushedY)) {
            this.position.y = pushedY;
        }

        this.moving = true; // mark as moving for animation
    }

    // === Update Sprite Animation Based on State ===
    updateAnimation(player, gameFrame, staggerFrames) {
         // === Set Facing Direction Based on Player Location ===
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
    
        // === Attack Animation ===
        if (this.attackTimer > 0) {
             // set correct attack row based on direction
             if (this.type === 'witch' && this.variant === 'boss') {
                if (this.homingAttackRow && this.homingAttackRow[this.lastDirection] !== undefined) {
                    this.spriteRect.y = this.homingAttackRow[this.lastDirection];
                } else {
                    this.spriteRect.y = 0;
                }
            } else if (this.attackRow && this.attackRow[this.lastDirection] !== undefined) {
                this.spriteRect.y = this.attackRow[this.lastDirection];
            } else {
                this.spriteRect.y = 56; // fallback
            }
            
            const totalFrames = this.attackFrames || 6;
            this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;
            this.attackTimer--; // countdown

            // === Witch special attack: fire HomingOrb after attack animation ===
            if (this.type === 'witch' && this.variant === 'boss' && this.attackTimer === 0) {
                this.launchHomingAttack(player);
            }
        

        // === Walking Animation ===
        } else if (this.moving) {
            this.spriteRect.y = this.movementFrames[this.lastDirection]; // correct walk row
            const totalFrames = this.walkFrames || 6;
            this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;
        
        // === Idle Animation (standing still) ===
        } else {
            // Idle pose = stand still on first frame of walking row
            this.spriteRect.y = this.movementFrames[this.lastDirection];
            this.spriteRect.x = 0; // frame 0 of idle stance
        }
    }
    
    // === Reset Enemy Position to a Specific Point ===
    resetPosition(centerX, centerY) {
        this.position.x = centerX + 100; //  offset to avoid overlap
        this.position.y = centerY;
    }

    launchHomingAttack(player) {
        if (this.type === 'witch' && this.variant === 'boss') {
            const orb = new HomingOrb(
                { x: this.position.x, y: this.position.y },
                player,
                this.gameRef
            );
            if (!this.projectiles) {
                this.projectiles = [];
            }
            this.projectiles.push(orb);
        }
    }
    
    draw(ctx) {
        super.draw(ctx); // Dibuja el enemigo normal (sprite)
    
        // Si tiene proyectiles (como la Witch), dibujarlos
        if (this.projectiles) {
            this.projectiles.forEach(projectile => {
                projectile.draw(ctx);
            });
        }
    }
    
}
