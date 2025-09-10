import {
  AnimatedSpriteNode,
  ColliderType,
  DelayNode,
  GameObjectOptions,
  RigidbodyType,
  sfxPlayer,
} from '../../../src/index'
import orcAtlas from '../assets/spritesheets/orc-atlas.json'
import { Character } from './character'

const ORC_MOVE_SPEED = 3 as const         // 엔진이 dt(초)를 주면 아래 step 계산 주석 참고
const ORC_HITBOX_X = 24 as const
const ORC_ATTACK_DAMAGE = 1 as const
const EPS = 1e-3                          // 스냅/오버슈트 방지용
const EPS2 = EPS * EPS

export class Orc extends Character<{
  hit: (damage: number) => void
  dead: () => void
}> {
  protected _sprite: AnimatedSpriteNode

  // ── 타겟/방향(정규화) ─────────────────────────────────────────────
  #tx: number | null = null
  #ty: number | null = null
  #dirX = 0
  #dirY = 0
  #moveSpeed = ORC_MOVE_SPEED

  // ── 상태 ─────────────────────────────────────────────────────────
  #attacking = false

  constructor(options?: GameObjectOptions) {
    super({
      ...options,
      maxHp: 100,
      hp: 100,
      rigidbody: { type: RigidbodyType.Rectangle, width: 30, height: 30 },
      hitbox: { type: ColliderType.Rectangle, width: 32, height: 52, x: ORC_HITBOX_X, y: -8 },
      hurtbox: { type: ColliderType.Rectangle, width: 24, height: 32, x: 0, y: 0 },
    })

    this._sprite = new AnimatedSpriteNode({
      src: 'assets/spritesheets/orc.png',
      atlas: orcAtlas,
      animation: 'idle',
      scale: 2,
    })

    this._sprite.on('animationend', (animation: string) => {
      if (animation.startsWith('attack')) {
        this.#attacking = false
        // 이동 중이면 walk, 아니면 idle (중복 전환 방지)
        if (this.#isMoving()) this.#setWalk()
        else this.#setIdle()
      } else if (animation === 'die') {
        this.emit('dead')
      }
    })

    this.add(this._sprite)
  }

  // ── 외부 인터페이스 ──────────────────────────────────────────────
  moveTo(x: number, y: number) {
    if (this.dead) return
    this.#tx = x
    this.#ty = y

    // 방향 벡터 미리 정규화(삼각함수 없음)
    const dx = x - this.x
    const dy = y - this.y
    const len2 = dx * dx + dy * dy
    if (len2 > EPS2) {
      // 역길이 계산(정확 sqrt 대신 1/sqrt 사용; JS에 fast invsqrt 없음)
      const invLen = 1 / Math.sqrt(len2)
      this.#dirX = dx * invLen
      this.#dirY = dy * invLen
    } else {
      this.#dirX = 0
      this.#dirY = 0
    }

    // 좌우 플립/히트박스 오프셋(부호만 필요)
    const scale = Math.abs(this._sprite.scaleX)
    this._sprite.scaleX = dx >= 0 ? scale : -scale
    this.hitboxX = dx >= 0 ? ORC_HITBOX_X : -ORC_HITBOX_X

    if (!this.#attacking) this.#setWalk()
  }

  stop() {
    this.#tx = null
    this.#ty = null
    this.#dirX = 0
    this.#dirY = 0
    if (!this.#attacking && !this.dead) this.#setIdle()
  }

  attack() {
    if (this.dead || this.#attacking) return
    this.#attacking = true
    // 이동 즉시 정지(불필요한 계산 차단)
    this.#tx = null
    this.#ty = null
    this.#dirX = 0
    this.#dirY = 0

    // 랜덤 공격 모션(애니메이션 변경 최소)
    const nextAnim = (Math.random() < 0.5) ? 'attack1' : 'attack2'
    if (this._sprite.animation !== nextAnim) {
      this._sprite.animation = nextAnim
    }

    // 타격 타이밍
    this.add(new DelayNode(0.3, () => this.emit('hit', ORC_ATTACK_DAMAGE)))

    // SFX (대량 동시 재생은 믹서에서 한정/풀링 권장)
    sfxPlayer.playRandom(
      'assets/sfx/orc/miss/miss1.wav',
      'assets/sfx/orc/miss/miss2.wav',
      'assets/sfx/orc/miss/miss3.wav'
    )
  }

  // ── 루프 ─────────────────────────────────────────────────────────
  protected override update(dt: number) {
    if (this.paused) return
    super.update(dt)

    if (this.dead || this.#attacking) return
    if (this.#tx === null || this.#ty === null) return

    // 남은 거리 제곱(정확 sqrt 불필요)
    const rx = this.#tx - this.x
    const ry = this.#ty - this.y
    const remaining2 = rx * rx + ry * ry
    if (remaining2 <= EPS2) {
      // 도착 처리
      this.x = this.#tx
      this.y = this.#ty
      this.stop()
      return
    }

    // 한 프레임 이동량(step)
    const step = this.#moveSpeed * (dt > 0 ? dt * 60 : 1)   // 프레임 기준 정규화

    // 오버슈트 방지: step^2와 remaining^2 비교
    const step2 = step * step
    if (remaining2 <= step2) {
      this.x = this.#tx
      this.y = this.#ty
      this.stop()
      return
    }

    // 미리 정규화해둔 방향으로 이동(삼각함수 없음)
    this.x += this.#dirX * step
    this.y += this.#dirY * step

    // 진행 방향에 따른 좌우 플립/히트박스 (dirX 부호만 사용)
    const scale = Math.abs(this._sprite.scaleX)
    const dirX = this.#dirX
    if (dirX > 0) {
      if (this._sprite.scaleX < 0) this._sprite.scaleX = scale
      if (this.hitboxX !== ORC_HITBOX_X) this.hitboxX = ORC_HITBOX_X
    } else if (dirX < 0) {
      if (this._sprite.scaleX > 0) this._sprite.scaleX = -scale
      if (this.hitboxX !== -ORC_HITBOX_X) this.hitboxX = -ORC_HITBOX_X
    }

    // 이동 중 애니메이션 보장(중복 전환 방지)
    if (this._sprite.animation !== 'walk') this.#setWalk()
  }

  // ── 피격/사망 ────────────────────────────────────────────────────
  override takeDamage(damage: number) {
    super.takeDamage(damage)
    sfxPlayer.playRandom(
      'assets/sfx/orc/hit/hit1.wav',
      'assets/sfx/orc/hit/hit2.wav',
      'assets/sfx/orc/hit/hit3.wav'
    )
  }

  protected override onDie() {
    this.#tx = null
    this.#ty = null
    this.#dirX = 0
    this.#dirY = 0
    if (this._sprite.animation !== 'die') {
      this._sprite.animation = 'die'
    }
    sfxPlayer.play('assets/sfx/orc/die/die.wav')
  }

  // ── 내부 유틸 ────────────────────────────────────────────────────
  #isMoving() {
    return this.#tx !== null && this.#ty !== null
  }
  #setWalk() {
    if (this._sprite.animation !== 'walk') {
      this._sprite.animation = 'walk'
    }
  }
  #setIdle() {
    if (this._sprite.animation !== 'idle') {
      this._sprite.animation = 'idle'
    }
  }
}
