// === Bar Width Variables ===
// these control the visual lengths of the curse and life bars
let barwidth = 100;
let cursewidth = barwidth;
let lifeBarwidth = 100;
let lifewidth = lifeBarwidth;

// === Load Curse Icon Image ===
// this image appears next to the curse bar in the UI
const curseLogo = new Image();
curseLogo.src = "../images/curse_image.png";

// === Load Life Icon Image ===
// this image appears next to the life bar in the UI
const lifeLogo = new Image();
lifeLogo.src = "../images/life_image.png";

// === Bar Class (for Curse or Life Bar) ===
// inherits from GameObject. handles size and color of a bar UI element.
class Bar extends GameObject {
    constructor(position, width, height, color) {
        // call the GameObject constructor with bar tag
        super(position, width, height, color, "bar");
    }

    // === Update Bar Width Over Time ===
    // gradually reduces bar width unless it's already zero
    update() {
        if (this.width > 0) {
            this.width -= 0.008; // controls how fast the curse drains (0.014 = ~2 min total)
        }
        else {
            this.width = 0;
        }

        // Save the curse value to localStorage
        if (this.tag === "bar" && typeof barwidth !== 'undefined') {
            const porcentajeMaldicion = Math.round((this.width / barwidth) * 100);
            localStorage.setItem('curseValue', porcentajeMaldicion);
        }
    }

    // === Change Bar Color Based on Remaining Width ===
    // green → yellow → orange → red as the bar gets lower
    colorTransition() {
        if (this.width > barwidth / 4 * 3 && this.width < barwidth) {
            this.color = "rgb(89, 214, 89)"; // green
        }
        else if (this.width > barwidth / 2 && this.width < barwidth / 4 * 3) {
            this.color = "rgb(238, 195, 1)"; // yellow
        }
        else if (this.width > barwidth / 4 && this.width < barwidth / 2) {
            this.color = "rgb(222, 152, 23)"; // orange
        }
        else if (this.width > 0 && this.width < barwidth / 4) {
            this.color = "rgb(175, 17, 17)"; // red
        }
    }
}
