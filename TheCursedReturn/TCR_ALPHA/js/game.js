// === Enemy Animation Frame Configuration ===
// this object defines how many frames each enemy type has for walking and attacking.
// it helps standardize animation lengths across different variants.
const ENEMY_ANIMATION_CONFIG = {
    goblin_weak:     { walkFrames: 9, attackFrames: 6 }, // weak goblin: 9 walk frames, 6 attack frames
    goblin_strong:   { walkFrames: 9, attackFrames: 6 }, // strong goblin: same as weak

    skeleton_weak:  { walkFrames: 9, attackFrames: 6 }, // weak skeleton: standard animation
    skeleton_semi: { walkFrames: 9, attackFrames: 6 }, // semi-strong skeleton: same animation length
    skeleton_strong:  { walkFrames: 9, attackFrames: 6 }, // strong skeleton: also uses the same frames

    lizard_weak:    { walkFrames: 9, attackFrames: 6 }, // weak lizard animation frames
    lizard_strong:  { walkFrames: 9, attackFrames: 6 }, // strong lizard animation frames

    minotaur_boss:   { walkFrames: 9, attackFrames: 8 }, // minotaur boss (longer attack animation frames)
    wolf_boss:       { walkFrames: 9, attackFrames: 6 }, // wolf boss
    //witch_boss:      { walkFrames: 9, attackFrames: 6 } // future final boss
};


// === Biome to Enemy Types Mapping ===
// specifies which enemy types appear in each biome (environment)
const BIOME_ENEMIES = {
    woods: ['goblin', 'wolf'], // forest biome contains goblins and wolf boss
    desert: ['skeleton'], // desert biome contains skeletons and skeleton boss
    snow: ['lizard', 'minotaur'] // snow biome contains lizards and minotaur boss
};        

// === Biome to Boss Mapping ===
// Determines which boss enemy spawns at the end of each biome
const BIOME_BOSS = {
    woods: 'wolf', // wolf is the boss of the woods biome
    desert: 'skeleton', // strong skeleton is the boss of the desert biome
    snow: 'minotaur' // minotaur is the boss of the snow biome
};

// Actual value of the curse
function getCurseValue() {
    try {

        if (typeof gameOver !== 'undefined' && gameOver === true) {
            return 0;
        }

        if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
            const curseActual= curse.width;
            const barTotal= bar.width;
            
            if (barTotal > 0) {
                const cursePercentage = Math.round((curseActual / barTotal) * 100);
                //console.log(`Calculando maldición: ${curseActual} / ${barTotal} = ${porcentaje}%`);
                return cursePercentage;
            }
        }
        
        const curseElem = document.getElementById('curse');
        const barElem = document.getElementById('bar');
        if (curseElem && barElem) {
            const curseWidth = parseFloat(window.getComputedStyle(curseElem).width);
            const barWidth = parseFloat(window.getComputedStyle(barElem).width);
            if (barWidth > 0) {
                return Math.round((curseWidth / barWidth) * 100);
            }
        }

        const storedCurse = localStorage.getItem('curseValue');
        if (storedCurse) {
            return parseInt(storedCurse);
        }
    } catch (e) {
        console.error("Error al calcular maldición:", e);
    }
    
    // Default value if everything fails
    return 100;
}
 // Actual value of the life bar
function getHealthValue() {
    try {

        if (typeof gameOver !== 'undefined' && gameOver === true) {
            return 0;
        }

        if (typeof window.gameAPI !== 'undefined' && 
            window.gameAPI.player && 
            typeof window.gameAPI.player.health !== 'undefined' && 
            typeof window.gameAPI.player.maxHealth !== 'undefined') {
            
            const healthPercentage = Math.round((window.gameAPI.player.health / window.gameAPI.player.maxHealth) * 100);
            //console.log(`Calculando vida: ${window.gameAPI.player.health} / ${window.gameAPI.player.maxHealth} = ${healthPercentage}%`);
            return healthPercentage;
        }
            
        if (typeof health !== 'undefined' && typeof maxHealth !== 'undefined') {
            const healthPercentage = Math.round((health / maxHealth) * 100);
            //console.log(`Calculando vida: ${health} / ${maxHealth} = ${porcentaje}%`);
            return healthPercentage;
        }
        
        const healthElem = document.getElementById('health');
        const healthBarElem = document.getElementById('bar');
        if (healthElem && healthBarElem) {
            const healthWidth = parseFloat(window.getComputedStyle(healthElem).width);
            const healthBarWidth = parseFloat(window.getComputedStyle(healthBarElem).width);
            if (healthBarWidth > 0) {
                return Math.round((healthWidth / healthBarWidth) * 100);
            }
        }

        const storedHealth = localStorage.getItem('healthValue');
        if (storedHealth) {
            return parseInt(storedHealth);
        }
    } catch (e) {
        console.error("Error al calcular vida:", e);
    }
    
    // Default value if everything fails
    return 100;
}

// === Game Class Definition ===
// handles the entire game: player, enemies, maps, UI, collisions, combat, etc.

// Function to send game events to the server
async function sendEvent(tipo, data) {
    console.log(`Enviando evento ${tipo}:`, data);
    
    // Last values are registered before dying
    if (tipo === 'muerteMaldicion' || tipo === 'muerteVida') {
        
        if (tipo === 'muerteMaldicion') {
            data.rankM = 0;
        }

        if (data.rankM === undefined) {
            //console.warn(`Corrigiendo rankM para evento ${tipo}: ${data.rankM} -> 0`);
            data.rankM = tipo === 'muerteMaldicion' ? 0 : data.rankM || 0;
        }
        
        if (tipo === 'muerteVida') {
            data.vida=0;
        }

        if (data.vida === undefined) {
            //console.warn(`Corrigiendo vida para evento ${tipo}: ${data.vida} -> 0`);
            data.vida = tipo === 'muerteVida' ? 0 : data.vida || 0;
        }

        // Make sure are defined
        if (data.enemigosCDerrotados === undefined) {
            //console.warn(`Corrigiendo enemigosCDerrotados para evento ${tipo}`);
            data.enemigosCDerrotados = 0;
        }
        
        if (data.enemigosFDerrotados === undefined) {
            //console.warn(`Corrigiendo enemigosFDerrotados para evento ${tipo}`);
            data.enemigosFDerrotados = 0;
        }
        
        if (data.jefesDerrotados === undefined) {
            //console.warn(`Corrigiendo jefesDerrotados para evento ${tipo}`);
            data.jefesDerrotados = 0;
        }
    }

    const salaActual = window.game ? window.game.totalRoomsVisited + 1 : (data.salaActual || 1);

    const { EVENT_MAPPINGS, BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};

    // Ensure that eventoTrigger is defined
    const datosCompletos = {
        ...data,
        eventoTrigger: EVENT_MAPPINGS?.[tipo] || tipo,
        biomaActual: BIOME_MAPPINGS?.[data.bioma] || data.biomaActual || 'bosque',
        rankM: tipo === 'muerteMaldicion' ? 0 : (data.rankM || getCurseValue()),
        vida: tipo === 'muerteVida' ? 0 : (data.vida || getHealthValue()),
        salaActual: salaActual
    };

    ///Pruebas consola. Se puede quitar
    // if (!datosCompletos.id_partida) {
    //     console.error("❌ Error: id_partida no está definido", datosCompletos);
    //     return; // No enviar si falta id_partida
    // }
    
    // if (!datosCompletos.claseElegida) {
    //     console.warn("claseElegida no definida, usando default");
    //     datosCompletos.claseElegida = localStorage.getItem('playerClass') || 'guerrero';
    // }

    // if (!['bosque', 'nieve', 'desierto'].includes(datosCompletos.biomaActual)) {
    //     console.warn("Valor de bioma incorrecto, forzando a 'bosque'");
    //     datosCompletos.biomaActual = 'bosque';
    // }
    ///

    // Ensure there are no negative values for enemies defeated (not strictly necessary, but to make sure)
    if (datosCompletos.enemigosCDerrotados < 0) datosCompletos.enemigosCDerrotados = 0;
    if (datosCompletos.enemigosFDerrotados < 0) datosCompletos.enemigosFDerrotados = 0;
    if (datosCompletos.jefesDerrotados < 0) datosCompletos.jefesDerrotados = 0;
    
    fetch('/api/game-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosCompletos)  // Use the values with eventoTrigger
    })
    .then(response => response.json())
    .then(result => {
        console.log(`✅ Evento ${tipo} registrado:`, result);
    })
    .catch(error => {
        console.error(`❌ Error al registrar ${tipo}:`, error);
    });
}

class Game {

