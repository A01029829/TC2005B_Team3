const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGHT = (canvas.height = 600);

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'WoodsLVL1.png';

// Load player sprite
const playerImage = new Image();
playerImage.src = 'KnightSpriteSheetFINAL.png';

// Scaling factors
const knightScale = 1; // Adjust if needed
const spriteWidth = 64;
const spriteHeight = 65;
const scaledSpriteWidth = spriteWidth * knightScale;
const scaledSpriteHeight = spriteHeight * knightScale;

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 5;

let player = {
    x: CANVAS_WIDTH / 2 - scaledSpriteWidth / 2,
    y: CANVAS_HEIGHT / 2 - scaledSpriteHeight / 2,
    speed: 3,
    moving: false,
    attacking: false,
    attackDirection: null,
    attackFrame: 0
};

const keyMap = {
    ArrowRight: { frameY: 11, dx: 1, dy: 0 },
    ArrowLeft: { frameY: 9, dx: -1, dy: 0 },
    ArrowUp: { frameY: 8, dx: 0, dy: -1 },
    ArrowDown: { frameY: 10, dx: 0, dy: 1 },
    w: { frameY: 8, dx: 0, dy: -1 },
    a: { frameY: 9, dx: -1, dy: 0 },
    s: { frameY: 10, dx: 0, dy: 1 },
    d: { frameY: 11, dx: 1, dy: 0 },
    'k': { attacking: true }
};

let keysPressed = {};

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

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw scaled background
    ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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

    if (player.attacking && player.attackDirection !== null) {
        player.attackFrame = Math.floor(gameFrame / staggerFrames) % 6;
        frameY = 53 + player.attackDirection;
        frameX = player.attackFrame * spriteWidth;

        ctx.drawImage(
            playerImage, frameX, frameY * spriteHeight, spriteWidth, spriteHeight,
            player.x, player.y, scaledSpriteWidth, scaledSpriteHeight
        );
    } else {
        let position = Math.floor(gameFrame / staggerFrames) % 8;
        frameX = spriteWidth * position;

        ctx.drawImage(
            playerImage, frameX, frameY * spriteHeight, spriteWidth, spriteHeight,
            player.x, player.y, scaledSpriteWidth, scaledSpriteHeight
        );
    }

    if (player.moving || player.attacking) gameFrame++;

    requestAnimationFrame(animate);
}

// Ensure images load before animation starts
backgroundImage.onload = function () {
    playerImage.onload = function () {
        animate();
    };
};
