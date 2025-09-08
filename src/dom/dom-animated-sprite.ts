import { EventMap } from '@webtaku/event-emitter'
import { Animation, Atlas } from '../types/atlas'
import { DomGameObject, DomGameObjectOptions } from './dom-game-object'
import { domTextureLoader } from './dom-texture-loader'
import { setStyle } from './dom-utils'

export type DomAnimatedSpriteNodeOptions = {
  src: string
  atlas: Atlas
  animation: string
} & DomGameObjectOptions

export class DomAnimatedSpriteNode<E extends EventMap = EventMap> extends DomGameObject<E & {
  animationend: (animation: string) => void
}> {
  #src: string
  #atlas: Atlas
  #animation: string

  #animationData?: Animation
  #frameDuration?: number
  #elapsedTime = 0
  #currentFrameIdx = 0

  constructor(options: DomAnimatedSpriteNodeOptions) {
    super(options)
    this.#src = options.src
    this.#atlas = options.atlas
    this.#animation = options.animation
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

    const a = this.#atlas.animations[this.#animation]
    this.#animationData = a
    this.#frameDuration = 1 / a.fps

    const frameName = a.frames[this.#currentFrameIdx]
    const frame = this.#atlas.frames[frameName]

    setStyle(this.el, !frameName || !texture ? { backgroundImage: 'none' } : {
      backgroundImage: `url(${this.#src})`,
      width: `${frame.w}px`,
      height: `${frame.h}px`,
      backgroundSize: `${texture.width}px ${texture.height}px`,
      backgroundPosition: `-${frame.x}px -${frame.y}px`
    })
  }

  override render(dt: number) {
    super.render(dt)

    const a = this.#animationData
    if (!a || a.frames.length === 0 || this.#frameDuration === undefined) return

    const lastIndex = a.frames.length - 1
    if (!a.loop && this.#currentFrameIdx === lastIndex) return

    this.#elapsedTime += dt
    if (this.#elapsedTime < this.#frameDuration) return

    while (this.#elapsedTime >= this.#frameDuration) {
      this.#elapsedTime -= this.#frameDuration

      if (this.#currentFrameIdx === lastIndex) {
        (this as any).emit('animationend', this.#animation)

        if (a.loop) {
          this.#currentFrameIdx = 0
        } else {
          this.#elapsedTime = 0
          break
        }
      } else {
        this.#currentFrameIdx++
      }
    }

    const frameName = a.frames[this.#currentFrameIdx]
    const frame = this.#atlas.frames[frameName]

    setStyle(this.el, {
      width: `${frame.w}px`,
      height: `${frame.h}px`,
      backgroundPosition: `-${frame.x}px -${frame.y}px`
    })
  }

  set src(src) {
    if (this.#src !== src) {
      domTextureLoader.release(this.#src)
      this.#src = src
      this.#load()
    }
  }

  get src() { return this.#src }

  set atlas(atlas) {
    if (this.#atlas !== atlas) {
      domTextureLoader.release(this.#src)
      this.#atlas = atlas
      this.#load()
    }
  }

  get atlas() { return this.#atlas }

  set animation(animation) {
    if (this.#animation !== animation) {
      this.#animation = animation
      this.#animationData = this.#atlas.animations[animation]
      this.#currentFrameIdx = 0
      this.#elapsedTime = 0
    }
  }

  get animation() { return this.#animation }

  override remove() {
    domTextureLoader.release(this.#src)
    super.remove()
  }
}