    // === Game Constructor ===
    // initializes everything needed to start a game session, including the player, enemies, map, UI state, and progress tracking.
    constructor(ctx, canvasWidth, canvasHeight, assets) {

        // === Setup Core Properties ===
        this.ctx = ctx; // reference to the canvas drawing context
        this.canvasWidth = canvasWidth; // width of the canvas in pixels
        this.canvasHeight = canvasHeight; // height of the canvas in pixels
        this.assets = assets; // object containing all loaded assets (images, maps, etc.)

        this.totalRoomsVisited = 0;
        this.usedMaps = new Set(); // keeps track of which maps have already been used (to avoid repeating them)
        this.enemies = []; // array that will store current enemies in the room
        this.enemyFrame = 0; // controls enemy animation frame updates

        this.gameFrame = 0; // controls player animation frame updates
        this.staggerFrames = 5; // slows down how often frames change (1 = fast, 10 = slow)

        this.flashScreen = false; // used to flash the screen red when the player takes damage

        this.healer = null; // healer npc reference (set to null by default)
        this.healerSpawned = false; // flag to determine if healer has been spawned in current level

        this.gunsmith = null; // gunsmith npc reference (set to null by deafault)
        this.gunsmithSpawned = false; // flag to determine if healer has been spawned in current level

        this.npcFrame = 0; // tracks animation frames for NPCs (healer, gunsmith, chest)

        this.chest = null; // chest object reference (null if none spawned)

        this.staticObjects = []; // stores NPCs and interactive objects that should block movement

        this.lastBoss = null; // used to prevent repeating the same boss in consecutive boss rooms
        this.bossesSpawned = []; // lista de bosses ya spawneados en este run

        this.score = 0; // player's current score

        // === Gameplay Stats Tracking ===
        this.stats = {
            runTime: 0, // how long the run has lasted (in frames)
            score: 0, // score earned during the run
            weakEnemiesDefeated: 0, // number of weak enemies killed
            strongEnemiesDefeated: 0, // number of strong enemies killed
            bossesDefeated: 0 // number of bosses defeated
        };               

        // Initialize game state variables
        this.deathRegistered = false;
        this.score = 0;
        this.elapsedTime = 0;
        this.startTime = Date.now();
        this.lastObjectFound = 'ninguno';
        this.currentBiome = 'woods'; // Initialize biome (default value to prevent errors)
        
        if (!this.progress) {
            this.progress = {
                level: 1,
                visited: 1,
                biome: 'woods'
            };
        }
        
        // Register game start event
        this.registerStart();

        // Default value to prevent errors
        if (!localStorage.getItem('eventoTrigger')) {
            localStorage.setItem('eventoTrigger', 'checkpoint');
        }

        // === Instantiate Managers and Player ===
        this.mapManager = new MapManager(assets.maps, assets.backgroundImage); // manages room selection and map loading
        this.inputManager = new InputManager(assets.keyMap); // handles keyboard input

        // create the player instance and configure its position, sprite, and animation info
        this.player = new Player(
            { x: 48, y: 256 }, // initial position (near left-middle of the screen)
            assets.playerImagePath, // path to the player´s spritesheet
            assets.playerFrames, // total frames per row
            assets.playerAttackRow // row index for attack animation
        );
        this.player.gameRef = this; // give player access to the full game instance (so it can reference enemies, etc.)
        let playerClass = 'guerrero';
        this.player.classType = selectedClass; // set the class type (knight, archer, wizard)

        // Save class in localStorage for future use
        if (selectedClass === 'knight') playerClass = 'guerrero';
        else if (selectedClass === 'archer') playerClass = 'arquero';
        else if (selectedClass === 'wizard') playerClass = 'hechicero';
        localStorage.setItem('playerClass', playerClass);
        //console.log(`🧙‍♂️ Clase elegida: ${playerClass} (original: ${selectedClass})`);

        // === Setup Portal (used to change rooms) ===
        this.portal = new Portal(
            { x: canvasWidth - 30, y: 0 }, // place the portal on the right side
            30, // portal width
            canvasHeight, // portal height (entire screen vertically)
            'rgba(0, 0, 0, 0)' // make the portal invisible but still active for collisions
        );

        // === Collision Map and Level Progress Tracking ===
        this.collisionMap = assets.collisionMap; // assign the initial collision map (loaded from assets)
        this.progress = {
            visited: 0,   // numer of rooms cleared in the current level
            level: 1,     // current level (starts at 1)
            rooms: 4,     // number of rooms per level before boss appears
            maxLevels: 3  // total number of levels in the game (player wins after level 3)
        };

        this.setupStart(); // start the game: select a map, show controls, begin the game loop
    }

