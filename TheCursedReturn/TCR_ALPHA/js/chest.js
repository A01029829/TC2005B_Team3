// === Chest Class ===
// handles chest behavior, interaction, and animation
class Chest extends AnimatedObject {
   constructor(position, spritePath) {
       super(position, 64, 65, 'rgba(0,0,0,0)', 'chest', 2); // calls the AnimatedObject constructor with 2 animation frames (closed/open)

       this.active = true; // can rhe player still interact with it?
       this.opened = false; // has the chest been open yet?
       this.interactionRadius = 50; // distance from which player can interact
       this.interactionKey = 'f'; // key to open the chest
       this.interactionMessage = "Presiona f para abrir"; // text to display

       this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // assign sprite and frame size
       this.idleRow = 0; // only one row of animation (row 0)
   }

    // === Check if Player Is Close Enough to Interact ===
   checkPlayerInRange(player) {
       const dx = player.position.x - this.position.x;
       const dy = player.position.y - this.position.y;
       const distance = Math.sqrt(dx * dx + dy * dy);

       return distance <= this.interactionRadius;
   }

    // === Interact Logic ===
   interact(player, keysPressed) {
    if (this.active && keysPressed[this.interactionKey] && this.checkPlayerInRange(player)) {
        grantRandomWeapon(player); // give player a weapon
        this.opened = true; // mark chest as opened
        this.active = false; // disable further interaction
        return true;
    }

    return false; // nothing happened
}

    // === Update Animation Frame Based on Open State ===
   updateAnimation(gameFrame, staggerFrames) {
       // Frame 0 = closed | Frame 1 = opened
       this.spriteRect.y = this.idleRow;
       if (this.opened) { // show open frame if opened, else closed
        this.spriteRect.x = 1;
    } else {
        this.spriteRect.x = 0;
    }
   }

    // === Show 'Press F' Prompt ===
   drawInteractionPrompt(ctx, playerInRange) {
       if (!this.active || this.opened || !playerInRange) return; // only show if the chest is unopened, active, and player is close

       ctx.font = '12px Arial';
       ctx.fillStyle = 'white';
       ctx.textAlign = 'center';

       ctx.fillText(
        this.interactionMessage, 
        this.position.x + this.width / 2,  // horizontal center
        this.position.y - 40               // vertical height above head
     );
   }
}

// === Grant a Random Secondary Weapon to the Player ===
function grantRandomWeapon(player) {
    if (player.pendingWeapon) {
        console.log("Player already has a pending weapon, ignoring new weapon");
        return; // No sobreescribir si ya hay un arma pendiente
    }

    const weapons = ['dagger', 'spear', 'crossbow', 'waraxe'];
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];

    let spritePath;
    if (player.classType === 'knight') {
        spritePath = '../sprites/KnightSecondaryWeapons.png';
    } else if (player.classType === 'archer') {
        spritePath = '../sprites/ArcherSecondaryWeapons.png';
    } else if (player.classType === 'wizard') {
        spritePath = '../sprites/WizardSecondaryWeapons.png';
    }

    let movementFrames, attackRow;

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

    player.pendingWeapon = {
        name: weapon,
        spritePath: spritePath,
        movementFrames: movementFrames,
        attackRow: attackRow
    };
    player.pendingIcon = weapon;

    console.log(`Player found a secondary weapon: ${weapon}`);
}
