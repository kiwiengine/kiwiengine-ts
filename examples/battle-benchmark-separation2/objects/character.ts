import { EventMap } from '@webtaku/event-emitter'
import {
  AnimatedSpriteNode, debugMode, DelayNode, GameObject,
  PhysicsObjectOptions, RectangleCollider, RectangleNode
} from '../../../src'
import { DamageText } from '../hud/damage-text'
import { HealText } from '../hud/heal-text'
import { HpBar } from '../hud/hp-bar'

export type CharacterOptions = {
  maxHp: number
  hp: number
  collider: RectangleCollider
  hitbox: RectangleCollider
  hurtbox: RectangleCollider
  /** 밀어내기 강도 (프레임 보정 전), 0으로 두면 비활성화 */
  separationStrength?: number
} & PhysicsObjectOptions

export abstract class Character<E extends EventMap = EventMap> extends GameObject<E & {
  changeHp: (damage: number) => void
  dead: () => void
}> {
  /** ==== Separation 레지스트리 ==== */
  private static readonly _registry = new Set<Character>()
  static get all(): ReadonlySet<Character> { return this._registry }

  /** 같은 팀/유형 제외 등의 필터가 필요하면 오버라이드 */
  protected canSeparateWith(other: Character): boolean {
    return !this.dead && !other.dead && other !== this
  }

  /** ===== 기본 스탯/컴포넌트 ===== */
  maxHp: number
  hp: number
  dead = false

  /** 충돌은 collider 기준으로만 처리 */
  collider: RectangleCollider
  hitbox: RectangleCollider
  hurtbox: RectangleCollider

  #hpBar: HpBar
  protected _sprite?: AnimatedSpriteNode
  #hitboxDebugNode?: RectangleNode
  #tintDelay?: DelayNode

  /** 밀어내기 강도 */
  protected separationStrength: number

  constructor(options: CharacterOptions) {
    super({ ...options, useYSort: true })
    this.maxHp = options.maxHp
    this.hp = options.hp

    // collider 기반 처리
    this.collider = { ...options.collider }   // 원본 참조 대신 복사해 안전하게 사용
    this.hitbox = { ...options.hitbox }
    this.hurtbox = { ...options.hurtbox }

    this.separationStrength = options.separationStrength ?? 1.0

    this.#hpBar = new HpBar({ y: -30, maxHp: options.maxHp, hp: options.hp, layer: 'hud' })
    this.add(this.#hpBar)

    if (debugMode) {
      this.add(new RectangleNode({ ...this.collider, stroke: 'yellow', alpha: 0.5, layer: 'hud' }))
      this.#hitboxDebugNode = new RectangleNode({ ...this.hitbox, stroke: 'red', alpha: 0.5, layer: 'hud' })
      this.add(this.#hitboxDebugNode)
      this.add(new RectangleNode({ ...this.hurtbox, stroke: 'green', alpha: 0.5, layer: 'hud' }))
    }

    Character._registry.add(this)
  }

  /** 제거 시 레지스트리에서 해제 */
  override remove(...args: any[]) {
    Character._registry.delete(this)
    // @ts-ignore
    return super.remove?.(...args)
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
      this.#tintDelay = new DelayNode(0.1, () => this._sprite!.tint = 0xffffff)
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
      this.#tintDelay = new DelayNode(0.1, () => this._sprite!.tint = 0xffffff)
      this.add(this.#tintDelay)
    }
    ; (this as any).emit('changeHp', amount)
    this.add(new HealText({ y: -20, hp: amount, layer: 'hud' }))
  }

  /** ===== 핵심: collider 기반 소프트 충돌 해소 ===== */
  protected applySeparationByCollider(dt: number) {
    if (this.separationStrength <= 0) return

    // A의 월드 기준 collider 사각형
    const aLeft = this.x + (this.collider?.x ?? 0)
    const aTop = this.y + (this.collider?.y ?? 0)
    const aRight = aLeft + (this.collider?.width ?? 0)
    const aBottom = aTop + (this.collider?.height ?? 0)

    for (const other of Character.all) {
      if (!this.canSeparateWith(other)) continue

      const bLeft = other.x + (other.collider?.x ?? 0)
      const bTop = other.y + (other.collider?.y ?? 0)
      const bRight = bLeft + (other.collider?.width ?? 0)
      const bBottom = bTop + (other.collider?.height ?? 0)

      // AABB 교차 판정
      const intersect =
        aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop
      if (!intersect) continue

      // 축 분리: x/y 중 더 작은 침투량으로 해소
      const overlapX = Math.min(aRight - bLeft, bRight - aLeft)
      const overlapY = Math.min(aBottom - bTop, bBottom - aTop)

      // 해소 벡터
      let sepX = 0, sepY = 0
      if (overlapX < overlapY) {
        // X축으로 밀어냄: 방향은 중심 비교로 결정
        const aCenterX = (aLeft + aRight) * 0.5
        const bCenterX = (bLeft + bRight) * 0.5
        const dir = Math.sign(aCenterX - bCenterX) || (Math.random() < 0.5 ? 1 : -1)
        sepX = dir * overlapX
      } else {
        // Y축으로 밀어냄
        const aCenterY = (aTop + aBottom) * 0.5
        const bCenterY = (bTop + bBottom) * 0.5
        const dir = Math.sign(aCenterY - bCenterY) || (Math.random() < 0.5 ? 1 : -1)
        sepY = dir * overlapY
      }

      // 반씩 나눠 밀기 + 프레임 보정 + 강도
      const push = this.separationStrength * Math.min(dt ?? 0.016, 0.033)
      const mx = (sepX * 0.5) * push
      const my = (sepY * 0.5) * push

      this.x += mx
      this.y += my
      other.x -= mx
      other.y -= my
    }
  }

  /** 엔진의 업데이트 훅 이름이 다르면 여기를 맞춰주세요 */
  protected override update(dt: number) {
    if (this.paused) return

    // 원래 업데이트
    // @ts-ignore
    super.update?.(dt)

    // collider 기반 소프트 충돌
    this.applySeparationByCollider(dt)
  }

  protected abstract onDie(): void
}
