import { EventMap } from '@webtaku/event-emitter'
import { DomGameObject, DomGameObjectOptions } from './dom-game-object'
import { domTextureLoader } from './dom-texture-loader'
import { setStyle } from './dom-utils'

export type DomSpriteNodeOptions = {
  src: string
} & DomGameObjectOptions

export class DomSpriteNode<E extends EventMap = {}> extends DomGameObject<E & {
  load: () => void
}> {
  #src: string

  constructor(options: DomSpriteNodeOptions) {
    super(options)
    this.#src = options.src
    this.#load()
  }

  async #load() {
    let texture
    if (domTextureLoader.checkCached(this.#src)) {
      texture = domTextureLoader.getCached(this.#src)
    } else {
      console.info(`Dom texture not preloaded. Loading now: ${this.#src}`)
      texture = await domTextureLoader.load(this.#src)
    }

    setStyle(this.el, !texture ? { backgroundImage: 'none' } : {
      backgroundImage: `url(${this.#src})`,
      width: `${texture.width}px`,
      height: `${texture.height}px`,
      backgroundSize: `${texture.width}px ${texture.height}px`,
    });

    (this as any).emit('load')
  }

  set src(src) {
    if (this.#src !== src) {
      domTextureLoader.release(this.#src)
      this.#src = src
      this.#load()
    }
  }

  get src() { return this.#src }

  override remove() {
    domTextureLoader.release(this.#src)
    super.remove()
  }
}
