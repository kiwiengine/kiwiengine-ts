import { Graphics } from 'pixi.js';
import { TransformableNode } from '../core/transformable';
export class RectangleNode extends TransformableNode {
    #width;
    #height;
    #fill;
    #stroke;
    constructor(options) {
        super(new Graphics({ sortableChildren: true }), options);
        this.#width = options.width;
        this.#height = options.height;
        this.#fill = options.fill;
        this.#stroke = options.stroke;
        this.#draw();
    }
    #draw() {
        this._pixiContainer.clear().rect(-this.#width / 2, -this.#height / 2, this.#width, this.#height);
        if (this.#fill)
            this._pixiContainer.fill(this.#fill);
        if (this.#stroke)
            this._pixiContainer.stroke(this.#stroke);
    }
    get width() { return this.#width; }
    set width(v) { this.#width = v; this.#draw(); }
    get height() { return this.#height; }
    set height(v) { this.#height = v; this.#draw(); }
    get fill() { return this.#fill; }
    set fill(v) { this.#fill = v; this.#draw(); }
    get stroke() { return this.#stroke; }
    set stroke(v) { this.#stroke = v; this.#draw(); }
}
//# sourceMappingURL=rectangle.js.map