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
        if (this.active && keysPressed[this.interactionKey] && this.checkPlayerInRange(player)) {
            console.log("Player interacted with the Gunsmith!");
            this.active = false; // Disable further interaction
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
