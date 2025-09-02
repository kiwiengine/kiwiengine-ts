import { PhysicsObject, PhysicsObjectOptions, RectangleCollider, RectangleNode } from '../../../src'
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

  constructor(options: CharacterOptions) {
    super(options)
    this.maxHp = options.maxHp
    this.hp = options.hp
    this.hitbox = options.hitbox
    this.hurtbox = options.hurtbox

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp, layer: 'hud' })
    this.add(this.#hpBar)

    if (debugMode) {
      this.add(new RectangleNode({ ...options.collider, stroke: 'yellow', layer: 'hud' }))
      this.add(new RectangleNode({ ...this.hitbox, stroke: 'red', layer: 'hud' }))
      this.add(new RectangleNode({ ...this.hurtbox, stroke: 'green', layer: 'hud' }))
    }
  }
}
