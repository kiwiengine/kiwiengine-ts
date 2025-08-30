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
    update(deltaTime) {
        super.update(deltaTime);
        this.#accumulated += deltaTime;
        if (this.#accumulated >= this.#delay) {
            this.#callback();
            this.remove();
        }
    }
}
//# sourceMappingURL=deplay.js.map