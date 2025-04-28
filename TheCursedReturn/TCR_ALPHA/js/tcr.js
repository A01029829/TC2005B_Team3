// === Canvas Setup ===
// gets the canvas and prepares it for drawing. Also defines its size.
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 912;
const CANVAS_HEIGHT = canvas.height = 608;

let paused = false;
let gameOver = false;
let startRegistered = false;

// === Sprite and Map Config ===
// maps object contains all level backgrounds grouped by biome
// used by MapManager to randomly pick maps without repeats
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

// === Load Selected Class from LocalStorage ===
// tries to load the last chosen character class from memory
// if nothing was chosen, it defaults to "knight"
const selectedClass = localStorage.getItem("selectedClass") || "knight";

// === Class Definitions: Knight, Archer, Wizard ===
// each class has a different sprite, movement row numbers, and attack animation row
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

// === Key Bindings ===
// maps keyboard keys to directions and their animation row
// 'k' is used for attacking
const keyMap = {
    w: { frameY: classes[selectedClass].movementFrames.up, dx: 0, dy: -1, dir: 'up'},
    a: { frameY: classes[selectedClass].movementFrames.left, dx: -1, dy: 0, dir: 'left' },
    s: { frameY: classes[selectedClass].movementFrames.down, dx: 0, dy: 1, dir: 'down'},
    d: { frameY: classes[selectedClass].movementFrames.right, dx: 1, dy: 0, dir: 'right' },
    k: { attacking: true },
    f: { interact : true},
    ' ': { dash: true },
    o: { equip: true }
};

// === Image Assets ===
// these are loaded into memory before the game starts
const backgroundImage = new Image();
const playerImage = new Image();
const enemyImage = new Image();
const wolfImage = new Image();
const healerImage = new Image();
const gunsmithImage = new Image();
const chestImage = new Image();

window.secondarySprites = {
    '../sprites/KnightSecondaryWeapons.png': new Image(),
    '../sprites/ArcherSecondaryWeapons.png': new Image(),
    '../sprites/WizardSecondaryWeapons.png': new Image()
  };
  
  window.secondarySprites['../sprites/KnightSecondaryWeapons.png'].src = '../sprites/KnightSecondaryWeapons.png';
  window.secondarySprites['../sprites/ArcherSecondaryWeapons.png'].src = '../sprites/ArcherSecondaryWeapons.png';
  window.secondarySprites['../sprites/WizardSecondaryWeapons.png'].src = '../sprites/WizardSecondaryWeapons.png';
  

const weaponIcons = {
    dagger: new Image(),
    spear: new Image(),
    crossbow: new Image(),
    waraxe: new Image()
};

const activeWeaponIcons = {
    dagger: new Image(),
    spear: new Image(),
    crossbow: new Image(),
    waraxe: new Image()
};

const secondarySprites = {
    '../sprites/KnightSecondaryWeapons.png': new Image(),
    '../sprites/ArcherSecondaryWeapons.png': new Image(),
    '../sprites/WizardSecondaryWeapons.png': new Image()
};

backgroundImage.src = '../levels/WoodsLVL1.png';
playerImage.src = classes[selectedClass].sprite;
enemyImage.src = '../sprites/Goblin01SpriteSheetFINAL.png';
wolfImage.src = '../sprites/WolfSpriteSheetFINAL.png';
healerImage.src = '../sprites/HealerSpriteSheetFINAL.png';
gunsmithImage.src = '../sprites/GunsmithSpriteSheetFINAL.png'
chestImage.src = '../sprites/chest.png';

weaponIcons.dagger.src = '../images/weapons/dagger.png';
weaponIcons.spear.src = '../images/weapons/spear.png';
weaponIcons.crossbow.src = '../images/weapons/crossbow.png';
weaponIcons.waraxe.src = '../images/weapons/waraxe.png';

secondarySprites['../sprites/KnightSecondaryWeapons.png'].src = '../sprites/KnightSecondaryWeapons.png';
secondarySprites['../sprites/ArcherSecondaryWeapons.png'].src = '../sprites/ArcherSecondaryWeapons.png';
secondarySprites['../sprites/WizardSecondaryWeapons.png'].src = '../sprites/WizardSecondaryWeapons.png';


