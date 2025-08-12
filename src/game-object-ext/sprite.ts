import { EventMap } from '@webtaku/event-emitter';
import { Sprite } from 'pixi.js';
import { textureLoader } from '../asset/loaders/texture';
import { GameObject, GameObjectOptions } from '../game-object/game-object';

type SpriteOptions = {
  src?: string;
} & GameObjectOptions;

class SpriteObject<E extends EventMap = EventMap> extends GameObject<E> {
  #sprite?: Sprite;
  #src?: string;

  constructor(opts?: SpriteOptions) {
    super(opts);
    if (opts) {
      if (opts.src) this.src = opts.src;
    }
  }

  async #load() {
    this.#sprite?.destroy({ children: true });
    this.#sprite = undefined;

    if (this.#src) {
      if (!textureLoader.checkLoaded(this.#src)) {
        console.info(`Texture not preloaded. Loading now: ${this.#src}`);
      }
      const texture = await textureLoader.load(this.#src);
      if (texture) {
        this.#sprite = new Sprite({ texture, anchor: 0.5, zIndex: -999999 });
        this._addPixiChild(this.#sprite);
      }
    }
  }

  get src() {
    return this.#src;
  }

  set src(src: string | undefined) {
    if (this.#src !== src) {
      if (this.#src) textureLoader.release(this.#src);
      this.#src = src;
      this.#load();
    }
  }

  remove() {
    if (this.#src) textureLoader.release(this.#src);
    super.remove();
  }
}

export { SpriteObject };
