import { textureLoader } from '../../asset/loaders/texture';
import { GameObject } from '../core/game-object';
export class SpriteNode extends GameObject {
    #src;
    #sprite;
    constructor(options) {
        super(options);
        this.#src = options.src;
        this.#load();
    }
    async #load() {
        if (!textureLoader.checkLoaded(this.#src)) {
            console.info(`Texture not preloaded. Loading now: ${this.#src}`);
        }
        //TODO
    }
}
//# sourceMappingURL=sprite.js.map