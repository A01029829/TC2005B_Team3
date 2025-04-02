class Game {
    constructor(ctx, canvasWidth, canvasHeight, assets) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.assets = assets;
        this.usedMaps = new Set();
        this.enemies = [];
        this.enemyFrame = 0;

        this.gameFrame = 0;
        this.staggerFrames = 5;

        this.mapManager = new MapManager(assets.maps, assets.backgroundImage);
        this.inputManager = new InputManager(assets.keyMap);

        this.player = new Player(
            { x:48, y: 256 },
            assets.playerImagePath,
            assets.playerFrames,
            assets.playerAttackRow
        );

        this.player.gameRef = this;

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

        this.collisionMap = assets.collisionMap;

        this.progress = {
            visited: 0,
            level: 1,
            rooms: 4,
            maxLevels: 3
        };

        // Reduce life bar width
        this.lifeReduction = this.enemy.attackMagnitude * lifeBarwidth / this.player.maxHealth;

        this.setupStart();
    }

    setupStart() {
        this.usedMaps.clear();
        this.mapManager.selectRandomMap(null, this.usedMaps);
        this.loop();

    }

    onNewLevel() {
        const notification = document.createElement('div');
        notification.className = 'level-notification';
        notification.innerText = `Nivel ${this.progress.level}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    updateCollisionMap() {
        const newMapKey = this.mapManager.currentMapKey;
        const newCollisionArray = collisionMapIndex[newMapKey];

        if (newCollisionArray) {
            this.collisionMap = new CollisionMap(newCollisionArray, 57, 16);
        } else {
            this.collisionMap = new CollisionMap(new Array(57 * 38).fill(0), 57, 16);
        }
    }

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
    }
    
    

    loop() {
        if (paused) {
            return
        }
        if (gameOver) {
            return
        }

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.drawImage(this.assets.backgroundImage, 0, 0);
        this.portal.draw(this.ctx);
    
        this.player.handleInput(
            this.inputManager.keysPressed,
            this.assets.keyMap,
            this.collisionMap
        );
    
        this.enemies.forEach((enemy, i) => {
            enemy.moveToward(this.player);
            enemy.updateAnimation(this.player, this.enemyFrame, this.staggerFrames);
    
            const dx = enemy.position.x - this.player.position.x;
            const dy = enemy.position.y - this.player.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < 32) {
                // Goblin attacks
                if (!enemy.hasHitPlayer) {
                    enemy.attacking = true;
                    this.player.health -= enemy.attackMagnitude;
                    enemy.hasHitPlayer = true;
                    // Reduce life bar width
                    life.width -= this.lifeReduction;
                    if (life.width <= 0) {
                        life.width = 0;
                    }
                    if (this.player.health <= 0) {
                        GameOver();
                    }

                    setTimeout(() => {
                        enemy.hasHitPlayer = false;
                        enemy.attacking = false;
                    }, 1000);
                }

                // Prevent overlap
                const overlap = 32 - distance;
                if (overlap > 0) {
                    const pushX = (dx / distance) * (overlap / 2);
                    const pushY = (dy / distance) * (overlap / 2);
    
                    this.player.position.x -= pushX;
                    this.player.position.y -= pushY;
    
                    enemy.position.x += pushX;
                    enemy.position.y += pushY;
                }
    
                // Knight attacks
                if (this.player.attacking && !this.player.hasHitEnemy) {
                    enemy.health--;
                    console.log("Goblin hit! Health:", enemy.health);
                    this.player.hasHitEnemy = true;
                    setTimeout(() => { this.player.hasHitEnemy = false; }, 400);
                }
            }
    
            // Goblin dies
            if (enemy.health <= 0) {
                this.enemies.splice(i, 1);
            }
    
            enemy.draw(this.ctx);
        });
    
        this.player.clampToBounds(this.canvasWidth, this.canvasHeight);
        this.player.updateAnimation(this.gameFrame, this.staggerFrames);
        this.player.draw(this.ctx);
    
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

        // Draw the curse bar
        bar.draw(this.ctx);
        curse.draw(this.ctx);
        this.ctx.drawImage(curseLogo, 725, 55, 20, 20);
        // Draw the life bar
        lifeBar.draw(this.ctx);
        life.draw(this.ctx);
        this.ctx.drawImage(lifeLogo, 723, 25, 25, 25);
    
        if (this.player.health <= 0) {
            GameOver();
        }

        curse.update();
        curse.colorTransition();

        if (curse.width === 0) {
            GameOver();
        }

        if (!paused && !gameOver) {
            window.animationFrame = requestAnimationFrame(() => this.loop());
            this.enemyFrame++;
        }

    }
    }
