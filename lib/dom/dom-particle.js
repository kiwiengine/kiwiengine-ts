import { DomGameObject } from './dom-game-object';
import { domTextureLoader } from './dom-texture-loader';
function random(min, max) {
    return Math.random() * (max - min) + min;
}
export class DomParticleSystem extends DomGameObject {
    #textureSrc;
    #count;
    #lifespan;
    #angle;
    #velocity;
    #scale;
    #startAlpha;
    #fadeRate;
    #orientToVelocity;
    #blendMode;
    #texture;
    #loadTexturePromise;
    #particles = [];
    constructor(options) {
        super(options);
        this.el.style.pointerEvents = 'none';
        this.#textureSrc = options.texture;
        this.#count = options.count;
        this.#lifespan = options.lifespan;
        this.#angle = options.angle;
        this.#velocity = options.velocity;
        this.#scale = options.scale;
        this.#startAlpha = options.startAlpha;
        this.#fadeRate = options.fadeRate;
        this.#orientToVelocity = options.orientToVelocity;
        this.#blendMode = options.blendMode;
        this.#loadTexturePromise = this.#loadTexture();
    }
    async #loadTexture() {
        if (domTextureLoader.checkCached(this.#textureSrc)) {
            this.#texture = domTextureLoader.getCached(this.#textureSrc);
        }
        else {
            console.info(`Dom texture not preloaded. Loading now: ${this.#textureSrc}`);
            this.#texture = await domTextureLoader.load(this.#textureSrc);
        }
    }
    burst({ x, y }) {
        const count = random(this.#count.min, this.#count.max);
        for (let i = 0; i < count; i++) {
            const lifetime = random(this.#lifespan.min, this.#lifespan.max);
            const angle = random(this.#angle.min, this.#angle.max);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            const velocity = random(this.#velocity.min, this.#velocity.max);
            const scale = random(this.#scale.min, this.#scale.max);
            //TODO
        }
    }
    update(dt) {
        super.update(dt);
        //TODO
    }
    remove() {
        domTextureLoader.release(this.#textureSrc);
        super.remove();
    }
}
//# sourceMappingURL=dom-particle.js.map