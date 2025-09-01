import { GameObject, GameObjectOptions } from '../../../src'
import { HpBar } from '../hud/hp-bar'

export class Hitbox { }

export class Hurtbox { }

export type CharacterOptions = {
  maxHp: number
  hp: number
} & GameObjectOptions

export class Character extends GameObject {
  maxHp: number
  hp: number

  #hpBar: HpBar

  constructor(options: CharacterOptions) {
    super(options)
    this.maxHp = options.maxHp
    this.hp = options.hp

    this.#hpBar = new HpBar({ maxHp: options.maxHp, hp: options.hp })
    this.add(this.#hpBar)
  }
}
