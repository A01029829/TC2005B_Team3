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

// === Load SpellballImage globally ===
window.spellballImage = new Image();
window.spellballImage.src = "../sprites/spellball.png";

// === UI Bars Setup (Curse and Life Bars) ===
// these bars appear on the top-right of the game screen to show health and time
const bar = new Bar(new Vect(650, 55), barwidth, 20, "white");
let curse = new Bar(new Vect(650, 55), cursewidth, 20, "red");

const lifeBar = new Bar(new Vect(650, 25), lifeBarwidth, 20, "white");
let life = new Bar(new Vect(650, 25), lifewidth, 20, "#ad1324");

// === Control Tutorial Screen ===
// shows control instructions at the start of the game
const controls = new Image();
controls.src = "../images/control_final.png"; // this will overwrite the one above
let showControls = false; // true = display controls on screen

// sign to indicate next level
const sign_level = new Image();
sign_level.src = "../images/sign_level.png"; 

// === Second weapon ===
const itemBox = new Image();
itemBox.src = "../images/itemBox.png";

// initialize the curse bonus if it doesn't exist
if (!localStorage.getItem("curseBonus")) {
    localStorage.setItem("curseBonus", "0");
}

// apply any existing curse bonus at the start of a game
function applyCurseBonus() {
    // only apply bonus if this is a continuation (not a fresh start)
    // we can detect this by checking if there's an "attempt" counter
    const attemptCount = parseInt(localStorage.getItem("gameAttempts") || "0");
    const curseBonus = parseInt(localStorage.getItem("curseBonus") || "0");

    if (localStorage.getItem("resetCurseBonus") === "true") {
        
        // Reestart the curse bar to default values
        if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
            barwidth = 100; 
            cursewidth = 100;
            bar.width = 100;
            curse.width = 100;
        }
        
        // Restart the curse bonus to default values
        localStorage.setItem("curseBonus", "0");
        localStorage.removeItem("rewardedBossSlots");
        return;
    }
    
    // for a fresh game (or when explicitly reset), ensure everything is at default values
    if (attemptCount === 0 || localStorage.getItem("resetCurseBonus") === "true") {
        // reset to default sizes for fresh start
        if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
            barwidth= 100;
            cursewidth= 100;
            bar.width = 100;  // default bar width
            curse.width = 100; // default starting width
            console.log("Curse bar reset to default!");
        }
        
        // also reset the bonus and clear the reset flag
        localStorage.setItem("curseBonus", "0");
        localStorage.removeItem("rewardedBossSlots");
        return;
    }
    
    // only apply bonus on continuations and if there is a bonus
    if (attemptCount > 0 && curseBonus > 0 && typeof curse !== 'undefined' && typeof bar !== 'undefined') {
        // add the bonus to current curse width
        curse.width = 100 + curseBonus;
        
        // increase the bar width to accommodate the bonus if needed
        if (curse.width > bar.width) {
            bar.width = curse.width;
        }
        
        // cap the maximum bar size
        if (bar.width > 200) bar.width = 200;
        if (curse.width > bar.width) curse.width = bar.width;
        
        console.log(`Applied curse bonus: +${curseBonus} on attempt ${attemptCount}`);
    }
}

// === Start Game When Images Are Loaded ===
// we wait for all 4 images to load before starting the game
let loadedImages = 0;

// === Ambience music ===
function tryStartGame() {
    loadedImages++;
    if (loadedImages === 5) {

        if (localStorage.getItem("resetCurseBonus") === "true") {
            localStorage.removeItem("curseBonus");
            localStorage.removeItem("rewardedBossSlots");
            localStorage.removeItem("gameAttempts");
            localStorage.removeItem("resetCurseBonus");
            
            if (typeof bar !== 'undefined' && typeof curse !== 'undefined') {
                bar.width = 100;
                curse.width = 100;
                console.log("Curse bar reset on game start!");
            }
        }

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
            collisionMap: emptyCollision,
            spellballImage
        });

        // loads the correct collision data for the initial map
        window.game.updateCollisionMap();
        
        if (!localStorage.getItem("gameAttempts")) {
            localStorage.setItem("gameAttempts", "0");
        }

        // apply curse bonus after game initialization
        applyCurseBonus();
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
    // verify if the start has already been registered
    if (startRegistered) return;
    
    const matchID = sessionStorage.getItem('currentPartidaId');
    const classSelected = sessionStorage.getItem('playerClass');
    
    if (!matchID || !classSelected) {
        return;
    }
    
    startRegistered = true; // marked as registered
    
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
        console.log("Start registered:", result);
    })
    .catch(error => {
        console.error("Error when saving start:", error);
    });
}

