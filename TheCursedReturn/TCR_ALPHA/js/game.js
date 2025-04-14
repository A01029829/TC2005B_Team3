// === Game Class Definition ===
// handles the entire game: player, enemies, maps, UI, collisions, combat, etc.

class Game {
    constructor(ctx, canvasWidth, canvasHeight, assets) {
        // === Setup Core Properties ===
        this.ctx = ctx; // canvas drawing context
        this.canvasWidth = canvasWidth; // width of the game screen
        this.canvasHeight = canvasHeight; // height of the game screen
        this.assets = assets; // preloaded assets like images and map data

        this.usedMaps = new Set(); // keeps track of which maps have already been used (to avoid repetition)
        this.enemies = []; // stores all enemies currently in the room
        this.enemyFrame = 0; // controls enemy animation frame timing

        this.gameFrame = 0; // controls player animation frame timing
        this.staggerFrames = 5; // slows down how often frames change (1 = fast, 10 = slow)

        this.flashScreen = false; // used to flash the screen red when the player takes damage

        this.healer = null; // healer state
        this.healerSpawned = false; // healer condition to appear

        this.gunsmith = null;
        this.gunsmithSpawned = false;

        this.npcFrame = 0; // NPC animations

        this.chest = null;

        this.staticObjects = [];

        // === Instantiate Managers and Player ===
        this.mapManager = new MapManager(assets.maps, assets.backgroundImage); // controls map switching
        this.inputManager = new InputManager(assets.keyMap); // tracks key inputs

        // create the player with initial position and assigned sprites/animations
        this.player = new Player(
            { x: 48, y: 256 },
            assets.playerImagePath,
            assets.playerFrames,
            assets.playerAttackRow
        );
        this.player.gameRef = this; // allow player to reference the full game instance
        this.player.classType = selectedClass;

        // === Create Initial Enemy and Portal ===
        this.enemy = new Enemy(
            { x: canvasWidth / 2 + 100, y: canvasHeight / 2 },
            1.25,
            assets.enemyImagePath
        );

        this.portal = new Portal(
            { x: canvasWidth - 30, y: 0 }, // top-right corner
            30, // width
            canvasHeight, // full screen height
            'rgba(0, 0, 0, 0)' // invisible portal (can still collide)
        );

        // === Collision Map and Level Progress Tracking ===
        this.collisionMap = assets.collisionMap;
        this.progress = {
            visited: 0,   // rooms cleared
            level: 1,     // current level
            rooms: 4,     // rooms per level
            maxLevels: 3  // max number of levels before victory
        };

        this.setupStart(); // begin the game
    }

