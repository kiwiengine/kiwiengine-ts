import { EventMap } from '@webtaku/event-emitter'
import { Atlas } from '../types/atlas'
import { DomGameObject, DomGameObjectOptions } from './dom-game-object'
import { domTextureLoader } from './dom-texture-loader'
import { setStyle } from './dom-utils'

export type DomAnimatedSpriteNodeOptions = {
  src: string
  atlas: Atlas
  animation: string
  fps: number
  loop?: boolean
} & DomGameObjectOptions

export class DomAnimatedSpriteNode<E extends EventMap = EventMap> extends DomGameObject<E & {
  animationend: (animation: string) => void
}> {
  #src: string
  #atlas: Atlas
  #animation: string
  #fps: number
  #loop: boolean

  #frames: string[] = []
  #frameDuration?: number
  #elapsedTime = 0
  #currentFrameIdx = 0

  constructor(options: DomAnimatedSpriteNodeOptions) {
    super(options)
    this.#src = options.src
    this.#atlas = options.atlas
    this.#animation = options.animation
    this.#fps = options.fps
    this.#loop = options.loop ?? true
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

    this.#frameDuration = 1 / this.#fps
    this.#frames = this.#atlas.animations?.[this.#animation] ?? []

    const frameName = this.#frames[this.#currentFrameIdx]
    const frame = this.#atlas.frames[frameName].frame

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

    if (this.#frameDuration === undefined || this.#frames.length === 0) return

    const lastIndex = this.#frames.length - 1
    if (!this.#loop && this.#currentFrameIdx === lastIndex) return

    this.#elapsedTime += dt
    if (this.#elapsedTime < this.#frameDuration) return

    while (this.#elapsedTime >= this.#frameDuration) {
      this.#elapsedTime -= this.#frameDuration

      if (this.#currentFrameIdx === lastIndex) {
        (this as any).emit('animationend', this.#animation)

        if (this.#loop) {
          this.#currentFrameIdx = 0
        } else {
          this.#elapsedTime = 0
          break
        }
      } else {
        this.#currentFrameIdx++
      }
    }

    const frameName = this.#frames[this.#currentFrameIdx]
    const frame = this.#atlas.frames[frameName].frame

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
      this.#frames = this.#atlas.animations?.[animation] ?? []
      this.#currentFrameIdx = 0
      this.#elapsedTime = 0
    }
  }

  get animation() { return this.#animation }

  set fps(fps) {
    if (this.#fps !== fps) {
      this.#fps = fps
      this.#frameDuration = 1 / fps
    }
  }

  get fps() { return this.#fps }

  set loop(loop) { this.#loop = loop }
  get loop() { return this.#loop }

  override remove() {
    domTextureLoader.release(this.#src)
    super.remove()
  }
}
