import { DomGameObject } from './dom-game-object';
import { domTextureLoader } from './dom-texture-loader';
import { setStyle } from './dom-utils';
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
        this.#scale = options.particleScale;
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
    async burst({ x, y }) {
        if (!this.#texture)
            await this.#loadTexturePromise;
        const count = random(this.#count.min, this.#count.max);
        for (let i = 0; i < count; i++) {
            const lifespan = random(this.#lifespan.min, this.#lifespan.max);
            const angle = random(this.#angle.min, this.#angle.max);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            const velocity = random(this.#velocity.min, this.#velocity.max);
            const scale = random(this.#scale.min, this.#scale.max);
            const el = document.createElement('div');
            setStyle(el, {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${this.#texture.width}px`,
                height: `${this.#texture.height}px`,
                transform: `translate(-50%, -50%) scale(${scale})${this.#orientToVelocity ? ` rotate(${angle}rad)` : ''}`,
                backgroundImage: `url(${this.#textureSrc})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                opacity: `${this.#startAlpha ?? 1}`,
                mixBlendMode: this.#blendMode ?? 'normal',
            });
            this.#particles.push({
                el,
                age: 0,
                lifespan,
                velocityX: velocity * cos,
                velocityY: velocity * sin,
                fadeRate: this.#fadeRate,
            });
            this.el.appendChild(el);
        }
    }
    update(dt) {
        super.update(dt);
        const ps = this.#particles;
        for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            const e = p.el;
            p.age += dt;
            if (p.age > p.lifespan) {
                e.remove();
                ps.splice(i, 1);
                i--;
                continue;
            }
            const x = parseFloat(e.style.left) + p.velocityX * dt;
            const y = parseFloat(e.style.top) + p.velocityY * dt;
            const opacity = parseFloat(e.style.opacity) + p.fadeRate * dt;
            setStyle(e, { left: `${x}px`, top: `${y}px`, opacity: `${opacity}` });
        }
    }
    remove() {
        domTextureLoader.release(this.#textureSrc);
        super.remove();
    }
}
//# sourceMappingURL=dom-particle.js.map