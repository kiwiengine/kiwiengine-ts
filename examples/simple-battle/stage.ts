import { checkCollision, IntervalNode, isMobile, Joystick, musicPlayer, PhysicsWorld } from '../../src'
import { Hero } from './objects/hero'
import { Orc } from './objects/orc'
import { Potion } from './objects/potion'

function createTextElement() {
  const el = document.createElement('div')
  el.style.color = 'white'
  el.style.position = 'absolute'
  el.style.top = '10px'
  el.style.zIndex = '1'
  return el
}

const SCORE_PER_ORC = 100

export class Stage extends PhysicsWorld {
  #hero = new Hero();
  #orcs: Set<Orc> = new Set();
  #potions: Set<Potion> = new Set();

  #time = 0
  #score = 0
  #isGameOver = false

  #timeText: HTMLDivElement
  #hpText: HTMLDivElement
  #scoreText: HTMLDivElement

  #spawnOrcInterval: IntervalNode
  #spawnPotionInterval: IntervalNode

  constructor() {
    super()
    musicPlayer.play('assets/bgm/battle.mp3')

    this.add(this.#hero)
    this.add(this.#spawnOrcInterval = new IntervalNode(1, () => this.#spawnOrc()))
    this.add(this.#spawnPotionInterval = new IntervalNode(3, () => this.#spawnPotion()))

    //for (let i = 0; i < 1000; i++) {
    //this.#spawnOrc()
    //}

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

    this.#timeText = createTextElement()
    this.#hpText = createTextElement()
    this.#scoreText = createTextElement()

    this.#timeText.textContent = `Time: ${this.#time}`
    this.#hpText.textContent = `HP: ${this.#hero.hp}`
    this.#scoreText.textContent = `Score: ${this.#score}`

    this.#timeText.style.left = '10px'
    this.#hpText.style.left = '50%'
    this.#hpText.style.transform = 'translate(-50%, 0)'
    this.#scoreText.style.right = '10px'

    this.#hero.on('hit', (damage) => {
      for (const o of this.#orcs) {
        if (checkCollision(this.#hero.hitbox, this.#hero.worldTransform, o.hurtbox, o.worldTransform)) {
          o.takeDamage(damage)
        }
      }
    })

    this.#hero.on('changeHp', () => {
      this.#hpText.textContent = `HP: ${this.#hero.hp}`
    })

    this.#hero.on('dead', () => {
      this.#gameOver()
    })
  }

  #gameOver() {
    this.#isGameOver = true
    this.#spawnOrcInterval.remove()
    this.#spawnPotionInterval.remove()
    for (const o of this.#orcs) {
      o.stop()
    }

    const gameOverText = createTextElement()
    gameOverText.textContent = 'Game Over'
    gameOverText.style.left = '50%'
    gameOverText.style.top = '50%'
    gameOverText.style.transform = 'translate(-50%, -50%)'
    this.renderer?.container.append(gameOverText)
  }

  protected override set renderer(renderer) {
    super.renderer = renderer

    if (renderer) {
      const c = renderer.container
      c.append(this.#timeText, this.#hpText, this.#scoreText)
    }
  }

  protected override get renderer() {
    return super.renderer
  }

  #spawnOrc() {
    const o = new Orc()
    o.x = Math.random() * 800 - 400
    o.y = Math.random() * 600 - 300
    o.on('hit', (damage) => {
      if (checkCollision(this.#hero.hurtbox, this.#hero.worldTransform, o.hitbox, o.worldTransform)) {
        this.#hero.takeDamage(damage)
      }
    })
    this.add(o)
    this.#orcs.add(o)
    o.on('dead', () => {
      this.#orcs.delete(o)
      this.#score += SCORE_PER_ORC
      this.#scoreText.textContent = `Score: ${this.#score}`
    })
  }

  #spawnPotion() {
    const p = new Potion()
    p.x = Math.random() * 800 - 400
    p.y = Math.random() * 600 - 300
    this.add(p)
    this.#potions.add(p)
    p.on('remove', () => this.#potions.delete(p))
  }

  protected override update(dt: number) {
    super.update(dt)
    if (this.#isGameOver) return

    const h = this.#hero
    if (h.dead) return

    for (const o of this.#orcs) {
      if (checkCollision(h.hurtbox, h.worldTransform, o.hitbox, o.worldTransform)) {
        o.attack()
      } else {
        o.moveTo(this.#hero.x, this.#hero.y)
      }

      if (isMobile && checkCollision(h.hitbox, h.worldTransform, o.hurtbox, o.worldTransform)) {
        h.attack()
      }
    }

    for (const p of this.#potions) {
      if (checkCollision(h.hitbox, h.worldTransform, p.triggerCollider, p.worldTransform)) {
        h.heal(p.healAmount)
        p.remove()
      }
    }
  }
}
