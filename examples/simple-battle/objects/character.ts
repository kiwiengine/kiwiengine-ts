import { EventMap } from '@webtaku/event-emitter'
import { AnimatedSpriteNode, DelayNode, PhysicsObject, PhysicsObjectOptions, RectangleCollider, RectangleNode } from '../../../src'
import { debugMode } from '../../../src/debug'
import { HpBar } from '../hud/hp-bar'

export type CharacterOptions = {
  maxHp: number
  hp: number
  collider: RectangleCollider
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & PhysicsObjectOptions

export class Character<E extends EventMap = EventMap> extends PhysicsObject<E & {
  takeDamage: (damage: number) => void
}> {
  maxHp: number
  hp: number

  hitbox: RectangleCollider
  hurtbox: RectangleCollider

  #hpBar: HpBar
  protected _sprite?: AnimatedSpriteNode
  #hitboxDebugNode?: RectangleNode
  #tintDelay?: DelayNode

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
      this.#hitboxDebugNode = new RectangleNode({ ...this.hitbox, stroke: 'red', alpha: 0.5, layer: 'hud' })
      this.add(this.#hitboxDebugNode)
      this.add(new RectangleNode({ ...this.hurtbox, stroke: 'green', alpha: 0.5, layer: 'hud' }))
    }
  }

  set hitboxX(x: number) {
    this.hitbox.x = x
    if (this.#hitboxDebugNode) this.#hitboxDebugNode.x = x
  }

  takeDamage(damage: number) {
    this.hp -= damage
    this.#hpBar.hp = this.hp

    if (this._sprite) {
      this._sprite.tint = 0xff0000
      this.#tintDelay?.remove()
      this.#tintDelay = new DelayNode(0.1, () => this._sprite!.tint = 0xffffff)
      this.add(this.#tintDelay)
    }
    (this as any).emit('takeDamage', damage)
  }
}
