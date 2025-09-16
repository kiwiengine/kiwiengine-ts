import { DomGameObject } from './dom-game-object';
import { domTextureLoader } from './dom-texture-loader';
import { setStyle } from './dom-utils';
export class DomSpriteNode extends DomGameObject {
    #src;
    constructor(options) {
        super(options);
        this.#src = options.src;
        this.#load();
    }
    async #load() {
        let texture;
        if (domTextureLoader.checkCached(this.#src)) {
            texture = domTextureLoader.getCached(this.#src);
        }
        else {
            console.info(`Dom texture not preloaded. Loading now: ${this.#src}`);
            texture = await domTextureLoader.load(this.#src);
        }
        setStyle(this.el, !texture ? { backgroundImage: 'none' } : {
            backgroundImage: `url(${this.#src})`,
            width: `${texture.width}px`,
            height: `${texture.height}px`,
            backgroundSize: `${texture.width}px ${texture.height}px`,
        });
        this.emit('load');
    }
    set src(src) {
        if (this.#src !== src) {
            domTextureLoader.release(this.#src);
            this.#src = src;
            this.#load();
        }
    }
    get src() { return this.#src; }
    remove() {
        domTextureLoader.release(this.#src);
        super.remove();
    }
}
//# sourceMappingURL=dom-sprite.js.map