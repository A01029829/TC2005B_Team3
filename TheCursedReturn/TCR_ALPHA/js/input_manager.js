// === InputManager Class ===
// handles keyboard input by tracking key states based on a key map

class InputManager {
    constructor(keyMap) {
        // === keysPressed stores which keys are currently held down ===
        this.keysPressed = {};

        // === keyMap maps accepted keys to in-game actions (like movement) ===
        this.keyMap = keyMap;

        // start listening for key events
        this.setupListeners();
    }

    // === Setup Key Press Listeners ===
    // adds event listeners to update keysPressed when keys go down/up
    setupListeners() {
        window.addEventListener("keydown", (event) => {
            if (this.keyMap[event.key]) {
                this.keysPressed[event.key] = true
            }
        });

        window.addEventListener("keyup", (event) => {
            if (this.keyMap[event.key]) {
                delete this.keysPressed[event.key];
            }
        });
    }

    // === Check If a Key Is Currently Pressed ===
    isPressed(key) {
        return !!this.keysPressed[key];
    }

    // === Get All Keys Currently Pressed ===
    getPressedKeys() {
        return Object.keys(this.keysPressed);
    }

    // === Reset All Pressed Keys ===
    reset() {
        this.keysPressed = {};
    }
}
