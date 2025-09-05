import { BLEND_MODES } from 'pixi.js'
import { GameObject, GameObjectOptions } from '../core/game-object'

type RandomRange = { min: number, max: number }

export type ParticleSystemOptions = {
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
} & GameObjectOptions

interface Particle {
  el: HTMLDivElement

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
  #particles: Particle[] = []

  constructor(options: ParticleSystemOptions) {
    super(options)
  }
}
