// === Game Class Definition ===
// handles the entire game: player, enemies, maps, UI, collisions, combat, etc.
class Game {
    constructor(ctx, canvasWidth, canvasHeight, assets) {
        // === Setup Core Properties ===
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.assets = assets;
        this.usedMaps = new Set(); // keeps track of which maps have already been used
        this.enemies = [];
        this.enemyFrame = 0; // controls enemy animation frames

        this.gameFrame = 0;
        this.staggerFrames = 5; // controls frame update speed

        this.flashScreen = false; // used for red screen flash when damaged

        // === Instantiate Managers and Player ===
        this.mapManager = new MapManager(assets.maps, assets.backgroundImage);
        this.inputManager = new InputManager(assets.keyMap);

        this.player = new Player(
            { x: 48, y: 256 },
            assets.playerImagePath,
            assets.playerFrames,
            assets.playerAttackRow
        );
        this.player.gameRef = this; // so player can access game instance

        // === Create Initial Enemy and Portal ===
        this.enemy = new Enemy(
            { x: canvasWidth / 2 + 100, y: canvasHeight / 2 },
            1.25,
            assets.enemyImagePath
        );

        this.portal = new Portal(
            { x: canvasWidth - 30, y: 0 },
            30,
            canvasHeight,
            'rgba(0, 0, 0, 0)'
        );

        // === Collision Map and Level Progress ===
        this.collisionMap = assets.collisionMap;
        this.progress = {
            visited: 0,
            level: 1,
            rooms: 4,
            maxLevels: 3
        };

        // === Calculate How Much Life the Enemy Removes ===
        this.lifeReduction = this.enemy.attackMagnitude * lifeBarwidth / this.player.maxHealth;

        this.setupStart(); // start the game
    }

    // === Setup First Map and Start Loop ===
    setupStart() {
        this.usedMaps.clear();
        this.mapManager.selectRandomMap(null, this.usedMaps);
        this.loop();
    }

    // === Display Level Notification on Screen ===
    onNewLevel() {
        const notification = document.createElement('div');
        notification.className = 'level-notification';
        notification.innerText = `Nivel ${this.progress.level}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // === Update Collision Map Based on Current Map ===
    updateCollisionMap() {
        const newMapKey = this.mapManager.currentMapKey;
        const newCollisionArray = collisionMapIndex[newMapKey];

        if (newCollisionArray) {
            this.collisionMap = new CollisionMap(newCollisionArray, 57, 16);
        } else {
            this.collisionMap = new CollisionMap(new Array(57 * 38).fill(0), 57, 16);
        }
    }

    // === Spawn Goblins in Random Positions ===
    spawnEnemiesForRoom() {
        this.enemies = [];
        const margin = 48;

        for (let i = 0; i < 3; i++) {
            const spawnX = Math.floor(Math.random() * (this.canvasWidth - 2 * margin)) + margin;
            const spawnY = Math.floor(Math.random() * (this.canvasHeight - 2 * margin)) + margin;

            const goblin = new Enemy(
                { x: spawnX, y: spawnY },
                1.25,
                this.assets.enemyImagePath
            );

            this.enemies.push(goblin);
        }

        this.portal.active = false;
    }

    // === Main Game Loop ===
    // draws everything, checks inputs, handles combat, death, etc.
    loop() {
        if (paused) return;
        if (gameOver) return;

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.drawImage(this.assets.backgroundImage, 0, 0);
        this.portal.draw(this.ctx);

        // === Handle Player Movement and Input ===
        this.player.handleInput(
            this.inputManager.keysPressed,
            this.assets.keyMap,
            this.collisionMap
        );

        // === Handle Each Enemy ===
        this.enemies.forEach((enemy, i) => {
            enemy.moveToward(this.player);
            enemy.updateAnimation(this.player, this.enemyFrame, this.staggerFrames);

            const dx = enemy.position.x - this.player.position.x;
            const dy = enemy.position.y - this.player.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 32) {
                // === Enemy Attacks Player ===
                if (!enemy.hasHitPlayer) {
                    enemy.attacking = true;
                    enemy.hasHitPlayer = true;

                    setTimeout(() => {
                        const dx2 = enemy.position.x - this.player.position.x;
                        const dy2 = enemy.position.y - this.player.position.y;
                        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (distance2 < 32) {
                            this.player.health -= enemy.attackMagnitude;

                            life.width -= this.lifeReduction;
                            if (life.width <= 0) life.width = 0;
                            if (this.player.health <= 0) GameOver();

                            this.flashScreen = true;
                            setTimeout(() => { this.flashScreen = false; }, 150);
                        }

                        enemy.attacking = false;
                    }, 300);

                    // cooldown before the same enemy can hit again
                    setTimeout(() => {
                        enemy.hasHitPlayer = false;
                    }, 1500);
                }

                // === Prevent Player-Enemy Overlap ===
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
                    enemy.health--;
                    this.player.hasHitEnemy = true;
                    setTimeout(() => { this.player.hasHitEnemy = false; }, 400);
                }
            }

            // === Enemy Dies ===
            if (enemy.health <= 0) {
                this.enemies.splice(i, 1);
            }

            // === Activate Portal When All Enemies Are Gone ===
            if (this.enemies.length === 0 && !this.portal.active) {
                this.portal.active = true;
            }

            enemy.draw(this.ctx);
        });

        // === Player Logic ===
        this.player.clampToBounds(this.canvasWidth, this.canvasHeight);
        this.player.updateAnimation(this.gameFrame, this.staggerFrames);
        this.player.draw(this.ctx);

        // === Portal Teleportation and Level Transition ===
        this.portal.checkCollision(
            this.player,
            this.assets.maps,
            this.progress,
            this.assets.backgroundImage,
            () => {
                this.mapManager.selectRandomMap(this.mapManager.currentMapKey, this.usedMaps);
                this.updateCollisionMap();
                this.spawnEnemiesForRoom();
            },
            () => this.onNewLevel()
        );

        if (this.player.moving || this.player.attacking) {
            this.gameFrame++;
        }

        // === Draw UI Bars ===
        bar.draw(this.ctx);
        curse.draw(this.ctx);
        this.ctx.drawImage(curseLogo, 725, 55, 20, 20);

        lifeBar.draw(this.ctx);
        life.draw(this.ctx);
        this.ctx.drawImage(lifeLogo, 723, 25, 25, 25);

        // === Handle Death by Health ===
        if (this.player.health <= 0) {
            GameOver();
        }

        // === Update Curse (Countdown Timer Mechanic) ===
        curse.update();
        curse.colorTransition();

        if (curse.width === 0) {
            GameOver();
        }

        // === Final Frame and Loop Call ===
        if (!paused && !gameOver) {
            if (this.flashScreen) {
                this.ctx.save();
                this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
                this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.ctx.restore();
            }

            window.animationFrame = requestAnimationFrame(() => this.loop());
            this.enemyFrame++;
        }
    }
}
