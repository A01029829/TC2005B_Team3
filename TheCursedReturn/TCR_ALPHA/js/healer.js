// === Healer Class ===
// interactive object that heals the player when they interact with it
class Healer extends AnimatedObject {
    constructor(position, spritePath) {
        // base setup — position, width, height, transparent color, label, frame count
        super(position, 64, 65, 'rgba(0,0,0,0)', 'healer', 8);
        
        // === Healer properties ===
        this.active = true; // can the healer be interacted with right now?
        this.healAmount = 5; // amount of health to restore per interaction
        this.interactionRadius = 50; // distance required to trigger interaction
        this.interactionKey = 'f'; // ket to press for interaction
        this.interactionMessage = "Presiona f para curarte"; // message displayed to the player
        
        // === Healing state ===
        this.healing = false; // is the healer currently healing the player?
        this.healingTimer = 0; // timer for the healing animation
        this.healingDuration = 30; // total duration of the healing state (in frames)
        this.cooldown = false; // is the healer on cooldown?
        this.cooldownTimer = 0; // timer for cooldown after healing
        this.cooldownDuration = 300; // total cooldown duration before healer can heal again
        
        // === Sprite setup ===
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 }); // set initial frame
        
        // === Animation rows ===
        this.idleRow = 2;  // row used when idle
        this.healRow = 2;  // row used when healing 
    }
    
    // === Check if player is close enough to interact ===
    checkPlayerInRange(player) {
        if (!this.active) return false; // skip check if not active
        
        const dx = player.position.x - this.position.x; // horizontal distance
        const dy = player.position.y - this.position.y; // vertical distance
        const distance = Math.sqrt(dx * dx + dy * dy); // pythagorean distance

        return distance <= this.interactionRadius; // return true if within radius
    }
    
    // === Handle player interaction ===
    interact(player, keysPressed) {
        if (!this.active || this.cooldown) return false; // don't interact if on cooldown or inactive
        
        // if player presses the correct key and is in range
        if (this.active && keysPressed[this.interactionKey] && this.checkPlayerInRange(player)) {
            this.healing = true;  // start healing animation
            this.healingTimer = this.healingDuration; // set animation duration
            
            // heal the player, but don't go over max health
            const newHealth = Math.min(player.health + this.healAmount, player.maxHealth);
            player.health = newHealth;
            
            this.active = false; // prevent further interaction during healing
            return true; // interaction was successful
        }
        
        return false;
    }
    
    // === Update healing and cooldown timers ===
    update() {
        // === Healing logic ===
        if (this.healing) {
            this.healingTimer--; // count down the healing animation
            
            if (this.healingTimer <= 0) {
                this.healing = false; // stop healing animation
                this.cooldown = true; // start cooldown
                this.cooldownTimer = this.cooldownDuration; // reset cooldown timer
            }
        }
        
         // === Cooldown logic ===
        if (this.cooldown) {
            this.cooldownTimer--; // count down cooldown

            
            if (this.cooldownTimer <= 0) {
                this.cooldown = false; // healer can be used again
            }
        }
    }
    
    // === Update healer animation ===
    updateAnimation(gameFrame, staggerFrames) { // select correct animation row based on state
        if (this.healing) {
            this.spriteRect.y = this.healRow;
        } else {
            this.spriteRect.y = this.idleRow;
        }
        
        // change frame every few game frames (slows animation)
        const totalFrames = 5;
        if (this.healing) {
            this.spriteRect.y = this.healRow;
        } else {
            this.spriteRect.y = this.idleRow;
        }        
        this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;        
    }
    
    // === Draw 'Press F' prompt above the healer ===
    drawInteractionPrompt(ctx, playerInRange) {
        // nly draw the prompt if the healer is active, not on cooldown, and player is nearby
        if (!this.active || this.cooldown || !playerInRange) return;
        
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        
        ctx.fillText( // display the message slightly above the healer
            this.interactionMessage, 
            this.position.x + this.width / 2,  // center horizontally
            this.position.y - 40               // raise above the sprite
         );
    }
}