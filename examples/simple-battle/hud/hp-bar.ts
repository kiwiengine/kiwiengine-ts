import { GameObject, GameObjectOptions, RectangleNode } from '../../../src/index'

const HP_BAR_WIDTH = 26

export type HpBarOptions = {
  maxHp: number
  hp: number
} & GameObjectOptions

export class HpBar extends GameObject {
  #bg = new RectangleNode({ width: HP_BAR_WIDTH, height: 4, fill: '#000000', alpha: 0.4 })
  #fg = new RectangleNode({ width: HP_BAR_WIDTH, height: 4, fill: '#ff3b30' })

  #maxHp: number
  #hp: number

  constructor(options: HpBarOptions) {
    super(options)
    this.#maxHp = options.maxHp
    this.#hp = options.hp
    this.add(this.#bg, this.#fg)
    this.#updateFg()
  }

  #updateFg() {
    const ratio = Math.max(0, Math.min(1, this.#hp / this.#maxHp))
    const newWidth = HP_BAR_WIDTH * ratio
    this.#fg.width = newWidth
    this.#fg.x = -(HP_BAR_WIDTH - newWidth) / 2
  }

  set hp(hp: number) {
    this.#hp = hp
    this.#updateFg()
  }

  get hp() { return this.#hp }
}