    // === Get Valid Spawn Position ===
    // tries to find a random position on the map that is NOT blocked by collisions
    getValidSpawnPosition(collisionMap, canvasWidth, canvasHeight, margin = 48) {
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvasWidth - 2 * margin)) + margin;
            y = Math.floor(Math.random() * (canvasHeight - 2 * margin)) + margin;
        } 
        while (
            collisionMap.isBlockedPixel(x, y) ||
            (this.player &&
             x < this.player.position.x + this.player.width &&
             x + 32 > this.player.position.x &&
             y < this.player.position.y + this.player.height &&
             y + 32 > this.player.position.y)
        );
    
        return { x, y };
    }
      

    // === Setup First Map and Start Loop ===
    // called once at the beginning of the game to choose a starting room and begin playing
    setupStart() {
        this.usedMaps.clear(); // clear list of used maps so none are considered as visited yet
        this.mapManager.selectRandomMap(null, this.usedMaps); // select a random starting map

        showControls = true; // enable the "controls" overlay so the player can see the instructions at the start
        this.loop(); // begin the main game loop
    }

    // === Display Level Notification on Screen ===
    // this runs every time the player enters a new level (e.g., Level 2, 3, etc.)
    onNewLevel() {
        this.healer = null; // reset healer so a new one can be assigned
        this.roomForHealer = Math.floor(Math.random() * this.progress.rooms); // choose a random room where the healer can spawn
        this.healerSpawned = false; // mark that the healer hasn´t spawned yet
        
        this.gunsmith = null; // reset gunsmith so a new one can be assigned
        this.gunsmithSpawned = false; // mark that the healer hasn´t spawned yet

        // create an HTML <div> element to show a message on screen
        const notification = document.createElement('div');
        notification.className = 'level-notification'; // style is defined in CSS

        // shows something like: "Nivel 2" on screen
        notification.innerText = `Nivel ${this.progress.level}`;

        // add the notification to the webpage
        document.body.appendChild(notification);

        // Arrow Function used, retrieved from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        setTimeout(() => {
            notification.remove(); // wait 2 seconds, then remove the notification from the screen
        }, 2000);
    }

    // === Update Collision Map Based on Current Map ===
    // each map has its own set of blocked tiles; this loads the correct one
    updateCollisionMap() {
        const newMapKey = this.mapManager.currentMapKey; // get the current map´s key (identifier)
        const newCollisionArray = collisionMapIndex[newMapKey]; // look up the collision array for that map

        if (newCollisionArray) {
            // if a valid collision array exists, use it to create a new CollisionMap instance
            this.collisionMap = new CollisionMap(newCollisionArray, 57, 16); // 57 columns x 16 rows
        } else {
            // if no collision array was found, create a blank one (all walkable)
            this.collisionMap = new CollisionMap(new Array(57 * 38).fill(0), 57, 16); // 2166 zeroes
        }
    }

    // === Spawn Enemies in Random Positions ===
    spawnEnemiesForRoom() {
        this.enemies = []; // reset the enemies array to prepare for a new room
        const biome = this.mapManager.currentBiome; // get current biome (woods, snow, desert)
        const availableTypes = BIOME_ENEMIES[biome]; // get all valid enemies types for the biome
        const isBossRoom = this.progress.visited === 3 || (this.progress.level === 3 && this.progress.visited === 4); // every 4th room (index 3) is a boss room

        // === Boss Room Logic ===
        if (isBossRoom) {
            let bossType;
        
            // Si estamos en la última sala después del nivel 3
            if (this.progress.level === 3 && this.progress.visited >= 4) {
                bossType = 'witch';
            } else {
                // De lo contrario, buscar un jefe disponible que no se haya spawneado
                const biomeBoss = BIOME_BOSS[biome];
        
                // Si el boss de este bioma no se ha usado, úsalo
                if (!this.bossesSpawned.includes(biomeBoss)) {
                    bossType = biomeBoss;
                } else {
                    // Si ya se usó, buscar otro boss disponible
                    const remainingBosses = Object.values(BIOME_BOSS).filter(boss => !this.bossesSpawned.includes(boss));
                    bossType = remainingBosses[Math.floor(Math.random() * remainingBosses.length)] || biomeBoss;
                }
        
                this.bossesSpawned.push(bossType);
            }
        
            this.lastBoss = bossType;
        
            // === Spawnea el jefe ===
            const spawn = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            const spritePath = this.getEnemySpritePath(bossType, 'boss');
            const boss = new Enemy(spawn, 1, spritePath, bossType, 'boss', biome, this.progress.level);
            boss.gameRef = this;
            boss.health = getEnemyHP(bossType, 'boss', this.progress.level);
            boss.maxHealth = boss.health;
        
            // Animaciones
            const bossKey = `${bossType}_boss`;
            const bossConfig = ENEMY_ANIMATION_CONFIG[bossKey];
            if (bossConfig) {
                boss.walkFrames = bossConfig.walkFrames;
                boss.attackFrames = bossConfig.attackFrames;
            }
        
            if (bossType === 'wolf') {
                boss.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                boss.attackRow = { up: 53, left: 54, down: 55, right: 56 };
            } else if (bossType === 'minotaur') {
                boss.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                boss.attackRow = { up: 4, left: 5, down: 6, right: 7 };
            } else if (bossType === 'skeleton') {
                boss.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                boss.attackRow = { up: 57, left: 58, down: 59, right: 60 };
            } else if (bossType === 'witch') {
                boss.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                boss.homingAttackRow = { up: 0, left: 1, down: 2, right: 3};
                boss.homingCooldown = 360;
                boss.projectiles = [];
            }
        
            boss.healthBar = new Bar(
                new Vect(boss.position.x, boss.position.y - 10),
                50,
                7,
                "red"
            );
        
            this.enemies.push(boss);
            return;
        }

        // === Regular Room Enemy Spawning ===
        for (let i = 0; i < 10; i++) { // try to spawn 10 enemies (or less)
            const type = availableTypes[Math.floor(Math.random() * availableTypes.length)]; // pick a random enemy type from current biome
            let variant;
            
            // skip spawning certain boss-only enemies in non-boss rooms
            if ((type === 'wolf' || type === 'minotaur' || type === 'skeleton') && !isBossRoom) {
                continue; // skip this enemy and move to the next iteration
            }
            
            // if we are in a boss room, mark the special enemies as 'boss'
            if (isBossRoom && (type === 'wolf' || type === 'minotaur' || type === 'skeleton')) {
                variant = 'boss';
            }
            
            // skeletons can be weak, semi, or strong — randomly pick one
            else if (type === 'skeleton') {
                const r = Math.random(); // roll between 0–1
                if (r < 0.33) {
                    variant = 'weak';
                } else if (r < 0.66) {
                    variant = 'semi';
                } else {
                    variant = 'strong';
                }
            } 
            // goblins and lizards can only be weak or strong
            else {
                if (Math.random() < 0.5) {
                    variant = 'weak';
                } else {
                    variant = 'strong';
                }
            }
        
            // in case something messed up and a boss variant was selected for a normal room, force it to 'strong'
            if (!isBossRoom && variant === 'boss') {
                variant = 'strong';
            }

            // === Instantiate and Configure Enemy ===
            // get a valid, non-blocked (walkable) spawn position within the current map
            const spawn = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);

            // get the correct sprite sheet path for this enemy type and variant
            const spritePath = this.getEnemySpritePath(type, variant);
           
            const speed = 1.25; // default movement speed for enemies
        
            // create the actual enemy object
            const enemy = new Enemy(spawn, speed, spritePath, type, variant, biome, this.progress.level);

            // set the health and maxHealth for this enemy using a scaling function
            const hp = getEnemyHP(type, variant, this.progress.level);
            enemy.health = hp;
            enemy.maxHealth = hp;

            // build the animation key to look up the right walk/attack frame settings
            const animKey = `${type}_${variant}`;

            // === Assign Frame Rows Based on Enemy Type and Variant ===
            // each enemy has unique spritesheet row indexes for walking and attacking animations
            // === Goblin - Weak Variant ===
            if (type === 'goblin' && variant === 'weak') {
                enemy.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                enemy.attackRow = { up: 0, left: 1, down: 2, right: 3 };
            }
            
            // === Goblin - Strong Variant ===
            else if (type === 'goblin' && variant === 'strong') {
                enemy.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                enemy.attackRow = { up: 53, left: 54, down: 55, right: 56 };
            }        
            
            // === Lizard - Strong Variant ===
            else if (type === 'lizard' && variant === 'strong') {
                enemy.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                enemy.attackRow = { up: 57, left: 58, down: 59, right: 60 };
            }
    
            // === Lizard - Weak Variant ===
            else if (type === 'lizard' && variant === 'weak') {
                enemy.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                enemy.attackRow = { up: 12, left: 13, down: 14, right: 15 };
            }    
            
            // === Minotaur - Boss Variant ===
            else if (type === 'minotaur' && variant === 'boss') {
                enemy.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                enemy.attackRow = { up: 4, left: 5, down: 6, right: 7 };
            }
    
            // === Wolf - Boss Variant ===
            else if (type === 'wolf' && variant === 'boss') {
                enemy.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                enemy.attackRow = { up: 53, left: 54, down: 55, right: 56 };
            }        
            
            // === Skeleton - Weak Variant ===
            else if (type === 'skeleton' && variant === 'weak') {
                enemy.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                enemy.attackRow = { up: 57, left: 58, down: 59, right: 60 };
            }
            
            // === Skeleton - Semi-Strong Variant ===
            else if (type === 'skeleton' && variant === 'semi') {
                enemy.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                enemy.attackRow = { up: 53, left: 54, down: 55, right: 56 };
            }

            // === Skeleton - Strong/Boss Variant ===
            else if (type === 'skeleton' && variant === 'strong') {
                enemy.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                enemy.attackRow = { up: 57, left: 58, down: 59, right: 60 };
            }

            // === Apply Animation Frame Configuration if Available ===
            const config = ENEMY_ANIMATION_CONFIG[animKey]; // Look up the animation frame counts (walk/attack) using the type_variant key

            if (config) {
                enemy.walkFrames = config.walkFrames; // set how many frames the enemy has for walking
                enemy.attackFrames = config.attackFrames; // set how many frames for attacking
            }

            enemy.gameRef = this; // give enemy access to the entire game instance
        
            // health bar for regular enemies
            enemy.healthBar = new Bar(
                new Vect(enemy.position.x, enemy.position.y - 10), // above the enemy
                30, // width
                7, // height
                "red" // colorS
            );

            this.enemies.push(enemy); // finally, add the enemy to the room's active enemy list
        }

        // === Fallback: asegurarnos de que haya mínimo 1 enemigo si la sala quedó vacía ===
        if (this.enemies.length === 0) {
            const fallbackAmount = 10; // Puedes poner el número de fallback enemies que quieras
            for (let i = 0; i < fallbackAmount; i++) {
                const fallbackType = availableTypes ? availableTypes[Math.floor(Math.random() * availableTypes.length)] : 'goblin';
                let variant;
        
                if (fallbackType === 'skeleton') {
                    // Si es desierto, solo weak o semi
                    if (biome === 'desert') {
                        variant = Math.random() < 0.5 ? 'weak' : 'semi';
                    } else {
                        // En otros biomas, puede ser weak, semi o strong
                        const r = Math.random();
                        if (r < 0.33) {
                            variant = 'weak';
                        } else if (r < 0.66) {
                            variant = 'semi';
                        } else {
                            variant = 'strong';
                        }
                    }
                } else if (fallbackType === 'goblin' || fallbackType === 'lizard') {
                    variant = Math.random() < 0.5 ? 'weak' : 'strong';
                } else {
                    // Fallback de seguridad
                    variant = 'weak';
                }
        
                const spawn = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
                const spritePath = this.getEnemySpritePath(fallbackType, variant);
                const fallback = new Enemy(spawn, 1.25, spritePath, fallbackType, variant, biome, this.progress.level);
        
                fallback.gameRef = this;
                fallback.health = getEnemyHP(fallbackType, variant, this.progress.level);
                fallback.maxHealth = fallback.health;
        
                // Asignar correctamente el movementFrames y attackRow basado en tipo y variante
                if (fallbackType === 'goblin') {
                    if (variant === 'weak') {
                        fallback.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                        fallback.attackRow = { up: 0, left: 1, down: 2, right: 3 };
                    } else if (variant === 'strong') {
                        fallback.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                        fallback.attackRow = { up: 53, left: 54, down: 55, right: 56 };
                    }
                } else if (fallbackType === 'lizard') {
                    if (variant === 'weak') {
                        fallback.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                        fallback.attackRow = { up: 12, left: 13, down: 14, right: 15 };
                    } else if (variant === 'strong') {
                        fallback.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                        fallback.attackRow = { up: 57, left: 58, down: 59, right: 60 };
                    }
                } else if (fallbackType === 'skeleton') {
                    if (variant === 'weak') {
                        fallback.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                        fallback.attackRow = { up: 57, left: 58, down: 59, right: 60 };
                    } else if (variant === 'semi') {
                        fallback.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
                        fallback.attackRow = { up: 53, left: 54, down: 55, right: 56 };
                    } else if (variant === 'strong') {
                        fallback.movementFrames = { up: 53, left: 54, down: 55, right: 56 };
                        fallback.attackRow = { up: 57, left: 58, down: 59, right: 60 };
                    }
                }
        
                fallback.healthBar = new Bar(
                    new Vect(fallback.position.x, fallback.position.y - 10),
                    30,
                    7,
                    "red"
                );
        
                this.enemies.push(fallback);
            }
        }        

        // === Spawn Gunsmith ===
        // only spawn if we haven't already spawned a gunsmith this level
        // there's a 15% chance the gunsmith will appear in this room
        const gunsmithSpawn = !this.gunsmithSpawned && Math.random() < 0.6;

        if (gunsmithSpawn) {
            // find a valid, non-blocked position on the map
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);

            // create the gunsmith object with its position and sprite
            this.gunsmith = new Gunsmith({ x: spawnX, y: spawnY }, this.assets.gunsmithImagePath);
            
            this.gunsmithSpawned = true; // mark the gunsmith as spawned for this level so no duplicates
           
            // reset interaction state
            this.gunsmith.opened = false; // player hasn´t used it yet
            this.gunsmith.active = true; // gunsmith is currently interactable
        } else {
            this.gunsmith = null; // if not spawned, set null (not present in room)
        }        

        // === Spawn Healer ===
        if (
            !this.healerSpawned && // only if the healer hasn´t been spawned yet
            this.progress.visited === this.roomForHealer && // only in the selected room for healer
            Math.random() < 1 // 100% spawnrate
          ) {

            // find a valid position on the map for the healer
            const pos = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            
            // create the healer object with its sprite and position
            this.healer = new Healer(pos, this.assets.healerImagePath);
           
            // mark the healer as spawned and make it active
            this.healerSpawned = true;
            this.healer.active = true;

            // reset cooldown and healing flags for another future interaction
            this.healer.cooldown = false;
            this.healer.healing = false;
          }
                 

        // === Spawn Chest ===
        const chestSpawn = Math.random() < 0.7; // chance of spawning a chest in this room
        if (chestSpawn) {
            // find a valid position
            const { x: spawnX, y: spawnY } = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);

            // create the chest and assign its sprite and state
            this.chest = new Chest(
                { x: spawnX, y: spawnY },
                this.assets.chestImagePath
            );
            this.chest.opened = false; // chest hasn't been opened yet
            this.chest.active = true; // chest can be interacted with

        } else {
            this.chest = null; // no chest in this room
        }

        // === NPC and Chest Collisions ===
        // these are non-enemy objects that block player/enemy movement (like walls)
        // we collect them all into a single array for easier collision handling
        this.staticObjects = []; // reset the array before pushing new ones

        if (this.healer) this.staticObjects.push(this.healer); // add healer if present
        if (this.gunsmith) this.staticObjects.push(this.gunsmith); // add gunsmith if present
        if (this.chest) this.staticObjects.push(this.chest); // add chest if present

        this.portal.active = false; // deactivate portal until enemies are cleared
    }

    updateGameState() {
        // Verify game ID
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) {
            //console.error("No se encontró ID de partida en localStorage");
            return;
        }
        
        // Format time
        const formattedTime = formatTime(this.elapsedTime || 0);

        // Calculate curse value
        const curseValue = getCurseValue();
        localStorage.setItem('curseValue', curseValue);
        //console.log(`Valor actual de maldición: ${maldicionValor}%`);
        
        const vidaValor = getHealthValue();
        localStorage.setItem('vidaValue', vidaValor);
        //console.log(`Valor actual de vida: ${vidaValor}%`);

        const selectedClass = localStorage.getItem('playerClass') || 'guerrero';

        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};

        const actualBiome = BIOME_MAPPINGS?.[this.currentBiome] || 'bosque';

        // Create data object for all events
        const dataEvent = {
            id_partida: matchID,
            claseElegida: selectedClass,
            tiempoPartida: formattedTime,
            puntuacion: this.score || 0,
            nivelActual: this.progress?.level || 1,
            salaActual: this.progress?.visited || 1,
            biomaActual: actualBiome,
            rankM: curseValue,
            vida: this.player?.health || 100,
            enemigosCDerrotados: this.stats?.weakEnemiesDefeated || 0,  // Cambiado para usar las propiedades correctas
            enemigosFDerrotados: this.stats?.strongEnemiesDefeated || 0,
            jefesDerrotados: this.stats?.bossesDefeated || 0,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        };
        
        // Verify death event by health
        if (this.player && this.player.health <= 0 && !this.deathRegistered) {
            this.deathRegistered = true;
            sendEvent('muerteVida', dataEvent);
        }
        
    }

    // Method to register objects found
    recordObjectFound(objectType) {
        this.lastObjectFound = objectType;
        //console.log(`Objeto encontrado: ${objectType}`);
    }

    registrarPausa() {
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) return;
        
        const formattedTime = formatTime(this.elapsedTime || 0);
        
        let curseValue = getCurseValue();
        let healthValue = Math.round((this.player.health / this.player.maxHealth) * 100);
        
        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};

        const actualBiome = BIOME_MAPPINGS?.[this.currentBiome] || 'bosque';
        //console.log(`Bioma para evento pausa: ${biomaActual} (original: ${this.currentBiome})`);
        
        const selectedClass = localStorage.getItem('playerClass') || 'guerrero';
        const currentRoom = this.totalRoomsVisited + 1;
        
        sendEvent('pausa', {
            id_partida: matchID,
            //eventoTrigger: localStorage.getItem('eventoTrigger') || 'checkpoint',
            claseElegida: selectedClass,
            tiempoPartida: formattedTime,
            puntuacion: this.score || 0,
            nivelActual: this.progress?.level || 1,
            salaActual: currentRoom,
            biomaActual: actualBiome,
            rankM: curseValue,
            vida: healthValue,
            enemigosCDerrotados: this.stats?.weakEnemiesDefeated || 0,
            enemigosFDerrotados: this.stats?.strongEnemiesDefeated || 0,
            jefesDerrotados: this.stats?.bossesDefeated || 0,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        });
    }

    onPortalTriggered() {
        // Save reference to the game API before changing the map
        const savedAPI = window.gameAPI;
        
        // Ensure the player is leaving the room from the right side
        const exitingFromRight = this.player.position.x > this.canvasWidth - 100;
        
        //console.log("Jugador saliendo por: " + (exitingFromRight ? "derecha" : "izquierda/centro"));
        
        // Change map with some improvements
        try {
            if (this.mapManager.currentMapKey) {
                this.usedMaps.add(this.mapManager.currentMapKey);
            }
            
            // === Permitir reusar mapas para la Bruja ===
            if (this.progress.level === 3 && this.progress.visited === 5) {
                this.usedMaps.clear();
            }


            this.mapManager.selectRandomMap(this.mapManager.currentMapKey, this.usedMaps);
            
            // Verificar que la imagen de fondo se ha cargado correctamente
            if (!this.assets.backgroundImage.complete) {
                //console.log("Esperando a que la imagen de fondo se cargue completamente...");
                this.assets.backgroundImage.onload = () => {
                    //console.log("Imagen de fondo cargada con éxito");
                    this.continueRoomChange(exitingFromRight, savedAPI);
                };
                this.assets.backgroundImage.onerror = (e) => {
                    //console.error("Error al cargar la imagen de fondo:", e);
                };
            } else {
                this.continueRoomChange(exitingFromRight, savedAPI);
            }
        } catch (error) {
            //console.error("Error durante el cambio de sala:", error);
        }
    }

    // Auxiliar method to continue room change after background image is loaded
    continueRoomChange(exitingFromRight, savedAPI) {
        this.updateCollisionMap();
        
        // Update biome
        this.currentBiome = this.mapManager.currentBiome;
        console.log(`Bioma actualizado a: ${this.currentBiome}`);
        
        // Clean static objects
        this.staticObjects = [];
        this.gunsmith = null;
        this.gunsmithSpawned = false;
        this.healer = null;
        this.healerSpawned = false;
        this.chest = null;
        
        // Generate new enemies
        this.spawnEnemiesForRoom();
        
        // Deactivate the portal until all enemies are cleared
        this.portal.active = false;
        
        // Ensure the player is positioned correctly based on the exit side
        if (exitingFromRight) {
            this.player.position.x = 50;
        } else {
            this.player.position.x = this.canvasWidth - 100;
        }
        
        // Keep the player within the vertical bounds of the canvas
        this.player.position.y = Math.min(
            Math.max(50, this.player.position.y),
            this.canvasHeight - 50
        );
        this.player.position.y = this.canvasHeight/2;

//        //console.log(`Jugador reposicionado en: X=${this.player.position.x}, Y=${this.player.position.y}`);
        
        // Restore API after map change
        if (savedAPI) {
            window.gameAPI = savedAPI;
            //console.log("🛠️ API de juego restaurada correctamente");
            if (!window.gameAPI.handleRestart) {
                window.gameAPI.handleRestart = handleRestart;
            }
        }
        
        // Register checkpoint after room change
        try {
            this.registerCheckpoint();
        } catch (e) {
            console.error("Error al registrar checkpoint:", e);
        }
    }

    // Method to register checkpoints
    registerCheckpoint() {
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) {
            //console.error("No hay ID de partida disponible");
            return;
        }

        const currentRoom = this.totalRoomsVisited + 1;

        const formattedTime = formatTime(this.elapsedTime || 0);
        
        let curseValue = getCurseValue();
        let healthValue = Math.round((this.player.health / this.player.maxHealth) * 100);
        
        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};
        const actualBiome = BIOME_MAPPINGS?.[this.currentBiome] || 'bosque';
        //console.log(`Bioma para evento pausa: ${biomaActual} (original: ${this.currentBiome})`);
        
        const selectedClass = localStorage.getItem('playerClass') || 'guerrero';
        
        // Data for the checkpoint event
        const checkpointData = {
            id_partida: matchID,
            eventoTrigger: localStorage.getItem('eventoTrigger') || 'checkpoints',
            claseElegida: selectedClass,
            tiempoPartida: formattedTime,
            puntuacion: this.score,
            nivelActual: this.progress.level,
            salaActual: currentRoom,
            biomaActual: actualBiome, //biomaMappings[this.currentBiome] || 'bosque',
            rankM: curseValue,
            vida: healthValue,
            enemigosCDerrotados: this.stats.weakEnemiesDefeated,
            enemigosFDerrotados: this.stats.strongEnemiesDefeated,
            jefesDerrotados: this.stats.bossesDefeated,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        };

        //console.log("Enviando datos de checkpoint:", checkpointData);
        sendEvent('checkpoints', checkpointData);
    }

    // Start event
    registerStart() {
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) {
            //console.error("No hay ID de partida disponible para registrar inicio");
            return;
        }
        
        const formatearTiempo = (ms) => {
            return "00:00:00";
        };
        
        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};
        
        const biomaActual = BIOME_MAPPINGS?.[this.currentBiome] || 'bosque';
        let chosenClass = 'guerrero';
    
        if (selectedClass === 'knight') chosenClass = 'guerrero';
        else if (selectedClass === 'archer') chosenClass = 'arquero';
        else if (selectedClass === 'wizard') chosenClass = 'hechicero';
        
        localStorage.setItem('playerClass', chosenClass);
    
        //console.log("Registrando inicio de partida:", matchID);
        
        sendEvent('inicio', {
            id_partida: matchID,
            claseElegida: chosenClass,
            tiempoPartida: formatearTiempo(0),
            puntuacion: 0,
            nivelActual: 1,
            salaActual: 1,
            biomaActual: biomaActual,
            rankM: 100,
            vida: 100,
            enemigosCDerrotados: 0,
            enemigosFDerrotados: 0,
            jefesDerrotados: 0,
            objetosEncontrados: 'ninguno'
        });
    }

    // Method to register victory
    registerVictory() {
        if (this.victoryRegistered) return;
        
        this.victoryRegistered = true;
        gameOver = true; // Detener el bucle del juego
        
        // Get match id
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) return;
        
        // Send victory events
        const dataEvent = {
            id_partida: matchID,
            claseElegida: localStorage.getItem('playerClass') || 'guerrero',
            tiempoPartida: formatTime(this.elapsedTime || 0),
            puntuacion: this.score || 0,
            nivelActual: 3,
            salaActual: 5, 
            biomaActual: window.TCR_CONSTANTS?.BIOME_MAPPINGS?.[this.currentBiome] || 'nieve',
            rankM: getCurseValue(),
            vida: this.player.health,
            enemigosCDerrotados: this.stats?.weakEnemiesDefeated || 0,
            enemigosFDerrotados: this.stats?.strongEnemiesDefeated || 0,
            jefesDerrotados: this.stats?.bossesDefeated || 0,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        };
        
        sendEvent('victoria', dataEvent);
    }

    resetCurseStorage() {
        console.log("Clearing all curse-related localStorage data");
        
        // Clear all curse-related localStorage
        localStorage.removeItem("curseBonus");
        localStorage.removeItem("rewardedBossSlots");
        localStorage.removeItem("gameAttempts");
        localStorage.setItem("resetCurseBonus", "true");
        
        // Set default curse values
        localStorage.setItem("curseValue", "100");
        
        // Reset UI bars if they exist
        if (typeof bar !== 'undefined' && typeof curse !== 'undefined') {
            // Reset base globals
            barwidth = 100;
            cursewidth = 100;
            
            // Reset actual bars
            bar.width = 100;
            curse.width = 100;
            console.log("Curse bar reset to 100");
        }
    }

    // Reset the game with a new match ID
    reset(newMatchId) {
        // Reset progress
        this.resetCurseStorage();
        this.progress = {
            visited: 0,
            level: 1,
            rooms: 4,
            maxLevels: 3
        };
        
        // Reset counters
        this.totalRoomsVisited = 0;
        this.usedMaps.clear();
        this.enemies = [];
        this.enemyFrame = 0;
        this.gameFrame = 0;
        this.deathRegistered = false;
        this.score = 0;
        this.elapsedTime = 0;
        this.startTime = Date.now();
        this.lastObjectFound = 'ninguno';
        this.bossesSpawned = [];
        
        // Reset stats
        this.stats = {
            runTime: 0,
            score: 0,
            weakEnemiesDefeated: 0,
            strongEnemiesDefeated: 0,
            bossesDefeated: 0
        };
        
        // Reset player position and health
        this.player.position = { x: 48, y: 256 };
        this.player.health = this.player.maxHealth;
        this.player.secondaryWeapon = null;
        this.player.pendingIcon = null;
        this.player.projectiles = [];
        this.player.dying = false;
        this.player.finishedDying = false;
        
        // Store new match ID
        localStorage.setItem('currentPartidaId', newMatchId);
        
        // Register new game start
        this.registerStart();
        
        // Reset the map and portal
        this.setupStart();
        
        // Reset curse and life UI elements
        if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
            curse.width = bar.width;
            life.width = lifeBarwidth;
        }
        
        // Reset global game state
        paused = false;
        gameOver = false;
    }

    // Add this method to your Game class

