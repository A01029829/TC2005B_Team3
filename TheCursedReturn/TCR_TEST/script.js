const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGHT = (canvas.height = 600);

const maps={
    woods: 'WoodsLVL1.png',
    woods2: 'WoodsLVL2.png',
    woods3: 'WoodsLVL3.png',
    woods4: 'WoodsLVL4.png',
    dessert: 'DesertLVL1.png',
    dessert2: 'DesertLVL2.png',
    dessert3: 'DesertLVL3.png',
    dessert4: 'DesertLVL4.png',
    snow: 'WoodsLVL1.png',
    snow2: 'WoodsLVL2.png',
    snow3: 'WoodsLVL3.png',
    snow4: 'WoodsLVL4.png',
};

const progress={
    visited: 0,
    level: 1,
    rooms: 4,
    maxLevels: 3
}

// Retrieve selected class from localStorage (default to knight)
let selectedClass = localStorage.getItem("selectedClass") || "knight";

// Define class properties
const classes = {
    knight: {
        sprite: 'KnightSpriteSheetFINAL.png',
        movementFrames: { right: 11, left: 9, up: 8, down: 10 },
        attackRow: 53
    },
    archer: {
        sprite: 'ArcherSpriteSheetFINAL.png',
        movementFrames: { right: 11, left: 9, up: 8, down: 10 },
        attackRow: 16
    },
    wizard: {
        sprite: 'WizardSpriteSheetFINAL.png',
        movementFrames: { right: 11, left: 9, up: 8, down: 10 },
        attackRow: 4
    }
};

let imagesLoaded = {
    background: false,
    player: false
};

const portal = {
    x: CANVAS_WIDTH - 30,
    y: 0,
    width: 30,
    height: CANVAS_HEIGHT,
    color: 'rgba(0, 0, 0, 0)',
    active: true,
};

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'WoodsLVL4.png';

// Load player sprite based on selected class
const playerImage = new Image();
playerImage.src = classes[selectedClass].sprite;

// Load enemy sprite
const enemyImage = new Image();
enemyImage.src = 'Goblin01SpriteSheetFINAL.png';

// Scaling factors
const spriteWidth = 64;
const spriteHeight = 65;
const scaledSpriteWidth = spriteWidth;
const scaledSpriteHeight = spriteHeight;

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 5;

let player = {
    x: 50,
    y: 50,
    speed: 3,
    moving: false,
    attacking: false,
    attackDirection: null,
    attackFrame: 0
};

// Key mapping for movement and attacks
const keyMap = {
    w: { frameY: classes[selectedClass].movementFrames.up, dx: 0, dy: -1 },
    a: { frameY: classes[selectedClass].movementFrames.left, dx: -1, dy: 0 },
    s: { frameY: classes[selectedClass].movementFrames.down, dx: 0, dy: 1 },
    d: { frameY: classes[selectedClass].movementFrames.right, dx: 1, dy: 0 },
    'k': { attacking: true }
};

let keysPressed = {};

//Asigna una nueva ruta de imagen al objeto backgroundImage (fondo)
function changeMap(mapImagePath){
    if(window.animationFrame){
        cancelAnimationFrame(window.animationFrame);
    }
    imagesLoaded.background=false;
    console.log("Cambiando mapa a:", mapImagePath);
    //Se usa esta nueva imagen en el evento onload
    backgroundImage.src = mapImagePath;
}

function selectRandomMap(){
    const mapKeys= Object.keys(maps);
    const randomKeyMap= mapKeys[Math.floor(Math.random()*mapKeys.length)];
    console.log("Mapa seleccionado aleatoriamente:", randomKeyMap);
    changeMap(maps[randomKeyMap]);
    return randomKeyMap;
}

function loadNewMap(){
    const selectedMap=selectRandomMap();
    console.log("Nuevo mapa cargado:", selectedMap);
    return selectedMap;
}

// Vec class
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}

// Define the enemy extending from Vec
class Enemy extends Vec {
    constructor(x, y, speed) {
        super(x, y);  // Call the Vec constructor
        this.speed = speed;
        this.moving = false;
    }

    moveToward(player) {
        let direction = new Vec(player.x - this.x, player.y - this.y);
        if (direction.magnitude() < 300) {  // within a certain distance start to chase the player
            let movement = direction.times(this.speed / direction.magnitude());
            this.x += movement.x;
            this.y += movement.y;
            this.moving = true;
        } else {
            this.moving = false;
        }
    }
}

let enemy = new Enemy(CANVAS_WIDTH/2 + 100, CANVAS_HEIGHT/2, 1.25);

//Funcion que en principio no se usa, pero se podria usar si se requiere en el futuro
// function showVictoryScreen(){
//     const victory="../images/TheCursedReturnVictory.png";
//     const victoryImage = new Image();
//     victoryImage.src = victory;
//     victoryImage.onload = function() {
//         ctx.drawImage(victoryImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     };
// }

