// === Gunsmith Class ===
// interactive object that gives the player a random secondary weapon
class Gunsmith extends AnimatedObject {
    constructor(position, spritePath) {
        // base setup — position, width, height, transparent color, label, frame count
        super(position, 64, 65, 'rgba(0,0,0,0)', 'gunsmith', 1);

        // === Gunsmith properties ===
        this.active = true; // can the gunsmith be interacted with?
        this.interactionRadius = 50; // distance required to trigger interaction
        this.interactionKey = 'f'; // key to press for interaction
        this.interactionMessage = "Presiona f para interactuar"; // message displayed to the player

        // === Sprite setup ===
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // set initial frame

        // === Animation rows ===
        this.idleRow = 0; // row used when idle
    }

    // === Check if player is close enough to interact ===
    checkPlayerInRange(player) {
        const dx = player.position.x - this.position.x; // horizontal distance
        const dy = player.position.y - this.position.y; // vertical distance
        const distance = Math.sqrt(dx * dx + dy * dy); // pythagorean distance

        return distance <= this.interactionRadius; // return true if within radius
    }

    // === Handle player interaction ===
    interact(player, keysPressed) {
        if (!this.active || this.opened) return false; // skip if inactive or already opened
    
        // if player presses the correct key and is in range
        if (keysPressed[this.interactionKey] && this.checkPlayerInRange(player)) {
            this.opened = true; // mark as opened to prevent re-use
            console.log("Player opened the chest!"); // debug message
            grantRandomWeapon(player); // give a random weapon
            gunsmithSound.play(); // play interaction sound
            return true; // interaction was successful
        }
    
        return false;
    }
    
    // === Update gunsmith animation ===
    updateAnimation(gameFrame, staggerFrames) {
        this.spriteRect.y = this.idleRow; // set to idle row
        this.spriteRect.x = 0; // static frame (no animation)
    }

    // === Draw 'Press F' prompt above the gunsmith ===
    drawInteractionPrompt(ctx, playerInRange) {
        // only draw the prompt if active and player is nearby
        if (!this.active || !playerInRange) return;

        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.interactionMessage, 
            this.position.x + this.width / 2,  // center horizontally
            this.position.y - 43               // raise above the sprite
         );
    }
}

// === Grant a random secondary weapon to the player ===
function grantRandomWeapon(player) {
    // check if player already has a pending weapon
    if (player.pendingWeapon) {
        console.log("Player already has a pending weapon, ignoring new weapon");
        return;
    }

    if (player.secondaryWeapon !== null) {
        player.secondaryWeapon = null;
        localStorage.removeItem("secondaryWeapon");
        localStorage.removeItem("secondaryWeaponSprite");
        localStorage.removeItem("secondaryWeaponMovementFrames");
        localStorage.removeItem("secondaryWeaponAttackRow");
    }

    const weapons = ['dagger', 'spear', 'crossbow', 'waraxe']; // list of possible weapons
    const weapon = weapons[Math.floor(Math.random() * weapons.length)]; // pick random weapon

    let spritePath;
    // set correct sprite sheet based on player class
    if (player.classType === 'knight') {
        spritePath = '../sprites/KnightSecondaryWeapons.png';
    } else if (player.classType === 'archer') {
        spritePath = '../sprites/ArcherSecondaryWeapons.png';
    } else if (player.classType === 'wizard') {
        spritePath = '../sprites/WizardSecondaryWeapons.png';
    }

    let movementFrames, attackRow;

    // assign movement and attack frames depending on weapon type
    if (weapon === 'crossbow') {
        movementFrames = { up: 4, left: 5, down: 6, right: 7 };
        attackRow = { up: 0, left: 1, down: 2, right: 3 };
    } else if (weapon === 'dagger') {
        movementFrames = { up: 8, left: 9, down: 10, right: 11 };
        attackRow = { up: 12, left: 13, down: 14, right: 15 };
    } else if (weapon === 'waraxe') {
        movementFrames = { up: 16, left: 17, down: 18, right: 19 };
        attackRow = { up: 20, left: 21, down: 22, right: 23 };
    } else if (weapon === 'spear') {
        movementFrames = { up: 28, left: 29, down: 30, right: 31 };
        attackRow = { up: 24, left: 25, down: 26, right: 27 };
    }

    // assign weapon details to player
    player.pendingWeapon = {
        name: weapon,
        spritePath: spritePath,
        movementFrames: movementFrames,
        attackRow: attackRow
    };
    player.pendingIcon = weapon; // store weapon icon

    console.log(`Player found a secondary weapon: ${weapon}`); // debug log
}
