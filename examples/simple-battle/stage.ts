import { IntervalNode, Joystick, PhysicsWorld } from '../../src'
import { Hero } from './objects/hero'
import { Orc } from './objects/orc'
import { Potion } from './objects/potion'

export class Stage extends PhysicsWorld {
  #hero = new Hero();
  #orcs: Set<Orc> = new Set();
  #potions: Set<Potion> = new Set();

  constructor() {
    super()
    this.add(this.#hero)
    this.add(new IntervalNode(1, () => this.#spawnOrc()))
    this.add(new IntervalNode(3, () => this.#spawnPotion()))

    for (let i = 0; i < 1000; i++) {
      this.#spawnOrc()
    }

    const joystickImage = new Image()
    joystickImage.src = 'assets/joystick/joystick.png'

    const knobImage = new Image()
    knobImage.src = 'assets/joystick/knob.png'

    this.add(
      new Joystick({
        onMove: (r, d) => this.#hero.move(r, d),
        onRelease: () => this.#hero.stop(),
        onKeyDown: (code) => {
          if (code === 'KeyA') this.#hero.attack()
        },
        joystickImage,
        knobImage,
        maxKnobDistance: 70,
      }),
    )
  }

  #spawnOrc() {
    const o = new Orc()
    o.x = Math.random() * 800 - 400
    o.y = Math.random() * 600 - 300
    this.add(o)
    this.#orcs.add(o)
  }

  #spawnPotion() {
    const p = new Potion()
    p.x = Math.random() * 800 - 400
    p.y = Math.random() * 600 - 300
    this.add(p)
    this.#potions.add(p)
  }

  protected override update(dt: number) {
    super.update(dt)

    for (const o of this.#orcs) {
      o.moveTo(this.#hero.x, this.#hero.y)
    }
  }
}
