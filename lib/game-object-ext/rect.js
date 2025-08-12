import { Graphics } from 'pixi.js';
import { GameObject } from '../game-object/game-object';
class RectangleObject extends GameObject {
    #graphics = new Graphics({ zIndex: -999999 });
    #width = 0;
    #height = 0;
    #fill;
    #stroke;
    constructor() {
        super();
        this._addPixiChild(this.#graphics);
    }
    #draw() {
        this.#graphics.clear().rect(-this.#width / 2, -this.#height / 2, this.#width, this.#height);
        if (this.#fill)
            this.#graphics.fill(this.#fill);
        if (this.#stroke)
            this.#graphics.stroke(this.#stroke);
    }
    get width() { return this.#width; }
    set width(value) { this.#width = value; this.#draw(); }
    get height() { return this.#height; }
    set height(value) { this.#height = value; this.#draw(); }
    get fill() { return this.#fill; }
    set fill(value) { this.#fill = value; this.#draw(); }
    get stroke() { return this.#stroke; }
    set stroke(value) { this.#stroke = value; this.#draw(); }
}
export { RectangleObject };
//# sourceMappingURL=rect.js.map