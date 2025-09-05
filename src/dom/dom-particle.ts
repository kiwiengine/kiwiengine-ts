import { BLEND_MODES, Sprite as PixiSprite } from 'pixi.js'
import { DomGameObject, DomGameObjectOptions } from './dom-game-object'
import { domTextureLoader } from './dom-texture-loader'

type RandomRange = { min: number, max: number }

export type DomParticleSystemOptions = {
  texture: string

  count: RandomRange
  lifespan: RandomRange
  angle: RandomRange
  velocity: RandomRange
  scale: RandomRange

  startAlpha?: number
  fadeRate: number
  orientToVelocity: boolean

  blendMode?: BLEND_MODES // ex) 'screen', 'multiply'
} & DomGameObjectOptions

interface Particle {
  sprite: PixiSprite

  age: number
  lifespan: number

  velocityX: number
  velocityY: number

  fadeRate: number
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export class DomParticleSystem extends DomGameObject {
  #textureSrc: string
  #count: RandomRange
  #lifespan: RandomRange
  #angle: RandomRange
  #velocity: RandomRange
  #scale: RandomRange
  #startAlpha?: number
  #fadeRate: number
  #orientToVelocity: boolean
  #blendMode?: BLEND_MODES

  #texture?: HTMLImageElement
  #loadTexturePromise: Promise<void>
  #particles: Particle[] = []

  constructor(options: DomParticleSystemOptions) {
    super(options)
    this.el.style.pointerEvents = 'none'

    this.#textureSrc = options.texture
    this.#count = options.count
    this.#lifespan = options.lifespan
    this.#angle = options.angle
    this.#velocity = options.velocity
    this.#scale = options.scale
    this.#startAlpha = options.startAlpha
    this.#fadeRate = options.fadeRate
    this.#orientToVelocity = options.orientToVelocity
    this.#blendMode = options.blendMode

    this.#loadTexturePromise = this.#loadTexture()
  }

  async #loadTexture() {
    if (domTextureLoader.checkCached(this.#textureSrc)) {
      this.#texture = domTextureLoader.getCached(this.#textureSrc)
    } else {
      console.info(`Dom texture not preloaded. Loading now: ${this.#textureSrc}`)
      this.#texture = await domTextureLoader.load(this.#textureSrc)
    }
  }

  burst({ x, y }: { x: number; y: number }) {
    const count = random(this.#count.min, this.#count.max)
    for (let i = 0; i < count; i++) {
      const lifetime = random(this.#lifespan.min, this.#lifespan.max)
      const angle = random(this.#angle.min, this.#angle.max)
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      const velocity = random(this.#velocity.min, this.#velocity.max)
      const scale = random(this.#scale.min, this.#scale.max)

      //TODO
    }
  }

  protected update(dt: number) {
    super.update(dt)

    //TODO
  }

  override remove() {
    domTextureLoader.release(this.#textureSrc)
    super.remove()
  }
}
