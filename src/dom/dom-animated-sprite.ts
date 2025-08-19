import { EventMap } from '@webtaku/event-emitter';
import { SpritesheetData } from 'pixi.js';
import { DomGameObject, DomGameObjectOptions } from './dom-game-object';
import { domTextureLoader } from './loaders/dom-texture';

type DomAnimatedSpriteOptions = {
  src?: string;
  atlas?: SpritesheetData;
  animation?: string;
  fps?: number;
  loop?: boolean;
} & DomGameObjectOptions;

export class DomAnimatedSpriteObject<E extends EventMap = EventMap> extends DomGameObject<E & {
  animationend: (animation: string) => void;
}> {
  #frames: string[] = [];
  #frameDuration?: number;
  #textureScale = 1;
  #elapsedTime = 0;
  #currentFrameIndex = 0;

  #src?: string;
  #atlas?: SpritesheetData;
  #animation?: string;
  #fps?: number;
  #loop = true;

  constructor(opts?: DomAnimatedSpriteOptions) {
    super(opts);
    if (opts) {
      if (opts.src) this.src = opts.src;
      if (opts.atlas) this.atlas = opts.atlas;
      if (opts.animation) this.animation = opts.animation;
      if (opts.fps) this.fps = opts.fps;
      if (opts.loop) this.loop = opts.loop;
    }
  }

  protected _afterRender(dt: number): void {
    if (this.#frameDuration === undefined || !this.#atlas || this.#frames.length === 0) return;

    const lastIndex = this.#frames.length - 1;

    if (!this.#loop && this.#currentFrameIndex === lastIndex) return;

    this.#elapsedTime += dt;
    if (this.#elapsedTime < this.#frameDuration) return;
    while (this.#elapsedTime >= this.#frameDuration) {
      this.#elapsedTime -= this.#frameDuration;

      if (this.#currentFrameIndex === lastIndex) {
        (this as any).emit('animationend', this.#animation ?? '');

        if (this.#loop) {
          this.#currentFrameIndex = 0;
        } else {
          this.#elapsedTime = 0;
          break;
        }
      } else {
        this.#currentFrameIndex++;
      }
    }

    const frameName = this.#frames[this.#currentFrameIndex];
    const frameData = this.#atlas.frames[frameName].frame;

    this._container.style.width = `${frameData.w * this.#textureScale}px`;
    this._container.style.height = `${frameData.h * this.#textureScale}px`;
    this._container.style.backgroundPosition = `-${frameData.x * this.#textureScale}px -${frameData.y * this.#textureScale}px`;
  }

  async #load() {
    if (this.#src) {
      if (!domTextureLoader.checkLoaded(this.#src)) {
        console.info(`Dom texture not preloaded. Loading now: ${this.#src}`);
      }

      const texture = await domTextureLoader.load(this.#src);
      if (!texture) return;

      if (this.#atlas) {
        this.#frames = this.#animation ? (this.#atlas.animations?.[this.#animation] ?? []) : [];

        const frameName = this.#frames[this.#currentFrameIndex];
        if (!frameName) return;

        const frameData = this.#atlas.frames[frameName].frame;

        this.#textureScale = this.#atlas.meta.scale === 'auto' ? 1 : Number(this.#atlas.meta.scale);

        this._container.style.backgroundImage = `url(${this.#src})`;
        this._container.style.width = `${frameData.w * this.#textureScale}px`;
        this._container.style.height = `${frameData.h * this.#textureScale}px`;
        this._container.style.backgroundSize = `${texture.width * this.#textureScale}px ${texture.height * this.#textureScale}px`;
        this._container.style.backgroundPosition = `-${frameData.x * this.#textureScale}px -${frameData.y * this.#textureScale}px`;
      }
    }
  }

  get src() { return this.#src; }
  set src(src: string | undefined) {
    if (this.#src !== src) {
      if (this.#src) domTextureLoader.release(this.#src);
      this.#src = src;
      this.#load();
    }
  }

  get atlas() { return this.#atlas; }
  set atlas(atlas: SpritesheetData | undefined) {
    if (this.#atlas !== atlas) {
      this.#atlas = atlas;
      this.#load();
    }
  }

  get animation() { return this.#animation; }
  set animation(animation: string | undefined) {
    this.#animation = animation;
    this.#frames = animation ? (this.#atlas?.animations?.[animation] ?? []) : [];
    this.#currentFrameIndex = 0;
    this.#elapsedTime = 0;
  }

  get fps() { return this.#fps; }
  set fps(fps: number | undefined) {
    this.#fps = fps;
    if (fps !== undefined) {
      this.#frameDuration = 1 / fps;
    } else {
      this.#frameDuration = undefined;
    }
  }

  get loop() { return this.#loop; }
  set loop(loop: boolean) { this.#loop = loop; }
}