// Continue the same game after death (preserving curse bonus)
continueGame() {
    const attemptCount = parseInt(localStorage.getItem("gameAttempts") || "0") + 1;
    localStorage.setItem("gameAttempts", attemptCount.toString());

    // Store the current curse bonus before resetting
    const currentBonus = parseInt(localStorage.getItem("curseBonus") || "0");
    
    // Reset progress to start of current level
    this.progress = {
        visited: 0,
        level: 1, // Keep the same level
        rooms: 4,
        maxLevels: 3
    };
    
    // Reset room counters but preserve map knowledge
    this.totalRoomsVisited = 0;
    this.usedMaps.clear();
    
    // Reset enemies and frames
    this.enemies = [];
    this.enemyFrame = 0;
    this.gameFrame = 0;
    this.deathRegistered = false;
    
    // Keep the same score
    this.elapsedTime = 0;
    this.startTime = Date.now();
    this.lastObjectFound = 'ninguno';
    this.bossesSpawned = [];
    
    // Reset player position and health
    this.player.position = { x: 48, y: 256 };
    this.player.health = this.player.maxHealth;
    this.player.secondaryWeapon = null;
    this.player.pendingIcon = null;
    this.player.projectiles = [];
    this.player.dying = false;
    this.player.finishedDying = false;
    
    // Reset global game states
    paused = false;
    gameOver = false;

    // Reset the map and portal
    this.setupStart();
    
    // Most importantly - restore the curse bar with the bonus
    if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
        // Reset base width
        bar.width = 100;
        curse.width = 100;
        
        // Apply the bonus from previous attempts
        if (currentBonus > 0) {
            curse.width = 100 + currentBonus;
            
            // Extend the bar if needed to fit the curse
            if (curse.width > bar.width) {
                bar.width = curse.width;
            }
            
            // Cap at maximum allowed width
            if (bar.width > 200) bar.width = 200;
            if (curse.width > bar.width) curse.width = bar.width;
            
            console.log(`Restored curse bar with bonus: ${currentBonus}`);
        }
    }

    if (typeof life !== 'undefined' && typeof lifeBar !== 'undefined' && typeof lifeBarwidth !== 'undefined') {
        life.width = lifeBarwidth; // Reset to full health
    }
    
    // Register continuation event
    this.registerContinuation();
}

    // New method to register a game continuation
    registerContinuation() {
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) {
            console.error("No hay ID de partida disponible para registrar continuación");
            return;
        }
        
        const formattedTime = "00:00:00";
        const curseValue = 100;
        const healthValue = 100;
        
        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};
        const actualBiome = BIOME_MAPPINGS?.[this.currentBiome] || 'bosque';
        const selectedClass = localStorage.getItem('playerClass') || 'guerrero';
        
        // Data for the continuation event
        const continuationData = {
            id_partida: matchID,
            eventoTrigger: 'nuevoIntento',
            claseElegida: selectedClass,
            tiempoPartida: formattedTime,
            puntuacion: this.score,
            nivelActual: 1,
            salaActual: 1,
            biomaActual: actualBiome,
            rankM: curseValue,
            vida: healthValue,
            enemigosCDerrotados: this.stats.weakEnemiesDefeated,
            enemigosFDerrotados: this.stats.strongEnemiesDefeated,
            jefesDerrotados: this.stats.bossesDefeated,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        };

        console.log("Registrando continuación de juego:", continuationData);
        setTimeout(() => {
            sendEvent('nuevoIntento', continuationData);
        }, 100);
    }

    // Helper method to register death events
    registerDeathEvent(deathType) {
        if (this.deathRegistered) return; // Prevent duplicate registration
        
        this.deathRegistered = true;
        gameOver = true; // Make sure to set the global gameOver flag
        
        const formatTime = (ms) => {
            const horas = Math.floor(ms / 3600000);
            const minutos = Math.floor((ms % 3600000) / 60000);
            const segundos = Math.floor((ms % 60000) / 1000);
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        };
        
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) return;
        
        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};
        const actualHealth = deathType === 'muerteVida' ? 0 : this.player?.health || 0;
        const actualCurse = deathType === 'muerteMaldicion' ? 0 : getCurseValue();
        
        const dataEvent = {
            id_partida: matchID,
            claseElegida: localStorage.getItem('playerClass') || 'guerrero',
            tiempoPartida: formatTime(this.elapsedTime || 0),
            puntuacion: this.score || 0,
            nivelActual: this.progress?.level || 1,
            salaActual: this.totalRoomsVisited + 1,
            biomaActual: BIOME_MAPPINGS?.[this.currentBiome] || 'bosque',
            rankM: actualCurse,
            vida: actualHealth,
            enemigosCDerrotados: this.stats?.weakEnemiesDefeated || 0,
            enemigosFDerrotados: this.stats?.strongEnemiesDefeated || 0,
            jefesDerrotados: this.stats?.bossesDefeated || 0,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        };
        
        setTimeout(() => {
            sendEvent(deathType, dataEvent);
            // Call the GameOver function to show the UI
            GameOver();
        }, 100);
    }
    // Event that registers when a player exits the game
    registerExit() {
        const matchID = localStorage.getItem('currentPartidaId');
        if (!matchID) {
            //console.error("No hay ID de partida disponible");
            return;
        }
    
        let curseValue = getCurseValue();
        const healthValue = Math.round((this.player.health / this.player.maxHealth) * 100);

        const formattedTime = formatTime(this.elapsedTime || 0);
        
        const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};

        const biomaActual = BIOME_MAPPINGS?.[this.currentBiome] || 'bosque';
        //console.log(`Bioma para evento salida: ${biomaActual} (original: ${this.currentBiome})`);
        const selectedClass = localStorage.getItem('playerClass') || 'guerrero';
        const actualRoom = this.totalRoomsVisited + 1;
        
        // Data for the checkpoint event
        const exitData = {
            id_partida: matchID,
            eventoTrigger: 'salida',
            claseElegida: selectedClass,
            tiempoPartida: formattedTime,
            puntuacion: this.score,
            nivelActual: this.progress.level,
            salaActual: actualRoom,
            biomaActual: biomaActual, //biomaMappings[this.currentBiome] || 'bosque',
            rankM: curseValue,
            vida: healthValue,
            enemigosCDerrotados: this.stats.weakEnemiesDefeated,
            enemigosFDerrotados: this.stats.strongEnemiesDefeated,
            jefesDerrotados: this.stats.bossesDefeated,
            objetosEncontrados: this.lastObjectFound || 'ninguno'
        };

        //console.log("Enviando datos de salida:", exitData);
        sendEvent('salida', exitData);
    }

    // Add this method to your Game class

    //Use for debugging and testing boss, should be removed in final version
    // Debug function to teleport to a specific level and room
    // Replace the debugTeleport method with this improved version

    debugTeleport(level, room, bossesDefeated = 0) {
        console.log(`DEBUG: Teleporting to Level ${level}, Room ${room}`);
        
        // Hide controls if they're showing
        showControls = false;
        
        // Set progress
        this.progress = {
            visited: room - 1, // Room counter is zero-based internally
            level: level,
            rooms: 4,
            maxLevels: 3
        };
        
        // Update stats to simulate game progress
        this.stats.bossesDefeated = bossesDefeated;
        
        // Clear existing enemies
        this.enemies = [];
        
        // Track room visits
        this.totalRoomsVisited = (level - 1) * 4 + (room - 1);
        
        // Update boss spawned array to allow final boss
        if (bossesDefeated > 0) {
            // Populate bosses array based on how many have been defeated
            this.bossesSpawned = [];
            const bosses = ['wolf', 'skeleton', 'minotaur'];
            for (let i = 0; i < bossesDefeated; i++) {
                if (i < bosses.length) {
                    this.bossesSpawned.push(bosses[i]);
                }
            }
        }

        // Ensure curse bar doesn't kill you immediately
        if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
            curse.width = 100;
            bar.width = 100;
        }
        
        // Reset player health
        this.player.health = this.player.maxHealth;
        if (typeof life !== 'undefined' && typeof lifeBarwidth !== 'undefined') {
            life.width = lifeBarwidth;
        }
        
        // Reset player state
        this.player.attacking = false;
        this.player.moving = false;
        this.player.hasHitEnemy = false;
        this.player.dying = false;
        this.player.finishedDying = false;
        
        // Try to load a specific map for the final boss
        this.usedMaps.clear();
        if (level === 3 && room === 5) {
            // Choose a snow biome for the final boss
            const snowMaps = ['snow1', 'snow2', 'snow3', 'snow4'];
            const randomSnowMap = snowMaps[Math.floor(Math.random() * snowMaps.length)];
            this.mapManager.changeMap(this.assets.maps[randomSnowMap]);
            this.currentBiome = 'snow';
        } else {
            // For other levels, just pick a random map
            this.mapManager.selectRandomMap(null, this.usedMaps);
        }
        
        // Update collision map for the new map
        this.updateCollisionMap();
        
        // Clear and reset game state
        this.inputManager.keysPressed = {}; // Reset input state
        
        // Make sure we're not paused or in game over state
        paused = false;
        gameOver = false;
        
        // Force spawn the boss directly
        if (level === 3 && room === 5) {
            const spawn = this.getValidSpawnPosition(this.collisionMap, this.canvasWidth, this.canvasHeight);
            const boss = new Enemy(spawn, 1, '../sprites/WitchSpriteSheetFINAL.png', 'witch', 'boss', 'snow', 3);
            boss.gameRef = this;
            boss.health = 300;  
            boss.maxHealth = 300;
            boss.attackMagnitude = 0;
            boss.movementFrames = { up: 8, left: 9, down: 10, right: 11 };
            boss.homingAttackRow = { up: 0, left: 1, down: 2, right: 3};
            boss.homingCooldown = 360;
            boss.projectiles = [];
            
            boss.healthBar = new Bar(
                new Vect(boss.position.x, boss.position.y - 10),
                50,
                7,
                "red"
            );
            
            this.enemies.push(boss);
        } else {
            // Normal enemy spawning
            this.spawnEnemiesForRoom();
        }
        
        // Update UI
        const notification = document.createElement('div');
        notification.className = 'debug-notification';
        notification.style.position = 'absolute';
        notification.style.top = '100px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'rgba(0,0,0,0.8)';
        notification.style.color = 'lime';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.textContent = `DEBUG MODE: Level ${level}, Room ${room}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        return "Teleported successfully!";
    }

// === Main Game Loop ===
// this function runs every frame to handle logic, input, drawing, combat, death, etc.
loop() {
    this.stats.runTime++; // count how many frames have passed since the run started
    
    if (this.firstLoopIteration === undefined) {
        this.firstLoopIteration = true;
        
        // Check if this is a new game that should have default curse values
        if (localStorage.getItem("resetCurseBonus") === "true") {
            console.log("First loop iteration with resetCurseBonus flag - ensuring proper curse values");
            // Force reset of curse bar
            if (typeof bar !== 'undefined' && typeof curse !== 'undefined') {
                barwidth = 100;  // Reset the base variables too
                cursewidth = 100;
                bar.width = 100;
                curse.width = 100;
            }
        }
    }

    if (paused) return; // if the game is paused, stop here
    if (gameOver) return; // if the game is over, stop here

    // === Draw Background and Portal ===
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear the canvas so nothing overlaps
    this.ctx.drawImage(this.assets.backgroundImage, 0, 0); // redraw the room´s background
    this.portal.draw(this.ctx); // draw the portal (wether it´s active or not)

    // === Draw Controls Image ===
    if (showControls) {
        this.ctx.drawImage(controls, 10, 1, 425, 325); // show the instructions if the flag is true
    }

    // === Sign to Indicate Next Level ===
    this.ctx.drawImage(sign_level, this.canvasWidth - 100, 350, 75, 75); // draw the sign graphic to hint there's a level transition

    // === Handle Player Movement and Input ===
    this.player.handleInput(
        //this.ambienceSound.play(),
        this.inputManager.keysPressed, // keys currently pressed
        this.assets.keyMap, // key bindings
        this.collisionMap, // for collision detection
        this.player.clampToBounds(this.canvasWidth, this.canvasHeight) // prevent player from going off-screen
    );

    // == Handle curse bar logic ==
    if (typeof curse !== 'undefined' && typeof bar !== 'undefined') {
        const curseValue = Math.round((curse.width / barwidth) * 100);
        localStorage.setItem('curseValue', curseValue.toString());
        
        if (curse.width <= 0 && !this.player.dying) {
            localStorage.setItem('curseValue', '0');
            
            if (!this.deathRegistered) {
                this.updateGameState();
            }
        }
    }

    // === Healer Logic === 
    if (this.healer) {
        const playerInRange = this.healer.checkPlayerInRange(this.player); // is the player close enough to heal?
        const interacted = this.healer.interact(this.player, this.inputManager.keysPressed); // did the player press 'f'?

        if (typeof interacted !== 'undefined' && interacted) {
            // if healing happens, immediately update health bar´s width
            life.width = (this.player.health / this.player.maxHealth) * lifeBarwidth;
            if (life.width > lifeBarwidth) life.width = lifeBarwidth; // clamp max width
            this.recordObjectFound('curandero');
        }

        // Update healer state, animate it, and draw it with prompt if player is nearby
        this.healer.update();
        this.healer.updateAnimation(this.npcFrame, this.staggerFrames);
        this.healer.draw(this.ctx);
        this.healer.drawInteractionPrompt(this.ctx, playerInRange);
    }

    // === Gunsmith Logic ===
    if (this.gunsmith) {
        this.gunsmith.updateAnimation(this.gameFrame, this.staggerFrames);
        const playerInRange = this.gunsmith.checkPlayerInRange(this.player);
        const interacted = this.gunsmith.interact(this.player, this.inputManager.keysPressed);

        if (interacted) {
            //console.log("Gunsmith Interaction Success!");
            this.recordObjectFound('armero');
        }

        this.gunsmith.updateAnimation(this.npcFrame, this.staggerFrames);
        this.gunsmith.draw(this.ctx);
        this.gunsmith.drawInteractionPrompt(this.ctx, playerInRange);
    }
    

    // === Chest Logic ===
    if (this.chest) {
        this.chest.updateAnimation(this.npcFrame, this.staggerFrames);
        const playerInRange = this.chest.checkPlayerInRange(this.player);
        let interacted = false; // Define interacted before use
        if (typeof interacted !== 'undefined' && interacted) {
            this.recordObjectFound('ninguno');
        }
    
        this.chest.interact(this.player, this.inputManager.keysPressed);
        this.chest.draw(this.ctx);
        this.chest.drawInteractionPrompt(this.ctx, playerInRange);
    }
    
    
    // === Player Logic ===
    this.player.updateAnimation(this.gameFrame, this.staggerFrames); // update payer´s animation

    // === Draw Player Arrows ===
    // Arrow Function used, retrieved from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    this.player.arrows.forEach(arrow => {
        arrow.update(); // move the arrow forward
        arrow.draw(this.ctx); // render it on screen
    });

    // === Projectile vs Enemy Collision Detection ===
    // Arrow Function used, retrieved from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    this.enemies.forEach((enemy, enemyIndex) => {
        this.player.projectiles.forEach((projectile, projectileIndex) => {
            // define projectile hitbox
            const projBox = {
                x: projectile.position.x,
                y: projectile.position.y,
                width: projectile.width,
                height: projectile.height
            };
    
            // define enemy hitbox
            const enemyBox = {
                x: enemy.position.x,
                y: enemy.position.y,
                width: enemy.width,
                height: enemy.height
            };
            
            // AABB collision check
            const isColliding =
            projBox.x < enemyBox.x + enemyBox.width &&
            projBox.x + projBox.width > enemyBox.x &&
            projBox.y < enemyBox.y + enemyBox.height &&
            projBox.y + projBox.height > enemyBox.y;
    
            if (isColliding) {
                // damage based on projectile type
                if (projectile instanceof Arrow) {
                    enemy.health -= projectile.damage;
                } 
                if (projectile instanceof Fireball) {
                    enemy.health -= projectile.damage;
                }
    
                this.player.projectiles.splice(projectileIndex, 1); // remove the projectile on hit
            }
        });
    });

    // === Clean Up Expired Projectiles ===
    this.player.projectiles = this.player.projectiles.filter(a => !a.isExpired()); // remove arrows/fireballs that have exceeded their lifetime or hit something

    // === Draw Player ===
    this.player.draw(this.ctx); // render the player (after movement and attack logic has been processed)

    // === Early Exit if Player is Dead ===
    if (this.player.dying && this.player.finishedDying) {
        return; // skip all enemy logic if the player has finished dying animation
    }

    // === Handle Each Enemy ===
    this.enemies.forEach((enemy, i) => {
        enemy.moveToward(this.player); // enemy AI: move toward the player
        enemy.updateAnimation(this.player, this.enemyFrame, this.staggerFrames); // animate enemy frames

        this.enemies.forEach(enemy => {
            if (enemy.projectiles) {
                enemy.projectiles.forEach(projectile => {
                    projectile.update();
        
                    if (projectile instanceof HomingOrb) {
                        const isOverlapping = (obj1, obj2) => {
                            return obj1.position.x < obj2.position.x + obj2.width &&
                                   obj1.position.x + obj1.width > obj2.position.x &&
                                   obj1.position.y < obj2.position.y + obj2.height &&
                                   obj1.position.y + obj1.height > obj2.position.y;
                        };
                        if (isOverlapping(projectile, this.player)) {
                            this.player.health -= 10; // damage done by the homing orb

                            // Update life bar
                            life.width = (this.player.health / this.player.maxHealth) * lifeBarwidth;
                            if (life.width <= 0) life.width = 0;

                            // === Flash Screen Red ===
                            this.flashScreen = true;
                            setTimeout(() => { this.flashScreen = false; }, 150);

                            if (this.player.health <= 0 && !this.player.dying) {
                                this.player.startDeath();
                                if (!this.deathRegistered) {
                                    //this.deathRegistered = true;
                                    this.registerDeathEvent('muerteVida');
                                }
                                
                                gameOver = true;
                            }
                            projectile.life = 0; // delete projectile
                        }
                    }
                });
        
                enemy.projectiles = enemy.projectiles.filter(p => p.isAlive());
            }
        });
        

        // === Define Hitboxes for Collision ===
        const playerBox = {
            x: this.player.position.x,
            y: this.player.position.y,
            width: this.player.width,
            height: this.player.height
        };
        const enemyBox = {
            x: enemy.position.x,
            y: enemy.position.y,
            width: enemy.width,
            height: enemy.height
        };

        //  === Axis Alligned Bounding Box ===
        // AABB used, retrieved from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        const isOverlapping =
            playerBox.x < enemyBox.x + enemyBox.width &&
            playerBox.x + playerBox.width > enemyBox.x &&
            playerBox.y < enemyBox.y + enemyBox.height &&
            playerBox.y + playerBox.height > enemyBox.y;

        // === Distance Between Player and Enemy ===
        const dx = enemy.position.x - this.player.position.x;
        const dy = enemy.position.y - this.player.position.y;

        // Math.sqrt(dx*dx + dy*dy): calculates distance between player and enemy
        const distance = Math.sqrt(dx * dx + dy * dy);

        // === Check if Player Is Within Enemy's Attack Range ===
        const inAttackRange = distance < (enemy.attackRange || 28); // use enemy.attackRange or default to 28

        if (isOverlapping) {
            // === Enemy Attacks Player ===
            if (!enemy.hasHitPlayer) {
                enemy.attacking = true;
                enemy.attackTimer = 30;
                enemy.hasHitPlayer = true;

                // Delay damage to match attack animation timing (300ms)
                setTimeout(() => {
                    const stillOverlapping =
                        playerBox.x < enemyBox.x + enemyBox.width &&
                        playerBox.x + playerBox.width > enemyBox.x &&
                        playerBox.y < enemyBox.y + enemyBox.height &&
                        playerBox.y + playerBox.height > enemyBox.y;

                        const distanceNow = Math.hypot(
                            enemy.position.x - this.player.position.x,
                            enemy.position.y - this.player.position.y
                        );
                        
                        const range = enemy.attackRange || 40;
                        // === Deal Damage ===
                        if (distanceNow < range) {
                            this.player.health -= enemy.attackMagnitude;
                        
                            // === Update Life Bar ===
                            life.width = (this.player.health / this.player.maxHealth) * lifeBarwidth;
                            if (life.width <= 0) life.width = 0;
                        
                            // === Trigger Death If Health <= 0 ===
                            if (this.player.health <= 0 && !this.player.dying) {
                                this.player.startDeath(); // start death animation and logic
                                if (!this.deathRegistered) {
                                    this.registerDeathEvent('muerteVida');
                                }
                            }
                            
                            // === Flash Screen Red ===
                            this.flashScreen = true;
                            setTimeout(() => { this.flashScreen = false; }, 150); // turn off red flash after 150ms
                        }

                    enemy.attacking = false; // reset attack state
                }, 300);

                // === Attack Cooldown: Prevent Multiple Hits in a Row ===
                setTimeout(() => {
                    enemy.hasHitPlayer = false;
                }, 1000);
            }
        
            // === Prevent Overlap (Push Player and Enemy Apart) ===
            const dx = enemy.position.x - this.player.position.x;
            const dy = enemy.position.y - this.player.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const overlap = 32 - distance; // 32 is the intended separation distance

            if (overlap > 0) {
                const pushX = (dx / distance) * (overlap / 2); // split push between both
                const pushY = (dy / distance) * (overlap / 2);
            
            // only move the player if the next tile is not blocked
            const nextPlayerX = this.player.position.x - pushX;
            const nextPlayerY = this.player.position.y - pushY;

            const willCollideWithStatic = (x, y) => {
                return this.staticObjects.some(obj => {
                    return (
                        x < obj.position.x + obj.width &&
                        x + this.player.width > obj.position.x &&
                        y < obj.position.y + obj.height &&
                        y + this.player.height > obj.position.y
                    );
                });
            };
            
            if (!this.collisionMap.isBlockedPixel(nextPlayerX, this.player.position.y) &&
                !willCollideWithStatic(nextPlayerX, this.player.position.y)) {
                this.player.position.x = nextPlayerX;
            }
            
            if (!this.collisionMap.isBlockedPixel(this.player.position.x, nextPlayerY) &&
                !willCollideWithStatic(this.player.position.x, nextPlayerY)) {
                this.player.position.y = nextPlayerY;
            }
            

                // Always move the enemy (no block check for them)
                enemy.position.x += pushX;
                enemy.position.y += pushY;
            }

            // === Player Attacks Enemy ===
            if (this.player.attacking && !this.player.hasHitEnemy) {
                enemy.health -= this.player.attackMagnitude; // deal damage to the enemy
                this.player.hasHitEnemy = true; // mark that the attack already landed

                // reset attack state after 400ms (cooldown for melee hits)
                setTimeout(() => {
                    this.player.hasHitEnemy = false;
                }, 1000); // attack cooldown
            }
        }

        // === Enemy Dies ===
        if (enemy.health <= 0) {
            // === Boss-Specific Death Logic ===
            if (enemy.variant === 'boss') {
                let currentBonus = parseInt(localStorage.getItem("curseBonus")) || 0;
            
                // Solo extender si llevamos menos de 3 mejoras
                if (currentBonus < 60) {
                    currentBonus += 20;
                    localStorage.setItem("curseBonus", currentBonus);
            
                    bar.width += 20;
                    curse.width += 20;
            
                    if (bar.width > 200) bar.width = 200;
                    if (curse.width > bar.width) curse.width = bar.width;
                }
            }            

            // === Score Assignment Based on Variant and Level ===
            let points = 0;

            if (enemy.variant === 'boss') {
                // Update stats
                this.stats.bossesDefeated++;
                
                // Get current bonus or initialize
                const currentBonus = parseInt(localStorage.getItem("curseBonus") || "0");
                
                // Add 20 points for each boss defeat
                localStorage.setItem("curseBonus", currentBonus + 20);
                
                // If there's still a curse bar, increase it directly
                if (typeof bar !== 'undefined' && typeof curse !== 'undefined') {
                    bar.width += 20;
                    curse.width += 20;
                    
                    // Cap the maximum bar size
                    if (bar.width > 200) bar.width = 200;
                    if (curse.width > bar.width) curse.width = bar.width;
                }
                
                if (this.progress.level === 1) {
                    points = 100;
                } else if (this.progress.level === 2) {
                    points = 125;
                } else {
                    points = 150;
                }
            } else if (enemy.variant === 'strong') {
                if (this.progress.level === 1) {
                    points = 30;
                } else if (this.progress.level === 2) {
                    points = 40;
                } else {
                    points = 50;
                }
            } else {
                if (this.progress.level === 1) {
                    points = 10;
                } else if (this.progress.level === 2) {
                    points = 20;
                } else {
                    points = 30;
                }
            }

            this.score += points; // add score to current run

            // === Stats Tracker ===
            if (enemy.health <= 0) {
                if (enemy.variant === 'boss') {
                    this.stats.bossesDefeated++; // track bosses killed
                } else if (enemy.variant === 'strong') {
                    this.stats.strongEnemiesDefeated++; // track strong enemies killed
                } else {
                    this.stats.weakEnemiesDefeated++; // track weak enemies killed
                }
            }            
            
            // === Remove Dead Enemy from the Array ===
            this.enemies.splice(i, 1);
        }

        // === Activate Portal When All Enemies Are Gone ===
        if (this.enemies.length === 0 && !this.portal.active) {
            this.portal.active = true; // enable portal so player can move to the next room
        }

        // === Draw Enemy ===
        enemy.draw(this.ctx); // draw the enemy at their current position with current frame

        // === Draw Enemy Health Bar ===
        if (enemy.healthBar) {
            // reposition health bar to be centered above the enemy
            enemy.healthBar.position.x = enemy.position.x + (enemy.width / 2) - (enemy.healthBar.width / 2) - 23;
            enemy.healthBar.position.y = enemy.position.y - 50;
        
            // adjust the bar width to match enemy's current health
            enemy.healthBar.width = (enemy.health / enemy.maxHealth) * 30;  // or 50 for wolf
            if (enemy.healthBar.width < 0) enemy.healthBar.width = 0; // prevent negative width
        
            // draw the health bar
            enemy.healthBar.draw(this.ctx);
        }

        // === Draw Secondary Weapon Box (Bottom Left HUD) ===
        this.ctx.drawImage(itemBox, 40, this.canvasHeight - 110, 70, 70); // siempre dibujar la caja

        // === Draw Pending Icon if exists ===
        if (this.player.pendingIcon) {
            const pendingIcon = weaponIcons[this.player.pendingIcon];
            if (pendingIcon) {
                this.ctx.drawImage(pendingIcon, 50, this.canvasHeight - 100, 50, 50); // dibujar icono normal
            }
        }

});

    // === Portal Teleportation and Level Transition ===
    this.portal.checkCollision(
        this.player, // the player who can collide with the portal
        this.assets.maps, // maps available for transition
        this.progress, // track level and room number
        this.assets.backgroundImage, // new background image to draw
        
        () => { // === onRoomChange Callback (when portal is used to change rooms) ===    
            // Calls centralized function to change room
            this.onPortalTriggered();
        },
        // === onNewLevel Callback (when progressing to next level) ===
        () => this.onNewLevel()
    );

    this.npcFrame++; // advance frame counter for NPC animations

    if (this.player.moving || this.player.attacking) {
        this.gameFrame++; // advance player frames only if moving or attacking
    }

    // === Draw Secondary Weapon Box (Bottom Left HUD) ===
    this.ctx.drawImage(itemBox, 40, this.canvasHeight - 110, 70, 70); // siempre dibujar la caja

    // Mostrar arma pendiente si existe
    if (this.player.pendingIcon) {
        const pendingIcon = weaponIcons[this.player.pendingIcon];
        if (pendingIcon) {
            this.ctx.drawImage(pendingIcon, 50, this.canvasHeight - 100, 50, 50); // ícono pendiente (más pequeño)
        }
    } 
    // Si no hay arma pendiente, mostrar la activa
    else if (this.player.secondaryWeapon) {
        const activeIcon = activeWeaponIcons[this.player.secondaryWeapon];
        if (activeIcon) {
            this.ctx.drawImage(activeIcon, 40, this.canvasHeight - 110, 70, 70); // ícono de arma activa
        }
    }

    
    // === Draw UI Bars ===
    bar.draw(this.ctx); // outer curse bar (total possible time)
    curse.draw(this.ctx); // current fill (remaining time)
    this.ctx.drawImage(curseLogo, 625, 55, 20, 20); // curse icon on top

    lifeBar.draw(this.ctx); // outer health bar
    life.draw(this.ctx); // current fill (player HP)
    this.ctx.drawImage(lifeLogo, 623, 25, 25, 25); // heart icon on top

    // === Draw Score ====
    this.ctx.font = "18px monospace";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Puntaje: ${this.score}`, 30, 50); // top-left corner


    // === Curse Bar Update ===
    curse.update(); // decrease width over time (countdown mechanic)
    curse.colorTransition(); // animate color change as it goes down

    // if time runs out and player isn't already dying, kill them
    if (curse.width <= 0 && !this.player.dying) {
        localStorage.setItem('curseValue', '0');
        this.player.startDeath();
        
        // Registrar death from curse event
        if (!this.deathRegistered) {
            //this.deathRegistered = true;
            this.registerDeathEvent('muerteMaldicion');

            const formatTime = (ms) => {
                const horas = Math.floor(ms / 3600000);
                const minutos = Math.floor((ms % 3600000) / 60000);
                const segundos = Math.floor((ms % 60000) / 1000);
                return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            };
        
            const { BIOME_MAPPINGS } = window.TCR_CONSTANTS || {};
            
            const matchID = localStorage.getItem('currentPartidaId');
            if (matchID) {
                const actualHealth = this.player?.health || 0;

                const dataEvent = {
                    id_partida: matchID,
                    eventoTrigger: 'muerteMaldicion',
                    claseElegida: localStorage.getItem('playerClass') || 'guerrero',
                    tiempoPartida: this.elapsedTime ? formatTime(this.elapsedTime) : '00:00:00',
                    puntuacion: this.score || 0,
                    nivelActual: this.progress?.level || 1,
                    salaActual: this.totalRoomsVisited + 1, //this.progress?.visited || 1,
                    biomaActual: BIOME_MAPPINGS?.[this.currentBiome] || 'bosque',
                    rankM: 0, // Forzar valor a 0
                    vida: actualHealth,
                    enemigosCDerrotados: this.stats?.weakEnemiesDefeated || 0,
                    enemigosFDerrotados: this.stats?.strongEnemiesDefeated || 0,
                    jefesDerrotados: this.stats?.bossesDefeated || 0,
                    objetosEncontrados: this.lastObjectFound || 'ninguno'
                };
                
                sendEvent('muerteMaldicion', dataEvent);
                //console.log("Muerte por maldición registrada con rankM=0 usando enviarEvento");
            }
        }
    }
    
    // === Final Frame and Loop Call ===
    if (!paused && !gameOver) {
        if (this.flashScreen) {

            // red flash when damaged
            this.ctx.save();
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.restore();
        }       

        // Update time
        this.elapsedTime = Date.now() - this.startTime;
        
        try {
            // Update game state
            this.updateGameState();
        } catch (e) {
            console.error("Error en updateGameState:", e);
        }


        // === Keep the Game Running ===
        window.animationFrame = requestAnimationFrame(() => this.loop()); // call next frame
        this.enemyFrame++; // advance enemy animation frames
    }
}

