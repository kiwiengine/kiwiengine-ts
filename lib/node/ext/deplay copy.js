import { GameNode } from '../core/game-node';
export class DelayNode extends GameNode {
    #delay;
    #accumulated = 0;
    #callback;
    constructor(delay, callback) {
        super();
        this.#delay = delay;
        this.#callback = callback;
    }
    update(dt) {
        super.update(dt);
        this.#accumulated += dt;
        if (this.#accumulated >= this.#delay) {
            this.#callback();
            this.remove();
        }
    }
}
//# sourceMappingURL=deplay%20copy.js.map