let barwidth = 100;
let cursewidth = barwidth;

class Bar extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "bar"); // Llama al constructor de la clase padre, es decir GameObject
    }

    update() {
        if (this.width > 0) {
            this.width -= 0.5;
            //0.014 Reduce the curse bar width so it lasts 2 min
        }
        else {
            this.width = 0;
        }
    }

    colorTransition() {
        if (this.width > barwidth / 4 * 3 && this.width < barwidth) {
            this.color = "rgb(89, 214, 89)";
        }
        else if (this.width > barwidth / 2 && this.width < barwidth / 4 * 3) {
            this.color = "rgb(238, 195, 1)";
        }
        else if (this.width > barwidth / 4 && this.width < barwidth / 2) {
            this.color = "rgb(222, 152, 23)";
        }
        else if (this.width > 0 && this.width < barwidth / 4) {
            this.color = "rgb(175, 17, 17)";
        }
    }
}