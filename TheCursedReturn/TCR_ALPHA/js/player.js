// === Player Class ===
// Handles movement, attacks, health, and animation for the player character
class Player extends AnimatedObject {
    constructor(position, spritePath, movementFrames, attackRow) {

        // === Player Setup ===
        // uses AnimatedObject to inherit position, sprite, and animation logic
        super(position, 64, 65, 'rgba(0,0,0,0)', 'player', 12);

        // === Class Selection and Base Damage ===
        this.classType = localStorage.getItem("selectedClass") || "knight";
        if (this.classType === "knight") {
            this.attackMagnitude = 35; // melee
        } else if (this.classType === "archer") {
            this.attackMagnitude = 12; // ranged, faster
        } else if (this.classType === "wizard") {
            this.attackMagnitude = 20; // magic
        }

        // === Movement and Animation Setup ===
        this.speed = 3; // movement speed
        this.movementFrames = movementFrames; // object with direction (frameRow)
        this.attackRow = attackRow; // object with direction (attackRow)

        // === Player State Flags ===
        this.attacking = false; // is attacking now
        this.attackTimer = null; // how long the attack alsts
        this.attackInProgress = false; // controls single fire
        this.attackFrameCounter = 0;   // counts animation progress
        this.moving = false; // whether the player is moving
        this.lastDirection = 'down'; // initial facing direction

        // === Sprite Setup ===
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // assign sprite and base frame sizes

        // === Health Setup ===
        this.maxHealth = 100; // max HP
        this.health = this.maxHealth; // start at full HP

        // === Dash Setup ===
        this.dashing = false; // currently dashing?
        this.dashCooldown = false; // on cooldown?
        this.dashTimer = 0; // remaining dash duration
        this.dashCooldownTimer = 0; // remaining cooldown

        this.dashSpeed = 10; // speed while dashing
        this.dashDuration = 10; // dash lasts for 10 frames
        this.dashCooldownDuration = 60; // cooldown before another dash

        // === Projectile ===
        this.arrows = []; // archer´s arrows
        this.arrowCooldown = 0; // delay between shot 

        this.projectiles = []; // all prjectiles (arrows or fireballs)
        this.fireballCooldown = 0; // delay between fireballs

        this.lastDirection = 'down'; // default

        // === Death Handling ===
        this.dying = false; // currently dying
        this.deathTimer = 0; // time left in death animation

        // === Secondary Weapon Handling ===
        this.secondaryWeapon = null; // type of secondary weapon (dagger, spear, etc.)
        this.secondaryTimer = 0;  // time left for active secondary weapon
        this.originalSpritePath = spritePath; // store default sprite
        this.originalAttackRow = attackRow; // store default attack frames
        this.originalMovementFrames = movementFrames; // store default movement frames

        this.deathDuration = 30; // duration of death animation (frames)

        // === Pending Weapon Before Pickup ===
        this.pendingWeapon = null; // weapon object from chest
        this.pendingIcon = null; // icon name for HUD

        this.secondarySpritePath = null; // sprite of secondary weapon if equipped

        this.equipPressedLastFrame = false; // prevent golding 'o' to trigger infinitely
    }

