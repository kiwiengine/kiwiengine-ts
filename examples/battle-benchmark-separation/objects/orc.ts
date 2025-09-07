import {
  AnimatedSpriteNode,
  ColliderType,
  DelayNode,
  GameObjectOptions,
  sfxPlayer,
} from '../../../src/index'
import orcAtlas from '../assets/spritesheets/orc-atlas.json'
import { Character } from './character'

/** 이동은 "목표 좌표"를 향해 update에서 직접 갱신 */
const ORC_MOVE_SPEED = 3 as const               // 프레임당 또는 엔진 기본 단위 (dt 사용 시 아래 참조)
const ORC_HITBOX_X = 24 as const
const ORC_ATTACK_DAMAGE = 1 as const

export class Orc extends Character<{
  hit: (damage: number) => void
  dead: () => void
}> {
  protected _sprite: AnimatedSpriteNode

  // === 타겟 기반 이동 상태 ===
  #targetX: number | null = null
  #targetY: number | null = null
  #moveSpeed = ORC_MOVE_SPEED

  // === 전투 상태 ===
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
      scale: 2,
    })

    this._sprite.on('animationend', (animation: string) => {
      if (animation.startsWith('attack')) {
        this.#attacking = false
        // 공격 종료 후 이동 중이면 walk, 아니면 idle
        if (this.#isMoving()) this.#setWalk()
        else this.#setIdle()
      } else if (animation === 'die') {
        this.emit('dead')
      }
    })

    this.add(this._sprite)
  }

  /** 외부에서 목표 좌표를 지정 */
  moveTo(x: number, y: number) {
    if (this.dead) return
    this.#targetX = x
    this.#targetY = y

    // 좌우 플립 및 히트박스 방향
    const dx = x - this.x
    const scale = Math.abs(this._sprite.scaleX)
    this._sprite.scaleX = dx >= 0 ? scale : -scale
    this.hitboxX = dx >= 0 ? ORC_HITBOX_X : -ORC_HITBOX_X

    // 이동 애니메이션 전환 (공격 중이면 유지)
    if (!this.#attacking) this.#setWalk()
  }

  /** 이동 정지 */
  stop() {
    this.#targetX = null
    this.#targetY = null
    if (!this.#attacking && !this.dead) this.#setIdle()
  }

  /** 근접 공격 */
  attack() {
    if (this.dead || this.#attacking) return
    this.#attacking = true

    // 공격 시 즉시 정지
    this.stop()

    // 두 가지 공격 모션 중 랜덤
    this._sprite.animation = Math.floor(Math.random() * 2) ? 'attack1' : 'attack2'
    this._sprite.loop = false

    // 타격 타이밍 (필요 시 시간값 조정)
    this.add(new DelayNode(0.3, () => this.emit('hit', ORC_ATTACK_DAMAGE)))

    // 효과음
    sfxPlayer.playRandom(
      'assets/sfx/orc/miss/miss1.wav',
      'assets/sfx/orc/miss/miss2.wav',
      'assets/sfx/orc/miss/miss3.wav'
    )
  }

  /** 매 프레임 위치를 "목표 좌표"를 향해 직접 갱신 */
  protected override update(dt: number) {
    super.update(dt)
    if (this.dead) return

    if (this.#targetX !== null && this.#targetY !== null && !this.#attacking) {
      const dx = this.#targetX - this.x
      const dy = this.#targetY - this.y
      const dist = Math.hypot(dx, dy)

      if (dist > 0) {
        const step = Math.min(this.#moveSpeed * dt * 60, dist)

        // 진행 방향(좌우 플립 유지)
        if (Math.abs(dx) > 0.001) {
          const scale = Math.abs(this._sprite.scaleX)
          this._sprite.scaleX = dx >= 0 ? scale : -scale
          this.hitboxX = dx >= 0 ? ORC_HITBOX_X : -ORC_HITBOX_X
        }

        // 한 스텝 전진
        const rad = Math.atan2(dy, dx)
        this.x += Math.cos(rad) * step
        this.y += Math.sin(rad) * step

        // 거의 도착하면 스냅 & 정지
        if (dist - step <= 0.001) {
          this.x = this.#targetX
          this.y = this.#targetY
          this.stop()
        } else {
          // 이동 중 애니메이션 보장
          if (!this.#attacking) this.#setWalk()
        }
      }
    }
  }

  /** 피격 처리 */
  override takeDamage(damage: number) {
    super.takeDamage(damage)
    sfxPlayer.playRandom(
      'assets/sfx/orc/hit/hit1.wav',
      'assets/sfx/orc/hit/hit2.wav',
      'assets/sfx/orc/hit/hit3.wav'
    )
  }

  /** 사망 처리 */
  protected override onDie() {
    this.#targetX = null
    this.#targetY = null
    this._sprite.animation = 'die'
    this._sprite.loop = false
    sfxPlayer.play('assets/sfx/orc/die/die.wav')
  }

  // ===== 내부 유틸 =====
  #isMoving() {
    return this.#targetX !== null && this.#targetY !== null
  }

  #setWalk() {
    if (this._sprite.animation !== 'walk') {
      this._sprite.animation = 'walk'
      this._sprite.loop = true
    }
  }

  #setIdle() {
    if (this._sprite.animation !== 'idle') {
      this._sprite.animation = 'idle'
      this._sprite.loop = true
    }
  }
}
