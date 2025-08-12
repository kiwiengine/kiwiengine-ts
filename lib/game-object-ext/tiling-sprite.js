import { TilingSprite } from 'pixi.js';
import { textureLoader } from '../asset/loaders/texture';
import { GameObject } from '../game-object/game-object';
class TilingSpriteObject extends GameObject {
    #sprite;
    #src;
    scrollSpeedX;
    scrollSpeedY;
    constructor(opts) {
        super();
        if (opts) {
            if (opts.src)
                this.src = opts.src;
            if (opts.scrollSpeedX)
                this.scrollSpeedX = opts.scrollSpeedX;
            if (opts.scrollSpeedY)
                this.scrollSpeedY = opts.scrollSpeedY;
        }
    }
    async #load() {
        if (this.#src) {
            if (!textureLoader.checkLoaded(this.#src)) {
                console.info(`Tiling sprite not preloaded. Loading now: ${this.#src}`);
            }
            const texture = await textureLoader.load(this.#src);
            if (texture) {
                const sprite = new TilingSprite({
                    texture,
                    anchor: 0.5,
                    zIndex: -999999,
                });
                this._addPixiChild(sprite);
                this.#sprite = sprite;
            }
        }
    }
    get src() {
        return this.#src;
    }
    set src(src) {
        this.#sprite?.destroy({ children: true });
        this.#sprite = undefined;
        if (this.#src)
            textureLoader.release(this.#src);
        this.#src = src;
        this.#load();
    }
    _engineUpdate(dt, pt) {
        if (this.#sprite) {
            if (this.scrollSpeedX !== undefined)
                this.#sprite.tilePosition.x += this.scrollSpeedX * dt;
            if (this.scrollSpeedY !== undefined)
                this.#sprite.tilePosition.y += this.scrollSpeedY * dt;
        }
        super._engineUpdate(dt, pt);
    }
    remove() {
        if (this.#src)
            textureLoader.release(this.#src);
        super.remove();
    }
}
export { TilingSpriteObject };
//# sourceMappingURL=tiling-sprite.js.map