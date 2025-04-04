// === Vect Class (Vector Math Utility) ===
// vector class with basic math operations
class Vect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // add another vector
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    // subtract another vector
    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    // multiply by a scalar
    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    // get the length of the vector
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}

// === Rect Class (Basic Rectangle) ===
// stores a position and size (used for bounding boxes, etc.)
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// === GameObject Class (Base Object for All Game Entities) ===
// every drawable/movable object in the game inherits from this
class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;

        // optional sprite and animation rectangle
        this.spriteImage = undefined;
        this.spriteRect = undefined;
    }

    // === Load and Set a Sprite ===
    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    // === Draw This Object on the Canvas ===
    draw(ctx) {
        if (this.spriteImage && this.spriteRect) {
            const verticalOffset = this.spriteRect.height - 16;
            const horizontalOffset = (this.spriteRect.width - 16) / 2;

            ctx.drawImage(
                this.spriteImage,
                this.spriteRect.x * this.spriteRect.width,
                this.spriteRect.y * this.spriteRect.height,
                this.spriteRect.width, this.spriteRect.height,
                this.position.x - horizontalOffset,
                this.position.y - verticalOffset,
                this.width, this.height
            );
        } else {
            // fallback: draw a colored rectangle
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    // === Placeholder Update Function ===
    // meant to be overridden by subclasses
    update() {}
}

// === AnimatedObject Class (GameObject with Sprite Animations) ===
// inherits from GameObject, adds frame logic for animations
class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = sheetCols;
        this.repeat = true;
        this.frameDuration = 100; // milliseconds
        this.totalTime = 0;
    }

    // === Set Animation Parameters ===
    setAnimation(minFrame, maxFrame, repeat, duration) {
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    // === Update Animation Frame Over Time ===
    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            let restartFrame = (this.repeat ? this.minFrame : this.frame);
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
            this.totalTime = 0;
        }
    }
}

// === TextLabel Class ===
// displays text on screen at a given position with custom font and color
class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    // === Draw Text ===
    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

// === Collision Detection Function ===
// checks if two rectangular objects overlap
function boxOverlap(obj1, obj2) {
    return obj1.position.x + obj1.width > obj2.position.x &&
           obj1.position.x < obj2.position.x + obj2.width &&
           obj1.position.y + obj1.height > obj2.position.y &&
           obj1.position.y < obj2.position.y + obj2.height;
}
