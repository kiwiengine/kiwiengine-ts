import { AnimatedSpriteNode, ColliderType, DelayNode, GameObjectOptions, sfxPlayer } from '../../../src/index'
import orcAtlas from '../assets/spritesheets/orc-atlas.json'
import { Character } from './character'

const ORC_MOVE_VELOCITY = 3 as const
const ORC_HITBOX_X = 24 as const
const ORC_ATTACK_DAMAGE = 25 as const

export class Orc extends Character<{
  hit: (damage: number) => void
  dead: () => void
}> {
  protected _sprite: AnimatedSpriteNode

  #cachedVelX = 0
  #cachedVelY = 0
  #attacking = false

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
    this._sprite.on('animationend', (animation) => {
      if (animation.startsWith('attack')) {
        this.#attacking = false
        this._sprite.animation = 'idle'
      } else if (animation === 'die') {
        this.emit('dead')
      }
    })
    this.add(this._sprite)
  }

  moveTo(x: number, y: number) {
    if (this.dead) return

    const dx = x - this.x
    const dy = y - this.y
    const radian = Math.atan2(dy, dx)
    this.#cachedVelX = Math.cos(radian) * ORC_MOVE_VELOCITY
    this.#cachedVelY = Math.sin(radian) * ORC_MOVE_VELOCITY

    const scale = Math.abs(this._sprite.scaleX)
    this._sprite.scaleX = dx > 0 ? scale : -scale
    this.hitboxX = dx > 0 ? ORC_HITBOX_X : -ORC_HITBOX_X
  }

  stop() {
    this.#cachedVelX = 0
    this.#cachedVelY = 0
  }

  attack() {
    if (this.dead || this.#attacking) return
    this.#attacking = true

    this.#cachedVelX = 0
    this.#cachedVelY = 0

    this._sprite.animation = Math.floor(Math.random() * 2) ? 'attack1' : 'attack2'

    this.add(new DelayNode(0.3, () => this.emit('hit', ORC_ATTACK_DAMAGE)))

    sfxPlayer.playRandom(
      'assets/sfx/orc/miss/miss1.wav',
      'assets/sfx/orc/miss/miss2.wav',
      'assets/sfx/orc/miss/miss3.wav'
    )
  }

  protected override update(dt: number) {
    super.update(dt)
    this.velocityX = this.#cachedVelX
    this.velocityY = this.#cachedVelY
  }

  override takeDamage(damage: number) {
    super.takeDamage(damage)
    sfxPlayer.playRandom(
      'assets/sfx/orc/hit/hit1.wav',
      'assets/sfx/orc/hit/hit2.wav',
      'assets/sfx/orc/hit/hit3.wav'
    )
  }

  protected override onDie() {
    this._sprite.animation = 'die'
    this._sprite.loop = false
    this.#cachedVelX = 0
    this.#cachedVelY = 0
    this.disableCollisions()

    sfxPlayer.play('assets/sfx/orc/die/die.wav')
  }
}
