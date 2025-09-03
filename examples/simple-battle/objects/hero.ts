import { AnimatedSpriteNode, ColliderType, GameObjectOptions } from '../../../src/index'
import heroAtlas from '../assets/spritesheets/hero-atlas.json'
import { Character } from './character'

const HERO_MOVE_SPEED = 300 as const

export class Hero extends Character {
  protected _sprite: AnimatedSpriteNode

  #cachedVelX = 0
  #cachedVelY = 0

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: 1000,
      hp: 1000,
      collider: { type: ColliderType.Rectangle, width: 30, height: 30, y: 12 },
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: 24, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 40, x: 0, y: -4 },
      isStatic: true
    })

    this._sprite = new AnimatedSpriteNode({
      src: 'assets/spritesheets/hero.png',
      atlas: heroAtlas,
      animation: 'idle',
      fps: 10,
      loop: true,
      scale: 2
    })
    this.add(this._sprite)
  }

  move(radian: number, distance: number) {
    this.#cachedVelX = Math.cos(radian) * distance * HERO_MOVE_SPEED
    this.#cachedVelY = Math.sin(radian) * distance * HERO_MOVE_SPEED
  }

  stop() {
    this.#cachedVelX = 0
    this.#cachedVelY = 0
  }

  attack() {
    //TODO
  }

  protected override update(dt: number) {
    super.update(dt)

    this.x += this.#cachedVelX * dt
    this.y += this.#cachedVelY * dt
  }
}
