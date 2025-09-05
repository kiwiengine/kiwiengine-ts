import { Sprite as PixiSprite } from 'pixi.js';
import { textureLoader } from '../../asset/loaders/texture';
import { GameObject } from '../core/game-object';
function random(min, max) {
    return Math.random() * (max - min) + min;
}
export class ParticleSystem extends GameObject {
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
        if (textureLoader.checkCached(this.#textureSrc)) {
            this.#texture = textureLoader.getCached(this.#textureSrc);
        }
        else {
            console.info(`Texture not preloaded. Loading now: ${this.#textureSrc}`);
            this.#texture = await textureLoader.load(this.#textureSrc);
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
            const sprite = new PixiSprite({
                x, y,
                texture: this.#texture,
                anchor: { x: 0.5, y: 0.5 },
                scale: { x: scale, y: scale },
                alpha: this.#startAlpha,
                blendMode: this.#blendMode,
                rotation: this.#orientToVelocity ? angle : undefined,
            });
            this.#particles.push({
                sprite,
                age: 0,
                lifespan,
                velocityX: velocity * cos,
                velocityY: velocity * sin,
                fadeRate: this.#fadeRate,
            });
            this._pixiContainer.addChild(sprite);
        }
    }
    update(dt) {
        super.update(dt);
        const ps = this.#particles;
        for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            const g = p.sprite;
            p.age += dt;
            if (p.age > p.lifespan) {
                g.destroy({ children: true });
                ps.splice(i, 1);
                i--;
                continue;
            }
            g.x += p.velocityX * dt;
            g.y += p.velocityY * dt;
            g.alpha += p.fadeRate * dt;
        }
    }
    remove() {
        textureLoader.release(this.#textureSrc);
        super.remove();
    }
}
//# sourceMappingURL=particle.js.map