    // === Handle Input and Move Player ===
    // handles movement, attacks, and collision detection
    handleInput(keysPressed, keyMap, collisionMap) {

        if (this.dying) return; // no input allowed while dying
        this.moving = false; // reset moving flag
    
        // === Start attack only on key press (not while holding it) ===
        if (keyMap['k'] && keysPressed['k'] && !this.attackInProgress) {
            this.attackInProgress = true;
            this.attacking = true;
            this.attackFrameCounter = 0;
            this.spriteRect.y = this.attackRow[this.lastDirection]; // set correct attack row
            this.attackTimer = 15; // frames for full attack animation

            // Play sound effect for attack
            if (this.classType === 'knight') {
                // const swordSound = new Sound("sword");
                // gameSounds.push(swordSound);
                if (this.secondaryWeapon) {
                    hitSound.play();
                }
                else {
                    swordSound.play();
                }   
            }

            if (this.classType === 'archer') {
                // const bowSound = new Sound("bow");
                // gameSounds.push(bowSound);
                if (this.secondaryWeapon) {
                    hitSound.play();
                }
                else {
                    bowSound.play();
                }
            }

            if (this.classType === 'wizard') {
                // const spellSound = new Sound("spell");
                // gameSounds.push(spellSound);
                if (this.secondaryWeapon) {
                    hitSound.play();
                }
                else {
                    spellSound.play();
                }
            }
        }
    
        // === Start dash if not already dashing or on cooldown ===
        if (keysPressed[' '] && !this.dashing && !this.dashCooldown) {
            this.dashing = true;
            this.dashTimer = this.dashDuration; // dash lasts this many frames
            this.dashCooldown = true; // activate cooldown
            this.dashCooldownTimer = this.dashCooldownDuration;

            // Play dash sound effect
            // const dashSound = new Sound("dash");
            // gameSounds.push(dashSound);
            dashSound.play();
        }
        
        // === Equip secondary weapon if pressing 'o' ===
        if (keysPressed['o'] && !this.equipPressedLastFrame) {
            if (this.pendingWeapon) {
                // equip the pending weapon
                const { name, spritePath, movementFrames, attackRow } = this.pendingWeapon;
                this.activateSecondaryWeapon(name, spritePath, movementFrames, attackRow);
                this.pendingWeapon = null;
                this.pendingIcon = null;
            } 
        }
        this.equipPressedLastFrame = keysPressed['o']; // save state of 'o' for next frame

        //ambienceSound.play(); // play background sound
        
        // === If attacking normally (holding down 'k') ===
        if (keysPressed['k']) {
            this.attacking = true;
            this.spriteRect.y = this.attackRow[this.lastDirection];
            this.attackTimer = 10; // attack duration (frames)
            return; // skip movement while attacking
        }

    // === Timed Attack Execution Logic ===
    if (this.attackInProgress) {
        this.attackFrameCounter++; // progress the attack animation
        this.spriteRect.y = this.attackRow[this.lastDirection];

        const totalAttackFrames = 6;
        this.spriteRect.x = Math.floor(this.attackFrameCounter / 3) % totalAttackFrames;

        // fire projectile at a specific moment during the animation
        if (this.attackFrameCounter === 10) {
            if (!this.secondaryWeapon) {
                if (this.classType === 'archer' && this.arrowCooldown <= 0) {
                    this.shootArrow();
                    this.arrowCooldown = 20;
                }

                if (this.classType === 'wizard' && this.fireballCooldown <= 0) {
                    this.shootFireball();
                    this.fireballCooldown = 30;
                }
            } else {
                if (this.secondaryWeapon === 'crossbow' && this.arrowCooldown <= 0) {
                    this.shootArrow(); // reuse the archer arrow mechanic
                    this.arrowCooldown = 20; // adjust cooldown for crossbow if needed
                }
            }
        }

        // End attack after timer runs out
        this.attackTimer--;
        if (this.attackTimer <= 0) {
            this.attacking = false;
            this.attackInProgress = false;
            this.attackTimer = null;
        }

        return; // skip movement while attacking
    }

        // === Movement Input Handling ===
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

                // calculate next position
                const nextX = this.position.x + keyMap[key].dx * currentSpeed;
                const nextY = this.position.y + keyMap[key].dy * currentSpeed;
                this.lastDirection = keyMap[key].dir;        
            
                // === Collision Check ===
                let isBlocked = collisionMap && collisionMap.isBlockedPixel(nextX, nextY);

                // extra check against static objects like chests, healer, etc.
                if (!isBlocked && this.gameRef && this.gameRef.staticObjects) {
                    this.gameRef.staticObjects.forEach(obj => {
                        const nextBox = {
                            x: nextX,
                            y: nextY,
                            width: this.width,
                            height: this.height
                        };

                        const objBox = {
                            x: obj.position.x + 25,
                            y: obj.position.y + 5,
                            width: 15,
                            height: 25                        
                        };

                        const isColliding =
                            nextBox.x < objBox.x + objBox.width &&
                            nextBox.x + nextBox.width > objBox.x &&
                            nextBox.y < objBox.y + objBox.height &&
                            nextBox.y + nextBox.height > objBox.y;

                        if (isColliding) {
                            isBlocked = true;
                        }
                    });
                }

                // === Apply Movement ===
                if (!isBlocked) {
                    this.position.x = nextX;
                    this.position.y = nextY;
                }

                // update sprite row to match direction if applicable
                if (this.movementFrames && this.lastDirection in this.movementFrames) {
                    this.spriteRect.y = this.movementFrames[this.lastDirection];
                }                
                    this.lastDirection = this._getDirection(key); // save direction for attacks
                    this.moving = true;
                }
            }

        // === Dash and Cooldown Logic ===
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

        // === Cooldowns for Arrows and Fireballs ===
        if (this.arrowCooldown > 0) this.arrowCooldown--;
        if (this.fireballCooldown > 0) this.fireballCooldown--;
        

    }

    // === Determine Direction Name from Key ===
    // converts a pressed key into a direction string
    _getDirection(key) {
        switch (key) {
            case 'w': return 'up';
            case 'a': return 'left';
            case 's': return 'down';
            case 'd': return 'right';
            default: return this.lastDirection; // fallback to current direction
        }
    }

    // === Update Animation Frame ===
    // handles sprite animation and secondary weapon countdown
    updateAnimation(gameFrame, staggerFrames) {
        if (this.dying) {
            this.spriteRect.y = 20; // set death animation row
            
            const currentFrame = Math.floor((this.deathDuration - this.deathTimer) / staggerFrames);
            this.spriteRect.x = Math.min(2 + currentFrame, 4); // progress frame from 2 to 4

    
            this.deathTimer--;
            if (this.deathTimer <= 0 && !this.finishedDying) {
                this.finishedDying = true;
                setTimeout(() => {
                    GameOver(); // trigger game over screen
                }, 500);
            }
        } else {
            const totalFrames = 6; // walking/attacking frames
            this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;
        }
    
        // update projectiles like arrows/fireballs
        this.projectiles.forEach(p => p.update());      

        // countdown for secondary weapon effect
        if (this.secondaryWeapon && this.secondaryTimer > 0) {
            this.secondaryTimer--;
        
            if (this.secondaryTimer === 0) {
                // revert to original weapon
                this.secondaryWeapon = null;
                this.setSprite(this.originalSpritePath, { x: 0, y: 0, width: 64, height: 65 });
        
                this.movementFrames = this.originalMovementFrames;
                this.attackRow = this.originalAttackRow;
        
                // reset original attack damage
                if (this.classType === 'knight') this.attackMagnitude = 35;
                if (this.classType === 'archer') this.attackMagnitude = 12;
                if (this.classType === 'wizard') this.attackMagnitude = 20;
            }
        }              
        
    }

    // === Keep Player Inside Canvas Bounds ===
    clampToBounds(canvasWidth, canvasHeight) {
        const feetOffset = 12; // room at the bottom for feet
        const headOffset = 65; // full sprite height
    
        this.position.x = Math.max(0, Math.min(this.position.x, canvasWidth - this.width));
        this.position.y = Math.max(headOffset, Math.min(this.position.y, canvasHeight - feetOffset));
    }
     

    // === Reset Player to Starting Position ===
    resetPosition() {
        this.position.x = 50;
        this.position.y = 300;
    }

    // === Arrow mechanics ===
    // calculates arrow spawn position and adds it to the projectiles list
    shootArrow() {
        let arrowX = this.position.x;
        let arrowY = this.position.y;
        const direction = this.lastDirection;
        const speed = 8; // arrow speed
    
        // adjust starting position based on direction
        switch (direction) {
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
    
        const arrow = new Arrow({ x: arrowX, y: arrowY }, direction, speed, this.attackMagnitude);
        this.projectiles.push(arrow);
    }
    

   // === Fireball mechanics ===
   shootFireball() {
    let fbX = this.position.x;
    let fbY = this.position.y;
    const direction = this.lastDirection;
    const speed = 5; // fireball speed
    const image = this.fireballImage;

    // adjust starting position based on direction
    switch (direction) {
        case 'up':
            fbX += this.width / 2 - 64;
            fbY -= 20;
            break;
        case 'down':
            fbX += this.width / 2 - 64;
            fbY += this.height - 100;
            break;
        case 'left':
            fbX -= 22;
            fbY += this.height / 2 - 65;
            break;
        case 'right':
            fbX += this.width - 22;
            fbY += this.height / 2 - 65;
            break;
    }

    const fireball = new Fireball({ x: fbX, y: fbY }, direction, speed, image, this.attackMagnitude);
    this.projectiles.push(fireball);
}


    // === Get Last Movement Direction ===
    getDirection() {
            return this.lastDirection;
    }
 
    // === Draw Player and Projectiles ===
    draw(ctx) {
        this.projectiles.forEach(projectile => {
            projectile.draw(ctx); // draw arrows/fireballs
        });

        super.draw(ctx); // draw the player
    }
    
    // === Activate Secondary Weapon ===
    // changes sprite, damage, movement/attack frames, and starts timer
    activateSecondaryWeapon(weaponName, spritePath, movementFrames, attackRow) {
        this.secondaryWeapon = weaponName;
        this.secondaryTimer = 3600; // time active (in frames)
        this.secondarySpritePath = spritePath;
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });
    
        this.movementFrames = movementFrames;
        this.attackRow = attackRow;
    
        // set power for each secondary weapon
        if (weaponName === 'dagger') this.attackMagnitude = 40;
        else if (weaponName === 'spear') this.attackMagnitude = 50;
        else if (weaponName === 'crossbow') this.attackMagnitude = 30;
        else if (weaponName === 'waraxe') this.attackMagnitude = 60;
    }
    
    // === Start Death Animation ===
    startDeath() {
        this.dying = true;
        this.deathTimer = this.deathDuration;
        this.finishedDying = false;
        this.spriteRect.y = 20; // set death animation row
        this.spriteRect.x = 2; // start from frame 2
    }
    

}
