import { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js';
import { getCachedAtlasId, spritesheetLoader } from '../../asset/loaders/spritesheet';
import { GameObject } from '../core/game-object';
export class AnimatedSpriteNode extends GameObject {
    #src;
    #atlas;
    #animation;
    #fps;
    #loop;
    #atlasId;
    #sheet;
    #sprite;
    constructor(options) {
        super(options);
        this.#src = options.src;
        this.#atlas = options.atlas;
        this.#animation = options.animation;
        this.#fps = options.fps;
        this.#loop = options.loop ?? true;
        this.#load();
    }
    async #load() {
        this.#atlasId = getCachedAtlasId(this.#src, this.#atlas);
        if (spritesheetLoader.checkLoaded(this.#atlasId)) {
            this.#sheet = spritesheetLoader.get(this.#atlasId);
        }
        else {
            console.info(`Spritesheet not preloaded. Loading now: ${this.#atlasId}`);
            this.#sheet = await spritesheetLoader.load(this.#atlasId, this.#src, this.#atlas);
        }
        this.#updateAnimation();
    }
    #updateAnimation() {
        this.#sprite?.destroy();
        this.#sprite = undefined;
        if (this.#sheet) {
            if (!this.#sheet.animations[this.#animation]) {
                console.error(`Animation not found: ${this.#animation}`);
                return;
            }
            const sprite = new PixiAnimatedSprite(this.#sheet.animations[this.#animation]);
            sprite.anchor.set(0.5, 0.5);
            sprite.loop = this.#loop;
            sprite.animationSpeed = (this.#fps ?? 0) / 60;
            sprite.play();
            sprite.onLoop = () => this.emit('animationend', this.#animation);
            sprite.onComplete = () => this.emit('animationend', this.#animation);
            this._pixiContainer.addChild(sprite);
            this.#sprite = sprite;
        }
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
    set fps(fps) {
        if (this.#fps !== fps) {
            this.#fps = fps;
            if (this.#sprite)
                this.#sprite.animationSpeed = (fps ?? 0) / 60;
        }
    }
    get fps() { return this.#fps; }
    set loop(loop) {
        if (this.#loop !== loop) {
            this.#loop = loop;
            if (this.#sprite)
                this.#sprite.loop = loop;
        }
    }
    get loop() { return this.#loop; }
    remove() {
        spritesheetLoader.release(this.#atlasId);
        super.remove();
    }
}
//# sourceMappingURL=animated-sprite.js.map