import { BLEND_MODES, Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js'
import { textureLoader } from '../../asset/loaders/texture'
import { GameObject, GameObjectOptions } from '../core/game-object'

type RandomRange = { min: number, max: number }

export type ParticleSystemOptions = {
  texture: string

  count: RandomRange
  lifespan: RandomRange
  angle: RandomRange
  velocity: RandomRange
  particleScale: RandomRange

  startAlpha?: number
  fadeRate: number
  orientToVelocity: boolean

  blendMode?: BLEND_MODES // ex) 'screen', 'multiply'
} & GameObjectOptions

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

export class ParticleSystem extends GameObject {
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

  #texture?: PixiTexture
  #loadTexturePromise: Promise<void>
  #particles: Particle[] = []

  constructor(options: ParticleSystemOptions) {
    super(options)

    this.#textureSrc = options.texture
    this.#count = options.count
    this.#lifespan = options.lifespan
    this.#angle = options.angle
    this.#velocity = options.velocity
    this.#scale = options.particleScale
    this.#startAlpha = options.startAlpha
    this.#fadeRate = options.fadeRate
    this.#orientToVelocity = options.orientToVelocity
    this.#blendMode = options.blendMode

    this.#loadTexturePromise = this.#loadTexture()
  }

  async #loadTexture() {
    if (textureLoader.checkCached(this.#textureSrc)) {
      this.#texture = textureLoader.getCached(this.#textureSrc)
    } else {
      console.info(`Texture not preloaded. Loading now: ${this.#textureSrc}`)
      this.#texture = await textureLoader.load(this.#textureSrc)
    }
  }

  async burst({ x, y }: { x: number; y: number }) {
    if (!this.#texture) await this.#loadTexturePromise

    const count = random(this.#count.min, this.#count.max)
    for (let i = 0; i < count; i++) {
      const lifespan = random(this.#lifespan.min, this.#lifespan.max)
      const angle = random(this.#angle.min, this.#angle.max)
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      const velocity = random(this.#velocity.min, this.#velocity.max)
      const scale = random(this.#scale.min, this.#scale.max)

      const sprite = new PixiSprite({
        x, y,
        texture: this.#texture,
        anchor: { x: 0.5, y: 0.5 },
        scale: { x: scale, y: scale },
        alpha: this.#startAlpha,
        blendMode: this.#blendMode,
        rotation: this.#orientToVelocity ? angle : undefined,
      })

      this.#particles.push({
        sprite,
        age: 0,
        lifespan,
        velocityX: velocity * cos,
        velocityY: velocity * sin,
        fadeRate: this.#fadeRate,
      })

      this._pixiContainer.addChild(sprite)
    }
  }

  protected update(dt: number) {
    super.update(dt)

    const ps = this.#particles
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      const g = p.sprite

      p.age += dt
      if (p.age > p.lifespan) {
        g.destroy({ children: true })
        ps.splice(i, 1)
        i--
        continue
      }

      g.x += p.velocityX * dt
      g.y += p.velocityY * dt
      g.alpha += p.fadeRate * dt
    }
  }

  override remove() {
    textureLoader.release(this.#textureSrc)
    super.remove()
  }
}
