// === Canvas Setup ===
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 912;
const CANVAS_HEIGHT = canvas.height = 608;

// Pause
let paused = false;
// Game Over
let gameOver = false;

// === Sprite and Map Config ===
const maps = {
    woods1: '../levels/WoodsLVL1.png',
    woods2: '../levels/WoodsLVL2.png',
    woods3: '../levels/WoodsLVL3.png',
    woods4: '../levels/WoodsLVL4.png',
    desert1: '../levels/DesertLVL1.png',
    desert2: '../levels/DesertLVL2.png',
    desert3: '../levels/DesertLVL3.png',
    desert4: '../levels/DesertLVL4.png',
    snow1: '../levels/SnowLVL1.png',
    snow2: '../levels/SnowLVL2.png',
    snow3: '../levels/SnowLVL3.png',
    snow4: '../levels/SnowLVL4.png'
};

const selectedClass = localStorage.getItem("selectedClass") || "knight";
const classes = {
    knight: {
        sprite: '../sprites/KnightSpriteSheetFINAL.png',
        movementFrames: { right: 11, left: 9, up: 8, down: 10 },
        attackRow: { up: 53, left: 54, down: 55, right: 56 }
    },
    archer: {
        sprite: '../sprites/ArcherSpriteSheetFINAL.png',
        movementFrames: { right: 11, left: 9, up: 8, down: 10 },
        attackRow: { up: 16, left: 17, down: 18, right: 19 }
    },
    wizard: {
        sprite: '../sprites/WizardSpriteSheetFINAL.png',
        movementFrames: { right: 11, left: 9, up: 8, down: 10 },
        attackRow: { up: 4, left: 5, down: 6, right: 7 }
    }
};

const keyMap = {
    w: { frameY: classes[selectedClass].movementFrames.up, dx: 0, dy: -1 },
    a: { frameY: classes[selectedClass].movementFrames.left, dx: -1, dy: 0 },
    s: { frameY: classes[selectedClass].movementFrames.down, dx: 0, dy: 1 },
    d: { frameY: classes[selectedClass].movementFrames.right, dx: 1, dy: 0 },
    k: { attacking: true }
};

// === Image Assets ===
const backgroundImage = new Image();
const playerImage = new Image();
const enemyImage = new Image();

backgroundImage.src = '../levels/WoodsLVL1.png';
playerImage.src = classes[selectedClass].sprite;
enemyImage.src = '../sprites/Goblin01SpriteSheetFINAL.png';

// Create curse bar
const bar = new Bar (new Vect(750, 25), barwidth, 20, "white");
let curse = new Bar (new Vect(750, 25), cursewidth, 20, "red");

// === Start Game When Images Are Loaded ===
backgroundImage.onload = () => {
    playerImage.onload = () => {
        enemyImage.onload = () => {

            // Temporary empty collision map
            const emptyCollision = new CollisionMap(new Array(57 * 38).fill(0), 57, 16);

            const game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, {
                maps,
                keyMap,
                backgroundImage,
                playerImagePath: classes[selectedClass].sprite,
                playerFrames: classes[selectedClass].movementFrames,
                playerAttackRow: classes[selectedClass].attackRow,
                enemyImagePath: '../sprites/Goblin01SpriteSheetFINAL.png',
                collisionMap: emptyCollision
            });

            // Optional: preload correct collision for the first map
            game.updateCollisionMap();
        };
    };
};
