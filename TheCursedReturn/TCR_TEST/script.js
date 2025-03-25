const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGHT = (canvas.height = 600);

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
        movementFrames: { right: 11, left: 9, up: 8, down: 10  },
        attackRow: 4
    }
};

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'WoodsLVL4.png';

// Load player sprite based on selected class
const playerImage = new Image();
playerImage.src = classes[selectedClass].sprite;

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
    x: CANVAS_WIDTH / 2 - scaledSpriteWidth / 2,
    y: CANVAS_HEIGHT / 2 - scaledSpriteHeight / 2,
    speed: 3,
    moving: false,
    attacking: false,
    attackDirection: null,
    attackFrame: 0
};

// Key mapping for movement and attacks
const keyMap = {
    ArrowRight: { frameY: classes[selectedClass].movementFrames.right, dx: 1, dy: 0 },
    ArrowLeft: { frameY: classes[selectedClass].movementFrames.left, dx: -1, dy: 0 },
    ArrowUp: { frameY: classes[selectedClass].movementFrames.up, dx: 0, dy: -1 },
    ArrowDown: { frameY: classes[selectedClass].movementFrames.down, dx: 0, dy: 1 },
    w: { frameY: classes[selectedClass].movementFrames.up, dx: 0, dy: -1 },
    a: { frameY: classes[selectedClass].movementFrames.left, dx: -1, dy: 0 },
    s: { frameY: classes[selectedClass].movementFrames.down, dx: 0, dy: 1 },
    d: { frameY: classes[selectedClass].movementFrames.right, dx: 1, dy: 0 },
    'k': { attacking: true }
};

let keysPressed = {};

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

// Ensure images load before animation starts
backgroundImage.onload = function () {
    playerImage.onload = function () {
        animate();
    };
};