getEnemySpritePath(type, variant) {
    const spriteMap = {
        goblin: {
            weak: '../sprites/Goblin02SpriteSheetFINAL.png',
            strong: '../sprites/Goblin01SpriteSheetFINAL.png'
        },
        wolf: {
            boss: '../sprites/WolfSpriteSheetFINAL.png'
        },
        skeleton: {
            weak: '../sprites/Skeleton01SpriteSheetFINAL.png',
            semi: '../sprites/Skeleton02SpriteSheetFINAL.png',
            strong: '../sprites/Skeleton03SpriteSheetFINAL.png',
            boss: '../sprites/Skeleton03SpriteSheetFINAL.png'
        },
        lizard: {
            weak: '../sprites/Lizard02SpriteSheetFINAL.png',
            strong: '../sprites/Lizard01SpriteSheetFINAL.png'
        },
        minotaur: {
            boss: '../sprites/MinotaurSpriteSheetFINAL.png'
        },
        witch: {
            boss: '../sprites/WitchSpriteSheetFINAL.png'
        }
    };

    // Safe fallback just in case
    if (spriteMap[type] && spriteMap[type][variant]) {
        return spriteMap[type][variant];
    }

    return this.assets.enemyImagePath;
}

getCurseRank() {
    const bosses = this.stats.bossesDefeated;
    if (bosses >= 3) return "III"; // final curse rank
    if (bosses >= 2) return "II";  // mid-rank
    return "I"; // default
}
}

// Debugging: Should be erased for final version
// Global function for easy console access
window.debugTeleport = function(level, room, bossesDefeated) {
    if (window.game && typeof window.game.debugTeleport === 'function') {
        return window.game.debugTeleport(level, room, bossesDefeated);
    } else {
        console.error("Game object not available or debugTeleport function not defined!");
        return false;
    }
};

function getEnemyHP(type, variant, level) {
    // boss type enemies
    if (variant === 'boss') {
        // Boss HP scaling
        if (level === 1) {
            return 1000;
        } else if (level === 2) {
            return 1500;
        } else {
            return 2000;
        }
    }

    // strong enemies
    if (variant === 'strong') {
        if (level === 1) {
            return 200;
        } else if (level === 2) {
            return 350;
        } else {
            return 500;
        }
    }

    // weak enemies
    if (level === 1) {
        return 70;
    } else if (level === 2) {
        return 100;
    } else {
        return 150;
    }
}
