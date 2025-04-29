// === Gunsmith Class ===
class Gunsmith extends AnimatedObject {
    constructor(position, spritePath) {
        super(position, 64, 65, 'rgba(0,0,0,0)', 'gunsmith', 1); // Assuming 4 frames or adjust accordingly

        this.active = true;
        this.interactionRadius = 50;
        this.interactionKey = 'f';
        this.interactionMessage = "Presiona f para interactuar";

        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });

        this.idleRow = 0; // Row of the sprite for idle
    }

    checkPlayerInRange(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= this.interactionRadius;
    }

    interact(player, keysPressed) {
        if (!this.active || this.opened) return false;
    
        if (keysPressed[this.interactionKey] && this.checkPlayerInRange(player)) {
            this.opened = true;
            console.log("Player opened the chest!");
            grantRandomWeapon(player);
            return true;
        }
    
        return false;
    }
    

    updateAnimation(gameFrame, staggerFrames) {
        this.spriteRect.y = this.idleRow;
        this.spriteRect.x = 0;
    }

    drawInteractionPrompt(ctx, playerInRange) {
        if (!this.active || !playerInRange) return;

        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.interactionMessage, 
            this.position.x + this.width / 2,  // Horizontal center
            this.position.y - 43               // Vertical height above head
         );
    }
}

function grantRandomWeapon(player) {
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