    getValidSpawnPosition(collisionMap, canvasWidth, canvasHeight, margin = 48) {
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvasWidth - 2 * margin)) + margin;
            y = Math.floor(Math.random() * (canvasHeight - 2 * margin)) + margin;
        } while (collisionMap.isBlockedPixel(x, y)); // Retry until it's valid
        return { x, y };
    }  

    // === Setup First Map and Start Loop ===
    setupStart() {
        this.usedMaps.clear(); // reset used map list
        this.mapManager.selectRandomMap(null, this.usedMaps); // pick a starting map

        showControls = true; // show control image
        this.loop(); // start the game loop
    }

    // === Display Level Notification on Screen ===
    onNewLevel() {
        this.healer = null;
        this.roomForHealer = null;
        this.healerSpawned = false;
        this.gunsmith = null;
        this.gunsmithSpawned = false;
        const notification = document.createElement('div');
        notification.className = 'level-notification';

        // shows something like: "Nivel 2" on screen
        // this is a template string — it inserts the level number directly in the text
        notification.innerText = `Nivel ${this.progress.level}`;

        document.body.appendChild(notification);

        // setTimeout runs code after a delay (in ms)
        // () => {} is an arrow function, a shorter way to write a function
        setTimeout(() => {
            notification.remove(); // remove the notification after 2 seconds
        }, 2000);

        this.healer = null;
    }

    // === Update Collision Map Based on Current Map ===
    updateCollisionMap() {
        const newMapKey = this.mapManager.currentMapKey;
        const newCollisionArray = collisionMapIndex[newMapKey];

        if (newCollisionArray) {
            this.collisionMap = new CollisionMap(newCollisionArray, 57, 16);
        } else {
            // new Array(57 * 38).fill(0): creates an array of 2166 zeros (empty collision map)
            this.collisionMap = new CollisionMap(new Array(57 * 38).fill(0), 57, 16);
        }
    }

    // === Spawn Goblins in Random Positions ===
    spawnEnemiesForRoom() {
        this.enemies = [];
        const margin = 48; // Distance from screen edges

        // spawn 3 goblins in random positions
        for (let i = 0; i < 3; i++) {
            // Math.random() gives a number from 0 to 1
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            const goblin = new Enemy(
                { x: spawnX, y: spawnY },
                1.25,
                this.assets.enemyImagePath
            );

            goblin.healthBar = new Bar(
                new Vect(goblin.position.x, goblin.position.y - 10), // above the enemy
                30, // width of health bar
                5,  // height of health bar
                "red"
            );            

            goblin.attackMagnitude = 1;
            goblin.attackRange = 36;

            // push = "add this goblin to the array of enemies"
            this.enemies.push(goblin);
        }

        // === Spawn Wolf Boss if this is the 4th room ===
        if (this.progress.visited === 3) {
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
        
            const wolf = new Enemy(
                { x: spawnX, y: spawnY },
                1.1,
                this.assets.wolfImagePath
            );
        
            wolf.healthBar = new Bar(
                new Vect(wolf.position.x, wolf.position.y - 10),
                50,
                7,
                "red"
            );
        
            wolf.attackRow = { up: 53, left: 54, down: 55, right: 56 };
            wolf.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            wolf.spriteRect.width = 64;
            wolf.spriteRect.height = 65;
            wolf.width = 98;
            wolf.height = 98;
            wolf.health = 60;
            wolf.maxHealth = 60;
            wolf.attackMagnitude = 5;
            wolf.attackRange = 40;
        
            this.enemies.push(wolf);
        }        

        const healerSpawn = !this.healerSpawned && Math.random() < 0.25;
        if (healerSpawn) {
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            this.healer = new Healer({ x: spawnX, y: spawnY }, this.assets.healerImagePath);
            this.healerSpawned = true;
        } else {
            this.healer = null;
        }

        // === Spawn Gunsmith (one per level) ===
        const gunsmithSpawn = !this.gunsmithSpawned && Math.random() < 0.25;

        if (gunsmithSpawn) {
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            this.gunsmith = new Gunsmith({ x: spawnX, y: spawnY }, this.assets.gunsmithImagePath);

            this.gunsmithSpawned = true;
        } else {
            this.gunsmith = null;
        }        

        // === Spawn Chest ===
        const chestSpawn = Math.random() < 0.15; // 15% chance
        if (chestSpawn) {
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            this.chest = new Chest(
                { x: spawnX, y: spawnY },
                this.assets.chestImagePath
            );

        } else {
            this.chest = null;
        }

        // === NPC and Chest Collisions ===
        this.staticObjects = [];
        if (this.healer) this.staticObjects.push(this.healer);
        if (this.gunsmith) this.staticObjects.push(this.gunsmith);
        if (this.chest) this.staticObjects.push(this.chest);

        this.portal.active = false; // deactivate portal until enemies are cleared
    }

    

    
