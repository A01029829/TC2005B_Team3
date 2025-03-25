const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGHT = (canvas.height = 600);

const backgroundImage = new Image();
const maps={
    woods: 'WoodsLVL1.png',
    woods2: 'WoodsLVL2.png',
    woods3: 'WoodsLVL3.png',
    woods4: 'WoodsLVL4.png'
};

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

let imagesLoaded = {
    background: false,
    player: false
};

const portal = {
    x: CANVAS_WIDTH-30,
    y: 0,
    width: 30,
    height: CANVAS_HEIGHT,
    color: 'rgba(0, 0, 0, 0)',
    active: true,
};

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
// Load player sprite based on selected class
const playerImage = new Image();
playerImage.src = classes[selectedClass].sprite;

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

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    //Dibujar salida
    if (portal.active){
        ctx.fillStyle = portal.color;
        ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
    }

    // Player movement logic
    for(let key in keysPressed){
        if (keyMap[key]&&key!== 'k') {
            player.x += keyMap[key].dx * player.speed;
            player.y += keyMap[key].dy * player.speed;
        }
    }

    //Colisiones del jugador con canvas
    player.x = Math.max(0, Math.min(CANVAS_WIDTH - scaledSpriteWidth, player.x));
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - scaledSpriteHeight, player.y));
    
    checkPortalCollision();

    //Dibujar jugador...
    if (player.attacking && player.attackDirection !== null) {
        player.attackFrame = Math.floor(gameFrame / staggerFrames) % 6;
        frameY = classes[selectedClass].attackRow + player.attackDirection;
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

    if (player.moving||player.attacking) gameFrame++;

    window.animationFrame = requestAnimationFrame(animate);
}

//Funcion para detectar colision con el portal
function checkPortalCollision() {
    if (portal.active &&
        player.x<portal.x+portal.width&&
        player.x+scaledSpriteWidth>portal.x&&
        player.y<portal.y+portal.height&&
        player.y+scaledSpriteHeight>portal.y) {
        
        //Desactivar el portal temporalmente para evitar múltiples activaciones
        portal.active = false;
        
        //Cambiar al mapa de destino
        let currentMap= null;
        for (const[mapName, mapPath] of Object.entries(maps)) {
            if (mapPath===backgroundImage.src||backgroundImage.src.endsWith(mapPath)){
                currentMap= mapName;
                break;
            }
        }
        
        //Con esta variable me aseguro de agarrar un mapa que no sea el anterior
        const mapKeys= Object.keys(maps).filter(key=>key!==currentMap);
        
        //Seleccionar un mapa aleatorio de los disponibles
        const randomMapKey= mapKeys[Math.floor(Math.random()*mapKeys.length)];
        
        //Cambiar al mapa aleatorio
        changeMap(maps[randomMapKey]);
        
        //Reposicionar al jugador en el lado izquierdo del nuevo mapa
        player.x = 50;
        
        //Reactivar el portal después de un tiempo
        setTimeout(() => {
            portal.active = true;
        }, 1000);
        return true;
    }
    return false;
}

//Me aseguro de que carguen las imagenes correctamente antes de hacer su display en el fondo
backgroundImage.onload = function () {
    imagesLoaded.background=true;
    checkStartGame();
};

playerImage.onload = function () {
    imagesLoaded.player=true;
    checkStartGame();
};

//Funcion que junta la aparicion del fondo y del jugador para evitar conflictos
function checkStartGame() {
    if (imagesLoaded.background && imagesLoaded.player) {
        console.log("Todas las imágenes cargadas, iniciando animación");
        animate();
    } else {
        console.log("Esperando a que todas las imágenes carguen...");
    }
}

//Inicializar al cargar la página
window.addEventListener('load', function() {
    //Asignar un mapa inicial
    selectRandomMap();
});

window.changeMap=changeMap;
window.selectRandomMap=selectRandomMap;
window.loadNewMap= loadNewMap;
