const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = 'KnightSpriteSheetFINAL.png';

const spriteWidth = 64;
const spriteHeight = 65;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 5;

let player = {
    x: CANVAS_WIDTH / 2 - spriteWidth / 2, // Start in the middle
    y: CANVAS_HEIGHT / 2 - spriteHeight / 2,
    speed: 3, // Movement
    moving: false,
    attacking: false, // New state for attack
    attackDirection: null, // Row for attack direction
    attackFrame: 0 // Attack frame index
};

const keyMap = {
    ArrowRight: { frameY: 11, dx: 1, dy: 0 }, // Walk right
    ArrowLeft: { frameY: 9, dx: -1, dy: 0 }, // Walk left
    ArrowUp: { frameY: 8, dx: 0, dy: -1 },   // Walk up
    ArrowDown: { frameY: 10, dx: 0, dy: 1 },  // Walk down
    'k': { attacking: true } // k for attack
};

let keysPressed = {};

window.addEventListener("keydown", (event) => {
    if (keyMap[event.key]) {
        keysPressed[event.key] = true;

        if (event.key === ' ') {
            player.attacking = true; // Start attack animation
        } else {
            frameY = keyMap[event.key].frameY;
            player.attackDirection = null;
            player.moving = true;
        }
    }

    if (keysPressed['ArrowUp'] && keysPressed[' ']) {
        player.attackDirection = 0;
    } else if (keysPressed['ArrowLeft'] && keysPressed[' ']) {
        player.attackDirection = 1;
    } else if (keysPressed['ArrowDown'] && keysPressed[' ']) {
        player.attackDirection = 2;
    } else if (keysPressed['ArrowRight'] && keysPressed[' ']) {
        player.attackDirection = 3;
    }
});

window.addEventListener("keyup", (event) => {
    if (keyMap[event.key]) {
        delete keysPressed[event.key];
        if (event.key === ' ') {
            player.attacking = false;
        }
        if (Object.keys(keysPressed).length === 0) {
            player.moving = false;
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    for (let key in keysPressed) {
        if (keyMap[key] && key !== ' ') {
            player.x += keyMap[key].dx * player.speed;
            player.y += keyMap[key].dy * player.speed;
        }
    }

    player.x = Math.max(0, Math.min(CANVAS_WIDTH - spriteWidth, player.x));
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - spriteHeight, player.y));

    if (player.attacking && player.attackDirection !== null) {
        player.attackFrame = Math.floor(gameFrame / staggerFrames) % 6;

        frameY = 53 + player.attackDirection;

        frameX = player.attackFrame * spriteWidth;

        ctx.drawImage(
            playerImage,frameX, frameY * spriteHeight, spriteWidth, spriteHeight, 
            player.x, player.y, spriteWidth, spriteHeight);
    } 
    else {
        let position = Math.floor(gameFrame / staggerFrames) % 8;
        frameX = spriteWidth * position;

        ctx.drawImage( playerImage,frameX, frameY * spriteHeight, spriteWidth, spriteHeight, 
            player.x, player.y, spriteWidth, spriteHeight
        );
    }

    if (player.moving || player.attacking) gameFrame++;

    requestAnimationFrame(animate);
}

playerImage.onload = function () {
    animate();
};
