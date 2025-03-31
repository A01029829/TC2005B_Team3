class Game {
    constructor(ctx, canvasWidth, canvasHeight, assets) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.assets = assets;

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

        this.setupStart();
    }

    setupStart() {
        this.mapManager.selectRandomMap();
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

    loop() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.drawImage(this.assets.backgroundImage, 0, 0);
        this.portal.draw(this.ctx);

        this.player.handleInput(
            this.inputManager.keysPressed,
            this.assets.keyMap,
            this.collisionMap
        );

        this.enemy.moveToward(this.player);
        this.enemy.updateAnimation(this.player, this.gameFrame, this.staggerFrames);
        this.enemy.draw(this.ctx);

        this.player.clampToBounds(this.canvasWidth, this.canvasHeight);
        this.player.updateAnimation(this.gameFrame, this.staggerFrames);
        this.player.draw(this.ctx);

        this.portal.checkCollision(
            this.player,
            this.assets.maps,
            this.progress,
            this.assets.backgroundImage,
            (newMap) => this.mapManager.changeMap(newMap),
            () => this.onNewLevel()
        );

        if (this.player.moving || this.player.attacking) {
            this.gameFrame++;
        }

        window.animationFrame = requestAnimationFrame(() => this.loop());

    }
    
}
