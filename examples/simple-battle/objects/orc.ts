import { AnimatedSpriteNode, ColliderType, GameObjectOptions } from '../../../src/index'
import { Character } from './character'
import orcAtlas from '../assets/spritesheets/orc-atlas.json'

const ORC_MOVE_VELOCITY = 3 as const

export class Orc extends Character {
  #sprite: AnimatedSpriteNode
  #cachedVelX = 0
  #cachedVelY = 0

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: 100,
      hp: 100,
      collider: { type: ColliderType.Rectangle, width: 24, height: 12, y: 12 },
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: 24, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 32, x: 0, y: 0 },
    })

    this.#sprite = new AnimatedSpriteNode({
      src: 'assets/spritesheets/orc.png',
      atlas: orcAtlas,
      animation: 'idle',
      fps: 10,
      loop: true,
      scale: 2
    })
    this.add(this.#sprite)
  }

  moveTo(x: number, y: number) {
    const dx = x - this.x
    const dy = y - this.y
    const radian = Math.atan2(dy, dx)
    this.#cachedVelX = Math.cos(radian) * ORC_MOVE_VELOCITY
    this.#cachedVelY = Math.sin(radian) * ORC_MOVE_VELOCITY
  }

  protected override update(dt: number) {
    super.update(dt)
    this.velocityX = this.#cachedVelX
    this.velocityY = this.#cachedVelY
  }
}
