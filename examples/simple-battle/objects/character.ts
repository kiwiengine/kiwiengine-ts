import { GameObject, GameObjectOptions, RectangleCollider, RectangleNode } from '../../../src'
import { debugMode } from '../../../src/debug'
import { HpBar } from '../hud/hp-bar'

export type CharacterOptions = {
  maxHp: number
  hp: number
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & GameObjectOptions

export class Character extends GameObject {
  maxHp: number
  hp: number
  hitbox: RectangleCollider
  hurtbox: RectangleCollider

  #hpBar: HpBar

  constructor(options: CharacterOptions) {
    super(options)
    this.maxHp = options.maxHp
    this.hp = options.hp
    this.hitbox = options.hitbox
    this.hurtbox = options.hurtbox

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp })
    this.add(this.#hpBar)

    if (debugMode) {
      this.add(new RectangleNode({ x: this.hitbox.x, y: this.hitbox.y, width: this.hitbox.width, height: this.hitbox.height, stroke: 'red' }))
      this.add(new RectangleNode({ x: this.hurtbox.x, y: this.hurtbox.y, width: this.hurtbox.width, height: this.hurtbox.height, stroke: 'green' }))
    }
  }
}
