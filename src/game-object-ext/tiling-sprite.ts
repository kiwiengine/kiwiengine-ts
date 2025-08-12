import { EventMap } from '@webtaku/event-emitter';
import { TilingSprite } from 'pixi.js';
import { textureLoader } from '../asset/loaders/texture';
import { GameObject, GameObjectOptions } from '../game-object/game-object';
import { WorldTransform } from '../game-object/transform';

type TilingSpriteOptions = {
  src?: string;
  scrollSpeedX?: number;
  scrollSpeedY?: number;
} & GameObjectOptions;

class TilingSpriteObject<E extends EventMap = EventMap> extends GameObject<E> {
  #sprite?: TilingSprite;
  #src?: string;

  scrollSpeedX?: number;
  scrollSpeedY?: number;

  constructor(opts?: TilingSpriteOptions) {
    super();
    if (opts) {
      if (opts.src) this.src = opts.src;
      if (opts.scrollSpeedX) this.scrollSpeedX = opts.scrollSpeedX;
      if (opts.scrollSpeedY) this.scrollSpeedY = opts.scrollSpeedY;
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

  set src(src: string | undefined) {
    this.#sprite?.destroy({ children: true });
    this.#sprite = undefined;
    if (this.#src) textureLoader.release(this.#src);
    this.#src = src;
    this.#load();
  }

  _engineUpdate(dt: number, pt: WorldTransform) {
    if (this.#sprite) {
      if (this.scrollSpeedX !== undefined) this.#sprite.tilePosition.x += this.scrollSpeedX * dt;
      if (this.scrollSpeedY !== undefined) this.#sprite.tilePosition.y += this.scrollSpeedY * dt;
    }
    super._engineUpdate(dt, pt);
  }

  remove() {
    if (this.#src) textureLoader.release(this.#src);
    super.remove();
  }
}

export { TilingSpriteObject };
