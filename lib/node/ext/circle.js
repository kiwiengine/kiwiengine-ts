import { Graphics } from 'pixi.js';
import { TransformableNode } from '../core/transformable';
export class CircleNode extends TransformableNode {
    #radius;
    #fill;
    #stroke;
    constructor(options) {
        super(new Graphics({ sortableChildren: true }), options);
        this.#radius = options.radius;
        this.#fill = options.fill;
        this.#stroke = options.stroke;
        this.#draw();
    }
    #draw() {
        this._pixiContainer.clear().circle(0, 0, this.#radius);
        if (this.#fill)
            this._pixiContainer.fill(this.#fill);
        if (this.#stroke)
            this._pixiContainer.stroke(this.#stroke);
    }
    get radius() { return this.#radius; }
    set radius(v) { this.#radius = v; this.#draw(); }
    get fill() { return this.#fill; }
    set fill(v) { this.#fill = v; this.#draw(); }
    get stroke() { return this.#stroke; }
    set stroke(v) { this.#stroke = v; this.#draw(); }
}
//# sourceMappingURL=circle.js.map