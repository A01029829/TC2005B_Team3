// === Chest Class ===
class Chest extends AnimatedObject {
   constructor(position, spritePath) {
       super(position, 64, 65, 'rgba(0,0,0,0)', 'chest', 2); // 2 frames: closed & open

       this.active = true;
       this.opened = false;
       this.interactionRadius = 50;
       this.interactionKey = 'f';
       this.interactionMessage = "Presiona f para abrir";

       this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });
       this.idleRow = 0;
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

           return true;
       }

       return false;
   }

   updateAnimation(gameFrame, staggerFrames) {
       // Frame 0 = closed | Frame 1 = opened
       this.spriteRect.y = this.idleRow;
       this.spriteRect.x = this.opened ? 1 : 0;
   }

   drawInteractionPrompt(ctx, playerInRange) {
       if (!this.active || this.opened || !playerInRange) return;

       ctx.font = '12px Arial';
       ctx.fillStyle = 'white';
       ctx.textAlign = 'center';

       ctx.fillText(
        this.interactionMessage, 
        this.position.x + this.width / 2,  // Horizontal center
        this.position.y - 40               // Vertical height above head
     );
   }
}