// === UI Bars Setup (Curse and Life Bars) ===
// these bars appear on the top-right of the game screen to show health and time
const bar = new Bar(new Vect(750, 55), barwidth, 20, "white");
let curse = new Bar(new Vect(750, 55), cursewidth, 20, "red");

const lifeBar = new Bar(new Vect(750, 25), lifeBarwidth, 20, "white");
let life = new Bar(new Vect(750, 25), lifewidth, 20, "#ad1324");

// === Control Tutorial Screen ===
// shows control instructions at the start of the game
const controls = new Image();
controls.src = "../images/movimiento.png"; // may be replaced by the next line
controls.src = "../images/controles_2.png"; // this will overwrite the one above
let showControls = false; // true = display controls on screen

// Sign to indicate next level
const sign_level = new Image();
sign_level.src = "../images/sign_level.png"; 

// === Second weapon ===
const itemBox = new Image();
itemBox.src = "../images/itemBox.png";


// === Start Game When Images Are Loaded ===
// we wait for all 4 images to load before starting the game
let loadedImages = 0;

// Ambience music
const ambienceSound = new Sound('ambience', true, 0.5);

function tryStartGame() {
    loadedImages++;
    if (loadedImages === 5) {

        // === Create an Empty Collision Map to Start With ===
        // creates a blank 57x38 tile grid filled with 0s (no obstacles)
        const emptyCollision = new CollisionMap(new Array(57 * 38).fill(0), 57, 16);

        // === Create the Game Instance and Store It Globally ===
        window.game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, {
            maps,
            keyMap,
            backgroundImage,
            playerImagePath: playerImage.src,
            playerFrames: classes[selectedClass].movementFrames,
            playerAttackRow: classes[selectedClass].attackRow,
            enemyImagePath: enemyImage.src,
            wolfImagePath: wolfImage.src,
            healerImagePath: healerImage.src,
            gunsmithImagePath: gunsmithImage.src,
            chestImagePath: chestImage.src,
            collisionMap: emptyCollision
        });

        // After creating the game instance
        const game = new Game(ctx, canvas.width, canvas.height, assets);
        window.game = game; // Make the game instance globally accessible

        // loads the correct collision data for the initial map
        window.game.updateCollisionMap();
    }
}

// === Hook Up Image Loaders to Game Start ===
// when each image loads, we call tryStartGame() to increment counter
// once all images are loaded (loadedImages === 4), the game starts
backgroundImage.onload = tryStartGame;
playerImage.onload = tryStartGame;
enemyImage.onload = tryStartGame;
wolfImage.onload = tryStartGame;
healerImage.onload = tryStartGame;
gunsmithImage.onload = tryStartGame;

// === Register Game Start ===
function registerStart() {
    // Verify if the start has already been registered
    if (startRegistered) return;
    
    const matchID = sessionStorage.getItem('currentPartidaId');
    const classSelected = sessionStorage.getItem('playerClass');
    
    if (!matchID || !classSelected) {
        //console.error("No se encontró ID de partida o clase en sessionStorage");
        return;
    }
    
    startRegistered = true; // Marcar como registrado
    
    fetch('/api/game-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_partida: matchID,
            eventoTrigger: 'inicio',
            claseElegida: classSelected,
            tiempoPartida: '00:00:00',
            puntuacion: 0,
            nivelActual: 1,
            salaActual: 1,
            biomaActual: 'bosque',
            rankM: 100,
            vida: selectedClass === 'guerrero' ? 120 : (selectedClass === 'mago' ? 80 : 90),
            enemigosCDerrotados: 0,
            enemigosFDerrotados: 0,
            jefesDerrotados: 0,
            objetosEncontrados: 'cofre'
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log("✅ Inicio registrado:", result);
    })
    .catch(error => {
        console.error("❌ Error al registrar inicio:", error);
    });
}

// Call this function when the game starts
window.addEventListener('DOMContentLoaded', function() {
    
    // Register game start
    registerStart();
});