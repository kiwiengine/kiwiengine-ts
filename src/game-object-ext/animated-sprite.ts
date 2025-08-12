import { EventMap } from '@webtaku/event-emitter';
import { AnimatedSprite, Spritesheet, SpritesheetData } from 'pixi.js';
import { getCachedId, spritesheetLoader } from '../asset/loaders/spritesheet';
import { GameObject, GameObjectOptions } from '../game-object/game-object';

type AnimatedSpriteOptions = {
  src?: string;
  atlas?: SpritesheetData;
  animation?: string;
  fps?: number;
  loop?: boolean;
} & GameObjectOptions;

class AnimatedSpriteObject<E extends EventMap = EventMap> extends GameObject<E & {
  animationend: (animation: string) => void;
}> {
  #id?: string;
  #sheet?: Spritesheet;
  #sprite?: AnimatedSprite;

  #src?: string;
  #atlas?: SpritesheetData;
  #animation?: string;
  #fps?: number;
  #loop?: boolean;

  constructor(opts?: AnimatedSpriteOptions) {
    super(opts);
    if (opts) {
      if (opts.src) this.src = opts.src;
      if (opts.atlas) this.atlas = opts.atlas;
      if (opts.animation) this.animation = opts.animation;
      if (opts.fps) this.fps = opts.fps;
      if (opts.loop) this.loop = opts.loop;
    }
  }

  #updateAnimation() {
    this.#sprite?.destroy();
    this.#sprite = undefined;

    if (this.#sheet && this.#animation) {
      if (!this.#sheet.animations[this.#animation]) {
        console.error(`Animation not found: ${this.#animation}`);
        return;
      }
      const sprite = new AnimatedSprite(this.#sheet.animations[this.#animation]);
      sprite.anchor.set(0.5, 0.5);
      sprite.loop = this.#loop ?? true;
      sprite.animationSpeed = (this.#fps ?? 0) / 60;
      sprite.play();
      this._addPixiChild(sprite);
      this.#sprite = sprite;

      sprite.onLoop = () => (this as any).emit('animationend', this.#animation);
      sprite.onComplete = () => (this as any).emit('animationend', this.#animation);
    }
  }

  async #load() {
    if (this.#id) spritesheetLoader.release(this.#id);

    this.#id = undefined;
    this.#sheet = undefined;
    this.#sprite?.destroy();
    this.#sprite = undefined;

    if (this.#src && this.#atlas) {
      this.#id = getCachedId(this.#src, this.#atlas);
      if (!spritesheetLoader.checkLoaded(this.#id)) {
        console.info(`Spritesheet not preloaded. Loading now: ${this.#id}`);
      }
      this.#sheet = await spritesheetLoader.load(this.#id, this.#src, this.#atlas);
    }

    this.#updateAnimation();
  }

  get src() {
    return this.#src;
  }

  set src(src: string | undefined) {
    if (this.#src !== src) {
      this.#src = src;
      this.#load();
    }
  }

  get atlas() {
    return this.#atlas;
  }

  set atlas(atlas: SpritesheetData | undefined) {
    if (this.#atlas !== atlas) {
      this.#atlas = atlas;
      this.#load();
    }
  }

  get animation() {
    return this.#animation;
  }

  set animation(animation: string | undefined) {
    if (this.#animation !== animation) {
      this.#animation = animation;
      this.#updateAnimation();
    }
  }

  get fps() {
    return this.#fps;
  }

  set fps(fps: number | undefined) {
    if (this.#fps !== fps) {
      this.#fps = fps;
      if (this.#sprite) this.#sprite.animationSpeed = (fps ?? 0) / 60;
    }
  }

  get loop() {
    return this.#loop;
  }

  set loop(loop: boolean | undefined) {
    if (this.#loop !== loop) {
      this.#loop = loop;
      if (this.#sprite) this.#sprite.loop = loop === true;
    }
  }

  remove() {
    if (this.#id) spritesheetLoader.release(this.#id);
    super.remove();
  }
}

export { AnimatedSpriteObject };
