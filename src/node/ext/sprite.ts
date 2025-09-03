import { EventMap } from '@webtaku/event-emitter'
import { Sprite as PixiSprite } from 'pixi.js'
import { textureLoader } from '../../asset/loaders/texture'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type SpriteNodeOptions = {
  src: string
} & GameObjectOptions

export class SpriteNode<E extends EventMap = EventMap> extends GameObject<E> {
  #src: string
  #sprite?: PixiSprite

  constructor(options: SpriteNodeOptions) {
    super(options)
    this.#src = options.src
    this.#load()
  }

  async #load() {
    let texture
    if (textureLoader.checkLoaded(this.#src)) {
      texture = textureLoader.get(this.#src)
    } else {
      console.info(`Texture not preloaded. Loading now: ${this.#src}`)
      texture = await textureLoader.load(this.#src)
    }

    this.#sprite?.destroy({ children: true })
    this.#sprite = undefined

    if (texture) {
      const sprite = new PixiSprite({ texture, anchor: 0.5, zIndex: -999999 })
      this._pixiContainer.addChild(sprite)
      this.#sprite = sprite
    }
  }

  set src(src) {
    if (this.#src !== src) {
      textureLoader.release(this.#src)
      this.#src = src
      this.#load()
    }
  }

  get src() { return this.#src }

  override remove() {
    textureLoader.release(this.#src)
    super.remove()
  }
}
