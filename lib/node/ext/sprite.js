import { Sprite as PixiSprite } from 'pixi.js';
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
        let texture;
        if (textureLoader.checkCached(this.#src)) {
            texture = textureLoader.getCached(this.#src);
        }
        else {
            console.info(`Texture not preloaded. Loading now: ${this.#src}`);
            texture = await textureLoader.load(this.#src);
        }
        this.#sprite?.destroy({ children: true });
        this.#sprite = undefined;
        if (texture) {
            const sprite = new PixiSprite({ texture, anchor: 0.5, zIndex: -999999 });
            this._pixiContainer.addChild(sprite);
            this.#sprite = sprite;
        }
    }
    set src(src) {
        if (this.#src !== src) {
            textureLoader.release(this.#src);
            this.#src = src;
            this.#load();
        }
    }
    get src() { return this.#src; }
    remove() {
        textureLoader.release(this.#src);
        super.remove();
    }
}
//# sourceMappingURL=sprite.js.map