// === Start music upon first key pressed ===
window.addEventListener('keydown', function startMusicOnce() {
    if (!window.__musicStarted) {
        window.__musicStarted = true;
        window.ambienceSound = new Sound('ambiencejiji', true, 0.5);
        gameSounds.push(window.ambienceSound);
        window.ambienceSound.play();
    }
    window.removeEventListener('keydown', startMusicOnce); // prevent music to play multiple times
});

// handle game restart
async function handleRestart() {
    const playerId = localStorage.getItem('currentPlayerId');
    
    if (!playerId) {
        console.error("No ID available to restart");
        window.location.href = "../html/inicio.html"; // redirect to login
        return;
    }
    
    try {
        localStorage.setItem("gameAttempts", "0");
        // create a new game session
        const response = await fetch('/api/new-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_jugador: playerId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`New match created with id: ${result.id_partida}`);
            localStorage.setItem('currentPartidaId', result.id_partida);
            
            if (window.game) {
                // make sure the curse is reset when needed
                if (localStorage.getItem("resetCurseBonus") === "true") {
                    if (typeof bar !== 'undefined' && typeof curse !== 'undefined') {
                        bar.width = 100;
                        curse.width = 100;
                    }
                }
                
                window.game.reset(result.id_partida);
            } else {
                // otherwise reload the page to start fresh
                window.location.reload();
            }
        } else {
            console.error("Error al crear nueva partida:", result.error);
            alert("Error al reiniciar el juego. Por favor, inténtelo de nuevo.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de conexión. Por favor, inténtelo de nuevo.");
    }
}

// add this function to your initialization code

// start a completely new game with reset bonuses
async function startNewGame() {
    localStorage.setItem("resetCurseBonus", "true");
    localStorage.removeItem("secondaryWeapon");
    localStorage.removeItem("pendingWeapon");
    // reset the curse bonus
    localStorage.removeItem("curseBonus");
    localStorage.removeItem("rewardedBossSlots");
    localStorage.removeItem("gameAttempts");
    localStorage.setItem("curseValue", "100");
    
    if (typeof bar !== 'undefined' && typeof curse !== 'undefined') {
        barwidth=100;
        cursewidth=100;
        bar.width = 100;
        curse.width = 100;
        console.log("Curse bar reset!");
    }
    
    // create new match ID using the existing handleRestart function
    await handleRestart();
    setTimeout(() => {
        localStorage.removeItem("resetCurseBonus");
    }, 500);
}

// add this event listener to your initialization code

// override Ctrl+R to create new game session instead of refreshing
document.addEventListener('keydown', function(event) {
    // check for Ctrl+R
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault(); // prevent browser refresh
        handleRestart();
    }
});

// call this function when the game starts
window.addEventListener('DOMContentLoaded', function() {
    
    // register game start
    registerStart();
});

// === Handle Page Refresh ===
// This function will be called when the page is refreshed
(function cleanupOnRefresh() {
    // Cleaning up localStorage items related to the game to avoid conflicts
    localStorage.removeItem("secondaryWeapon");
    localStorage.removeItem("pendingWeapon");
    localStorage.removeItem("secondaryWeaponSprite");
    localStorage.removeItem("secondaryWeaponMovementFrames");
    localStorage.removeItem("secondaryWeaponAttackRow");
    localStorage.removeItem("originalSpritePath");
    localStorage.removeItem("originalAttackRow"); 
    localStorage.removeItem("originalMovementFrames");
    localStorage.removeItem("selectedWeapon");
    localStorage.removeItem("weaponIcon");
    localStorage.removeItem("usingSecondaryWeapon");
    localStorage.removeItem("switchingWeapon");
    
    setTimeout(() => {
        if (window.game && window.game.player) {
            window.game.player.reset();
        }
    }, 1000);
})();