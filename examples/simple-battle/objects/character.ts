import { AnimatedSpriteNode, PhysicsObject, PhysicsObjectOptions, RectangleCollider, RectangleNode } from '../../../src'
import { debugMode } from '../../../src/debug'
import { HpBar } from '../hud/hp-bar'

export type CharacterOptions = {
  maxHp: number
  hp: number
  collider: RectangleCollider
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & PhysicsObjectOptions

export class Character extends PhysicsObject {
  maxHp: number
  hp: number
  hitbox: RectangleCollider
  hurtbox: RectangleCollider

  #hpBar: HpBar
  protected _sprite?: AnimatedSpriteNode

  #prevX = this.x

  constructor(options: CharacterOptions) {
    super({ ...options, fixedRotation: true })
    this.maxHp = options.maxHp
    this.hp = options.hp
    this.hitbox = options.hitbox
    this.hurtbox = options.hurtbox

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp, layer: 'hud' })
    this.add(this.#hpBar)

    if (debugMode) {
      this.add(new RectangleNode({ ...options.collider, stroke: 'yellow', alpha: 0.5, layer: 'hud' }))
      this.add(new RectangleNode({ ...this.hitbox, stroke: 'red', alpha: 0.5, layer: 'hud' }))
      this.add(new RectangleNode({ ...this.hurtbox, stroke: 'green', alpha: 0.5, layer: 'hud' }))
    }
  }

  protected override update(dt: number) {
    super.update(dt)

    if (this._sprite && this.x !== this.#prevX) {
      const scale = Math.abs(this._sprite.scaleX)
      this._sprite.scaleX = this.x > this.#prevX ? scale : -scale
    }
    this.#prevX = this.x
  }
}