function showLevelNotification(){
    const notification = document.createElement('div');
    notification.className = 'level-notification';
    notification.innerText = `Nivel ${progress.level}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function newLevel(){
    progress.level+=1;
    progress.visited=0;
    console.log("Nuevo nivel:", progress.level);
    showLevelNotification();
    if(progress.level>progress.maxLevels){
        console.log("Victoria!");
        window.location.href = "victory.html";
        // showVictoryScreen();
        return;
    }
}

//Funcionamiento de la colision del portal
function checkPortalCollision() {
    if (portal.active &&
        player.x < portal.x + portal.width &&
        player.x + scaledSpriteWidth > portal.x &&
        player.y < portal.y + portal.height &&
        player.y + scaledSpriteHeight > portal.y) {
        
        portal.active = false;
        progress.visited+=1;

        console.log("Portal activado, visitado:", progress.visited);

        if(progress.visited==progress.rooms){
            newLevel();
        }
        
        let currentMap = null;
        for (const [mapName, mapPath] of Object.entries(maps)) {
            if (mapPath === backgroundImage.src || backgroundImage.src.endsWith(mapPath)) {
                currentMap = mapName;
                break;
            }
        }
        
        const mapKeys = Object.keys(maps).filter(key => key !== currentMap);
        const randomMapKey = mapKeys[Math.floor(Math.random() * mapKeys.length)];
        
        changeMap(maps[randomMapKey]);
        
        // Reposition player and enemy
        player.x = 50;
        
        setTimeout(() => {
            portal.active = true;
        }, 1000);
        return true;
    }
    return false;
}

// Event listeners for movement and attack
window.addEventListener("keydown", (event) => {
    if (keyMap[event.key]) {
        keysPressed[event.key] = true;

        if (event.key === 'k') {
            player.attacking = true;
        } else {
            frameY = keyMap[event.key].frameY;
            player.attackDirection = null;
            player.moving = true;
        }
    }

    if ((keysPressed['ArrowUp'] || keysPressed['w']) && keysPressed['k']) {
        player.attackDirection = 0;
    } else if ((keysPressed['ArrowLeft'] || keysPressed['a']) && keysPressed['k']) {
        player.attackDirection = 1;
    } else if ((keysPressed['ArrowDown'] || keysPressed['s']) && keysPressed['k']) {
        player.attackDirection = 2;
    } else if ((keysPressed['ArrowRight'] || keysPressed['d']) && keysPressed['k']) {
        player.attackDirection = 3;
    }
});

window.addEventListener("keyup", (event) => {
    if (keyMap[event.key]) {
        delete keysPressed[event.key];
        if (event.key === 'k') {
            player.attacking = false;
        }
        if (Object.keys(keysPressed).length === 0) {
            player.moving = false;
        }
    }
});

// Main game loop
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw scaled background
    ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw portal
    if (portal.active) {
        ctx.fillStyle = portal.color;
        ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
    }

    // Player movement logic
    for (let key in keysPressed) {
        if (keyMap[key] && key !== 'k') {
            player.x += keyMap[key].dx * player.speed;
            player.y += keyMap[key].dy * player.speed;
        }
    }

    // Collision with canvas borders
    player.x = Math.max(0, Math.min(CANVAS_WIDTH - scaledSpriteWidth, player.x));
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - scaledSpriteHeight, player.y));

    // Check portal collision
    checkPortalCollision();

    // Update enemy movement
    enemy.moveToward(player);

    if (Math.abs(enemy.x - player.x) > Math.abs(enemy.y - player.y)) {
        if (enemy.x < player.x) {
            enemy.frameY = 11;  // Walk right
        } else {
            enemy.frameY = 9;  // Walk left
        }
    } else {
        if (enemy.y < player.y) {
            enemy.frameY = 10;  // Walk down
        } else {
            enemy.frameY = 8;  // Walk up
        }
    }

    // Ensure enemy updates frames properly in left/right
    if (enemy.moving) {
        enemy.frameX = Math.floor(gameFrame / staggerFrames) % 9;  // Update animation for movement
    } else {
        enemy.frameX = 0; // Idle state
    }

    // Draw the enemy sprite
    ctx.drawImage(
        enemyImage,
        enemy.frameX * spriteWidth, enemy.frameY * spriteHeight, spriteWidth, spriteHeight,
        enemy.x, enemy.y,
        scaledSpriteWidth, scaledSpriteHeight
    );

    // Handle attack animation
    if (player.attacking && player.attackDirection !== null) {
        player.attackFrame = Math.floor(gameFrame / staggerFrames) % 6;
        frameY = classes[selectedClass].attackRow + player.attackDirection;
        frameX = player.attackFrame * spriteWidth;
    } else {
        let position = Math.floor(gameFrame / staggerFrames) % 8;
        frameX = spriteWidth * position;
    }

    // Draw the player sprite
    ctx.drawImage(
        playerImage, frameX, frameY * spriteHeight, spriteWidth, spriteHeight,
        player.x, player.y, scaledSpriteWidth, scaledSpriteHeight
    );

    if (player.moving || player.attacking) gameFrame++;

    requestAnimationFrame(animate);
}

// Ensure images are loaded before starting
backgroundImage.onload = function () {
    playerImage.onload = function () {
        enemyImage.onload = function () {
            selectRandomMap(); // Start with a random map
            animate();
        };
    };
};