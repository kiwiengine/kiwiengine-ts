import { EventMap } from '@webtaku/event-emitter'
import { Sprite as PixiSprite } from 'pixi.js'
import { textureLoader } from '../../asset/loaders/texture'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type SpriteNodeOptions = {
  src: string
} & GameObjectOptions

export class SpriteNode<E extends EventMap = {}> extends GameObject<E & {
  load: () => void
}> {
  #src: string
  #sprite?: PixiSprite

  constructor(options: SpriteNodeOptions) {
    super(options)
    this.#src = options.src
    this.#load()
  }

  async #load() {
    let texture
    if (textureLoader.checkCached(this.#src)) {
      texture = textureLoader.getCached(this.#src)
    } else {
      console.info(`Texture not preloaded. Loading now: ${this.#src}`)
      texture = await textureLoader.load(this.#src)
    }

    this.#sprite?.destroy()
    this.#sprite = undefined

    if (texture) {
      const s = new PixiSprite({ texture, anchor: 0.5, zIndex: -999999 })
      this._pixiContainer.addChild(s)
      this.#sprite = s
    }

    (this as any).emit('load')
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
