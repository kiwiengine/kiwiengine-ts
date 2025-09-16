import { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js';
import { getCachedAtlasId, spritesheetLoader } from '../../asset/loaders/spritesheet';
import { GameObject } from '../core/game-object';
export class AnimatedSpriteNode extends GameObject {
    #src;
    #atlas;
    #animation;
    #atlasId;
    #sheet;
    #sprite;
    constructor(options) {
        super(options);
        this.#src = options.src;
        this.#atlas = options.atlas;
        this.#animation = options.animation;
        this.#load();
    }
    async #load() {
        this.#atlasId = getCachedAtlasId(this.#src, this.#atlas);
        if (spritesheetLoader.checkCached(this.#atlasId)) {
            this.#sheet = spritesheetLoader.getCached(this.#atlasId);
        }
        else {
            console.info(`Spritesheet not preloaded. Loading now: ${this.#atlasId}`);
            this.#sheet = await spritesheetLoader.load(this.#atlasId, this.#src, this.#atlas);
        }
        this.#updateAnimation();
        this.emit('load');
    }
    #updateAnimation() {
        this.#sprite?.destroy();
        this.#sprite = undefined;
        if (!this.#sheet)
            return;
        if (!this.#sheet.animations[this.#animation]) {
            console.error(`Animation not found: ${this.#animation}`);
            return;
        }
        const a = this.#atlas.animations[this.#animation];
        const s = new PixiAnimatedSprite(this.#sheet.animations[this.#animation]);
        s.anchor.set(0.5, 0.5);
        s.zIndex = -999999;
        s.loop = a.loop;
        s.animationSpeed = a.fps / 60;
        s.play();
        s.onLoop = () => this.emit('animationend', this.#animation);
        s.onComplete = () => this.emit('animationend', this.#animation);
        this._pixiContainer.addChild(s);
        this.#sprite = s;
    }
    set src(src) {
        if (this.#src !== src) {
            spritesheetLoader.release(this.#atlasId);
            this.#src = src;
            this.#load();
        }
    }
    get src() { return this.#src; }
    set atlas(atlas) {
        if (this.#atlas !== atlas) {
            spritesheetLoader.release(this.#atlasId);
            this.#atlas = atlas;
            this.#load();
        }
    }
    get atlas() { return this.#atlas; }
    set animation(animation) {
        if (this.#animation !== animation) {
            this.#animation = animation;
            this.#updateAnimation();
        }
    }
    get animation() { return this.#animation; }
    remove() {
        spritesheetLoader.release(this.#atlasId);
        super.remove();
    }
}
//# sourceMappingURL=animated-sprite.js.map