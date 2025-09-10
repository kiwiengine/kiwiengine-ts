import { EventMap } from '@webtaku/event-emitter'
import {
  AnimatedSpriteNode,
  debugMode,
  DelayNode,
  GameObject,
  PhysicsObjectOptions,
  RectangleCollider,
  RectangleNode,
  RectangleRigidbody
} from '../../../src'
import { DamageText } from '../hud/damage-text'
import { HealText } from '../hud/heal-text'
import { HpBar } from '../hud/hp-bar'

export type CharacterOptions = {
  maxHp: number
  hp: number
  rigidbody: RectangleRigidbody
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
} & PhysicsObjectOptions

export abstract class Character<E extends EventMap = EventMap> extends GameObject<E & {
  changeHp: (damage: number) => void
  dead: () => void
}> {
  // ── 고유 ID: 한 페어를 한 번만 해결하기 위한 편향 ─────────────────
  private static _uidCounter = 1
  readonly uid = Character._uidCounter++

  maxHp: number
  hp: number
  dead = false

  rigidbody: RectangleRigidbody
  hitbox: RectangleCollider
  hurtbox: RectangleCollider

  #hpBar: HpBar
  protected _sprite?: AnimatedSpriteNode
  #hitboxDebugNode?: RectangleNode
  #tintDelay?: DelayNode

  // ── 분리 파라미터/상태 (안정화 + 시간 기반 쓰로틀) ────────────────
  #beta = 0.35                 // 부분 보정 계수(0~1)
  #maxPushPerPair = 6          // 한 페어당 프레임 최대 밀기(픽셀)
  #eps = 1e-3                  // 대칭 진동 방지용 미세 오프셋
  #warmupFrames = 30           // 스폰 후 워밍업 프레임 수(강/자주 분리)
  #spawnJitter = 0.25          // 스폰 시 위치에 미세 난수 섞기

  // dt 누적 기반 쓰로틀(초)
  #sepTimerSec = 0
  #sepIntervalSec = 0.033      // 평상시 분리 주기(약 2프레임 @60fps)
  #sepJitterSec = Math.random() * 0.01 // 동기화 붕괴용

  constructor(options: CharacterOptions) {
    super({ ...options, useYSort: true })
    this.maxHp = options.maxHp
    this.hp = options.hp
    this.rigidbody = options.rigidbody
    this.hitbox = options.hitbox
    this.hurtbox = options.hurtbox

    // 스폰 시 완전 대칭 상태 깨기
    if (this.#spawnJitter > 0) {
      this.x += (Math.random() * 2 - 1) * this.#spawnJitter
      this.y += (Math.random() * 2 - 1) * this.#spawnJitter
    }

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp, layer: 'hud' })
    this.add(this.#hpBar)

    if (debugMode) {
      this.add(new RectangleNode({ ...options.rigidbody, stroke: 'yellow', alpha: 0.5, layer: 'hud' }))
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
    if (this.dead) return

    this.hp -= damage
    this.#hpBar.hp = this.hp

    if (this._sprite) {
      this._sprite.tint = 0xff0000
      this.#tintDelay?.remove()
      this.#tintDelay = new DelayNode(0.1, () => (this._sprite!.tint = 0xffffff))
      this.add(this.#tintDelay)
    }
    ; (this as any).emit('changeHp', damage)
    this.add(new DamageText({ y: -20, damage, layer: 'hud' }))

    if (this.hp <= 0) {
      this.dead = true
      this.onDie()
        ; (this as any).emit('dead')
    }
  }

  heal(amount: number) {
    if (this.dead) return

    this.hp = Math.min(this.maxHp, this.hp + amount)
    this.#hpBar.hp = this.hp

    if (this._sprite) {
      this._sprite.tint = 0x00ff00
      this.#tintDelay?.remove()
      this.#tintDelay = new DelayNode(0.1, () => (this._sprite!.tint = 0xffffff))
      this.add(this.#tintDelay)
    }
    ; (this as any).emit('changeHp', amount)
    this.add(new HealText({ y: -20, hp: amount, layer: 'hud' }))
  }

  protected abstract onDie(): void

  // ── 매 프레임: 이동/전투 처리 후 겹침 분리 수행 ────────────────────
  protected override update(dt: number) {
    if (this.paused) return
    super.update(dt)

    // 워밍업 동안: 더 자주(간격 0 → 매 프레임), 조금 더 강하게(β↑)
    const inWarmup = this.#warmupFrames-- > 0
    const intervalSec = inWarmup ? 0 : this.#sepIntervalSec
    const beta = inWarmup ? Math.min(0.6, this.#beta + 0.15) : this.#beta

    this.separateFromNeighbors(dt, 48, 1, intervalSec, beta)
  }

  // ────────────────────────────────────────────────────────────────
  // 겹침 방지(안정화 + dt 기반 쓰로틀)
  separateFromNeighbors(
    dt: number,
    radius = 48,
    iterations = 1,
    intervalSec = 0,        // 0이면 매 프레임 실행
    beta = this.#beta
  ) {
    if (this.dead) return
    const parent = this.parent as any
    if (!parent || !parent.children) return

    // 시간 기반 쓰로틀 (초 단위)
    if (intervalSec > 0) {
      this.#sepTimerSec += dt
      if (this.#sepTimerSec + this.#sepJitterSec < intervalSec) return
      this.#sepTimerSec = 0
    }

    const cx = this.x
    const cy = this.y
    const hw = (this.rigidbody.width ?? 0) * 0.5
    const hh = (this.rigidbody.height ?? 0) * 0.5
    const radius2 = radius * radius
    const eps = this.#eps
    const maxPush = this.#maxPushPerPair

    for (let iter = 0; iter < iterations; iter++) {
      for (const other of parent.children as any[]) {
        if (other === this) continue
        if (!(other instanceof Character)) continue
        if (other.dead) continue

        // 한 페어는 uid 작은 쪽만 처리 → 동시 되밀기 방지
        if (this.uid > (other as Character).uid) continue

        const or = other.rigidbody
        if (!or) continue

        const ocx = other.x
        const ocy = other.y

        // 원거리 프리체크
        const dx0 = ocx - cx
        const dy0 = ocy - cy
        if (dx0 * dx0 + dy0 * dy0 > radius2) continue

        // AABB 침투량
        const ohw = (or.width ?? 0) * 0.5
        const ohh = (or.height ?? 0) * 0.5

        const dx = ocx - cx
        const px = (hw + ohw) - Math.abs(dx)
        if (px <= 0) continue

        const dy = ocy - cy
        const py = (hh + ohh) - Math.abs(dy)
        if (py <= 0) continue

        // 작은 축으로 부분 보정 + 푸시 캡 + ε
        if (px < py) {
          const push = Math.min(maxPush, Math.max(0, px * beta) + eps)
          const half = push * 0.5
          if (dx > 0) {
            this.x -= half
            other.x += half
          } else {
            this.x += half
            other.x -= half
          }
        } else {
          const push = Math.min(maxPush, Math.max(0, py * beta) + eps)
          const half = push * 0.5
          if (dy > 0) {
            this.y -= half
            other.y += half
          } else {
            this.y += half
            other.y -= half
          }
        }
      }
    }
  }
}
