// === Healer Class ===
// objeto interactivo que cura al jugador cuando interactúa con él
class Healer extends AnimatedObject {
    constructor(position, spritePath) {
        // Base setup - ajusta el tamaño según tu sprite
        super(position, 64, 65, 'rgba(0,0,0,0)', 'healer', 8);
        
        // Configuración específica
        this.active = true; // Si está disponible para interactuar
        this.healAmount = 5; // Cantidad de vida que restaura
        this.interactionRadius = 50; // Radio para detectar al jugador
        this.interactionKey = 'f'; // Tecla para interactuar
        this.interactionMessage = "Presiona f para curarte";
        
        // Animación
        this.healing = false;
        this.healingTimer = 0;
        this.healingDuration = 30; // Duración de la animación de curación
        this.cooldown = false;
        this.cooldownTimer = 0;
        this.cooldownDuration = 300; // Tiempo antes de poder curar de nuevo
        
        // Configurar sprite
        this.setSprite(spritePath, { x: 0, y: 0, width: 64, height: 65 });
        
        // Filas de animación (ajustar según tu spritesheet)
        this.idleRow = 2;  // Fila para animación en reposo
        this.healRow = 2;  // Fila para animación de curación
    }
    
    // Verifica si el jugador está dentro del radio de interacción
    checkPlayerInRange(player) {
        if (!this.active) return false;
        
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= this.interactionRadius;
    }
    
    // Procesa la interacción del jugador
    interact(player, keysPressed) {
        if (!this.active || this.cooldown) return false;
        
        if (keysPressed[this.interactionKey] && this.checkPlayerInRange(player)) {
            // Iniciar proceso de curación
            this.healing = true;
            this.healingTimer = this.healingDuration;
            
            // Curar al jugador
            const newHealth = Math.min(player.health + this.healAmount, player.maxHealth);
            player.health = newHealth;
            
            
            return true;
        }
        
        return false;
    }
    
    // Actualiza el estado de la curandera
    update() {
        // Si está curando, actualizar el temporizador
        if (this.healing) {
            this.healingTimer--;
            
            if (this.healingTimer <= 0) {
                this.healing = false;
                this.cooldown = true;
                this.cooldownTimer = this.cooldownDuration;
            }
        }
        
        // Si está en cooldown, actualizar el temporizador
        if (this.cooldown) {
            this.cooldownTimer--;
            
            if (this.cooldownTimer <= 0) {
                this.cooldown = false;
            }
        }
    }
    
    // Actualiza la animación
    updateAnimation(gameFrame, staggerFrames) {
        // Seleccionar fila de animación según estado
        this.spriteRect.y = this.healing ? this.healRow : this.idleRow;
        
        // Controlar frames de animación
        const totalFrames = 8; // Ajustar según tu sprite
        this.spriteRect.x = Math.floor(gameFrame / staggerFrames) % totalFrames;
    }
    
    // Dibuja mensaje de interacción
    drawInteractionPrompt(ctx, playerInRange) {
        if (!this.active || this.cooldown || !playerInRange) return;
        
        // Dibujar mensaje de interacción encima de la curandera
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(this.interactionMessage, this.position.x, this.position.y - 20);
    }
}