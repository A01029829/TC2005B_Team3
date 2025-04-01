class InputManager {
    constructor(keyMap) {
        this.keysPressed = {};
        this.keyMap = keyMap;
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener("keydown", (event) => {
            if (this.keyMap[event.key]) {
                this.keysPressed[event.key] = true;
            }
            if (!paused) {
                if (event.key == "Escape") {
                    paused = true;
                    drawPause();
                }
            }
        });

        window.addEventListener("keyup", (event) => {
            if (this.keyMap[event.key]) {
                delete this.keysPressed[event.key];
            }
        });
    }

    isPressed(key) {
        return !!this.keysPressed[key];
    }

    getPressedKeys() {
        return Object.keys(this.keysPressed);
    }

    reset() {
        this.keysPressed = {};
    }
} 
