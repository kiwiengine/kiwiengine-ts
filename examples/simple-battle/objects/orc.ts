import { AnimatedSpriteNode, ColliderType, GameObjectOptions } from '../../../src/index'
import orcAtlas from '../assets/spritesheets/orc-atlas.json'
import { Character } from './character'

const ORC_MOVE_VELOCITY = 3 as const
const ORC_HITBOX_X = 24 as const

export class Orc extends Character {
  protected _sprite: AnimatedSpriteNode

  #cachedVelX = 0
  #cachedVelY = 0

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: 100,
      hp: 100,
      collider: { type: ColliderType.Rectangle, width: 30, height: 30, y: 12 },
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: ORC_HITBOX_X, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 32, x: 0, y: 0 },
    })

    this._sprite = new AnimatedSpriteNode({
      src: 'assets/spritesheets/orc.png',
      atlas: orcAtlas,
      animation: 'idle',
      fps: 10,
      loop: true,
      scale: 2
    })
    this.add(this._sprite)
  }

  moveTo(x: number, y: number) {
    const dx = x - this.x
    const dy = y - this.y
    const radian = Math.atan2(dy, dx)
    this.#cachedVelX = Math.cos(radian) * ORC_MOVE_VELOCITY
    this.#cachedVelY = Math.sin(radian) * ORC_MOVE_VELOCITY

    const scale = Math.abs(this._sprite.scaleX)
    this._sprite.scaleX = dx > 0 ? scale : -scale
    this.hitboxX = dx > 0 ? ORC_HITBOX_X : -ORC_HITBOX_X
  }

  protected override update(dt: number) {
    super.update(dt)
    this.velocityX = this.#cachedVelX
    this.velocityY = this.#cachedVelY
  }
}