// === Main Game Loop ===
// draws everything, checks inputs, handles combat, death, etc.
loop() {
    if (paused) return;
    if (gameOver) return;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear the screen
    this.ctx.drawImage(this.assets.backgroundImage, 0, 0); // draw current map
    this.portal.draw(this.ctx); // draw portal (even if inactive)

    // === Draw Controls Image ===
    if (showControls) {
        this.ctx.drawImage(controls, 10, 1, 425, 325); // draw control instructions
    }

    // === Handle Player Movement and Input ===
    this.player.handleInput(
        this.inputManager.keysPressed,
        this.assets.keyMap,
        this.collisionMap
    );

// === Healer Logic === 
// === Healer Update & Interaction ===
    if (this.healer) {
        const playerInRange = this.healer.checkPlayerInRange(this.player);
        const interacted = this.healer.interact(this.player, this.inputManager.keysPressed);

        // If healing started, update life bar immediately
        if (interacted) {
            life.width = (this.player.health / this.player.maxHealth) * lifeBarwidth;
            if (life.width > lifeBarwidth) life.width = lifeBarwidth;
        }

        this.healer.update();
        this.healer.updateAnimation(this.npcFrame, this.staggerFrames);
        this.healer.draw(this.ctx);
        this.healer.drawInteractionPrompt(this.ctx, playerInRange);
    }

    // === Gunsmith Logic ===
    if (this.gunsmith) {
        this.gunsmith.updateAnimation(this.gameFrame, this.staggerFrames);
        const playerInRange = this.gunsmith.checkPlayerInRange(this.player);
        const interacted = this.gunsmith.interact(this.player, this.inputManager.keysPressed);

        if (interacted) {
            console.log("Gunsmith Interaction Success!");
        }

        this.gunsmith.updateAnimation(this.npcFrame, this.staggerFrames);
        this.gunsmith.draw(this.ctx);
        this.gunsmith.drawInteractionPrompt(this.ctx, playerInRange);
    }

    // === Chest Logic ===
    if (this.chest) {
        this.chest.updateAnimation(this.npcFrame, this.staggerFrames);
        this.chest.draw(this.ctx);
    
        const playerInRange = this.chest.checkPlayerInRange(this.player);
        const interacted = this.chest.interact(this.player, this.inputManager.keysPressed);
    
        this.chest.drawInteractionPrompt(this.ctx, playerInRange);
    }
    
    // === Player Logic ===
    this.player.updateAnimation(this.gameFrame, this.staggerFrames);

    // Update and draw arrows
    this.player.arrows.forEach(arrow => {
        arrow.update();
        arrow.draw(this.ctx);
    });

    this.enemies.forEach((enemy, enemyIndex) => {
        this.player.projectiles.forEach((projectile, projectileIndex) => {
            // Check collision box
            const projBox = {
                x: projectile.position.x,
                y: projectile.position.y,
                width: projectile.width,
                height: projectile.height
            };
    
            const enemyBox = {
                x: enemy.position.x,
                y: enemy.position.y,
                width: enemy.width,
                height: enemy.height
            };
    
            const isColliding =
            projBox.x < enemyBox.x + enemyBox.width &&
            projBox.x + projBox.width > enemyBox.x &&
            projBox.y < enemyBox.y + enemyBox.height &&
            projBox.y + projBox.height > enemyBox.y;
    
            if (isColliding) {
                // Damage based on projectile type
                if (projectile instanceof Arrow) {
                    enemy.health -= 10;
                } 
                if (projectile instanceof Fireball) {
                    enemy.health -= 15;
                }
    
                // Remove the projectile on hit
                this.player.projectiles.splice(projectileIndex, 1);
            }
        });
    });
    

    // Remove expired arrows
    this.player.projectiles = this.player.projectiles.filter(a => !a.isExpired());

    // Draw player (including projectiles)
    this.player.draw(this.ctx);

    // If the player is dying and already finished their death animation:
    if (this.player.dying && this.player.finishedDying) {
        return; // Stop the rest of the loop to prevent drawing the map/enemies/portal
    }

    // === Handle Each Enemy ===
    this.enemies.forEach((enemy, i) => {
        enemy.moveToward(this.player);
        enemy.updateAnimation(this.player, this.enemyFrame, this.staggerFrames);

        // hitboxes for collision detection
        const playerBox = {
            x: this.player.position.x,
            y: this.player.position.y,
            width: this.player.width,
            height: this.player.height
        };
        const enemyBox = {
            x: enemy.position.x,
            y: enemy.position.y,
            width: enemy.width,
            height: enemy.height
        };

        // axis Alligned Bounding Box - collision detection to know if boxes are overlapping
        // retrieved from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        const isOverlapping =
            playerBox.x < enemyBox.x + enemyBox.width &&
            playerBox.x + playerBox.width > enemyBox.x &&
            playerBox.y < enemyBox.y + enemyBox.height &&
            playerBox.y + playerBox.height > enemyBox.y;

        const dx = enemy.position.x - this.player.position.x;
        const dy = enemy.position.y - this.player.position.y;

        // Math.sqrt(dx*dx + dy*dy): calculates distance between player and enemy
        const distance = Math.sqrt(dx * dx + dy * dy);

        // check if within attack range (if enemy.attackRange not set, default to 28)
        const inAttackRange = distance < (enemy.attackRange || 28);

        if (isOverlapping) {
            // === Enemy Attacks Player ===
            if (!enemy.hasHitPlayer) {
                enemy.attacking = true;
                enemy.hasHitPlayer = true;

                // setTimeout(() => { ... }, 300): after 300ms, apply damage if still overlapping
                setTimeout(() => {
                    const stillOverlapping =
                        playerBox.x < enemyBox.x + enemyBox.width &&
                        playerBox.x + playerBox.width > enemyBox.x &&
                        playerBox.y < enemyBox.y + enemyBox.height &&
                        playerBox.y + playerBox.height > enemyBox.y;

                    if (stillOverlapping) {
                        // Math.hypot gives distance between two points (same as sqrt(dx^2 + dy^2))
                        const distanceNow = Math.hypot(
                            enemy.position.x - this.player.position.x,
                            enemy.position.y - this.player.position.y
                        );

                        const range = enemy.attackRange || 28;
                        if (distanceNow < range) {
                            this.player.health -= enemy.attackMagnitude;

                            // update life bar width visually
                            life.width = (this.player.health / this.player.maxHealth) * lifeBarwidth;
                            if (life.width <= 0) life.width = 0;

                            if (this.player.health <= 0 && !this.player.dying) {
                                this.player.dying = true;
                                this.player.deathTimer = 60; // About 1 second of animation
                            }
                            

                            this.flashScreen = true; // flash red
                            setTimeout(() => { this.flashScreen = false; }, 150); // reset flash
                        }
                    }

                    enemy.attacking = false;
                }, 300);

                // cooldown so enemy can't hit again instantly
                setTimeout(() => {
                    enemy.hasHitPlayer = false;
                }, 1500);
            }

            // === Prevent Overlap (push both away) ===
            const dx = enemy.position.x - this.player.position.x;
            const dy = enemy.position.y - this.player.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const overlap = 32 - distance;

            if (overlap > 0) {
                const pushX = (dx / distance) * (overlap / 2);
                const pushY = (dy / distance) * (overlap / 2);

                this.player.position.x -= pushX;
                this.player.position.y -= pushY;
                enemy.position.x += pushX;
                enemy.position.y += pushY;
            }

            // === Player Attacks Enemy ===
            if (this.player.attacking && !this.player.hasHitEnemy) {
                enemy.health -= this.player.attackMagnitude;
                this.player.hasHitEnemy = true;

                setTimeout(() => {
                    this.player.hasHitEnemy = false;
                }, 400); // attack cooldown
            }
        }

        // === Enemy Dies ===
        if (enemy.health <= 0) {
            // .splice(i, 1): remove the enemy from the array
            this.enemies.splice(i, 1);
        }

        // === Activate Portal When All Enemies Are Gone ===
        if (this.enemies.length === 0 && !this.portal.active) {
            this.portal.active = true;
        }

        enemy.draw(this.ctx); // Draw the enemy

        if (enemy.healthBar) {
            // Update bar position to follow enemy
            enemy.healthBar.position.x = enemy.position.x + (enemy.width / 2) - (enemy.healthBar.width / 2) - 23;
            enemy.healthBar.position.y = enemy.position.y - 50;
        
            // Update bar width based on health
            enemy.healthBar.width = (enemy.health / enemy.maxHealth) * 30;  // or 50 for wolf
        
            if (enemy.healthBar.width < 0) enemy.healthBar.width = 0;
        
            enemy.healthBar.draw(this.ctx);
        }
        
    });

    // === Portal Teleportation and Level Transition ===
    this.portal.checkCollision(
        this.player,
        this.assets.maps,
        this.progress,
        this.assets.backgroundImage,
        () => {
            
            // Arrow function: update map and enemies when portal is triggered
            this.mapManager.selectRandomMap(this.mapManager.currentMapKey, this.usedMaps);
            this.updateCollisionMap();
            this.spawnEnemiesForRoom();

        },
        () => this.onNewLevel()
    );

    this.npcFrame++; // increase NPC animation frame

    if (this.player.moving || this.player.attacking) {
        this.gameFrame++; // Only animate if doing something
    }

    
    // === Draw UI Bars ===
    bar.draw(this.ctx);
    curse.draw(this.ctx);
    this.ctx.drawImage(curseLogo, 725, 55, 20, 20);

    lifeBar.draw(this.ctx);
    life.draw(this.ctx);
    this.ctx.drawImage(lifeLogo, 723, 25, 25, 25);

    // === Update Curse (Countdown Timer Mechanic) ===
    curse.update(); // shrinks over time
    curse.colorTransition(); // changes color as it gets lower

    if (curse.width <= 0 && !this.player.dying) {
        this.player.dying = true;
        this.player.deathTimer = 60; // Duration of death animation
    }
    
    // === Final Frame and Loop Call ===
    if (!paused && !gameOver) {
        if (this.flashScreen) {

            // red flash when damaged
            this.ctx.save();
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.restore();
        }

        // requestAnimationFrame(() => this.loop()): keeps the game running
        window.animationFrame = requestAnimationFrame(() => this.loop());
        this.enemyFrame++; // progress enemy animations
    }
}
}
