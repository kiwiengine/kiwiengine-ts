import { checkCollision, IntervalNode, isMobile, musicPlayer, PhysicsWorld } from '../../src'
import { Hero } from './objects/hero'
import { Orc } from './objects/orc'
import { Potion } from './objects/potion'

/** UI 헬퍼 */
function createTextElement() {
  const el = document.createElement('div')
  el.style.color = 'white'
  el.style.position = 'absolute'
  el.style.top = '10px'
  el.style.zIndex = '1'
  el.style.userSelect = 'none'
  el.style.pointerEvents = 'none'
  return el
}

/** 밸런스 상수 */
const SCORE_PER_ORC = 100
const ATTACK_COOLDOWN = 0.3
const SEEK_POTION_HP_THRESHOLD = 500
const STOP_DIST2 = 25 // 정지 판단 제곱거리(≈5px)

/**
 * 메인 스테이지
 * - 오브젝트 스폰
 * - UI 갱신
 * - 영웅 AI(FSM) 구동
 */
export class Stage extends PhysicsWorld {
  // === 게임 오브젝트 컨테이너 ===
  #hero = new Hero()
  #orcs: Set<Orc> = new Set()
  #potions: Set<Potion> = new Set()

  // === 게임 상태 ===
  #time = 0
  #score = 0
  #isGameOver = false

  // === UI 엘리먼트 ===
  #timeText: HTMLDivElement
  #hpText: HTMLDivElement
  #scoreText: HTMLDivElement

  // === 스폰 타이머 ===
  #spawnOrcInterval: IntervalNode
  #spawnPotionInterval: IntervalNode
  #tickInterval: IntervalNode

  // === 영웅 AI (FSM) ===
  #aiState: 'idle' | 'chasing' | 'attacking' | 'returning' | 'seekingPotion' = 'idle'
  #targetOrc?: Orc
  #targetPotion?: Potion
  #attackCooldown = 0
  #homeX = 0
  #homeY = 0

  constructor() {
    super()

    // BGM
    musicPlayer.play('assets/bgm/battle.mp3')

    // 월드 구성
    this.add(this.#hero)
    this.add(this.#spawnOrcInterval = new IntervalNode(1, () => this.#spawnOrc()))
    this.add(this.#spawnPotionInterval = new IntervalNode(3, () => this.#spawnPotion()))
    this.add(this.#tickInterval = new IntervalNode(1, () => this.#tick()))

    // UI 초기화
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

    // 이벤트 바인딩
    this.#bindHeroEvents()

    // 영웅 초기 위치를 "집"으로 저장
    this.#homeX = this.#hero.x
    this.#homeY = this.#hero.y
  }

  /** 주기적 시각/스코어 갱신 */
  #tick() {
    this.#time += 1
    this.#timeText.textContent = `Time: ${this.#time}`
    // HP/Score는 각각 변경 시점 이벤트에서 갱신
  }

  /** 영웅-오크-포션 충돌/전투 이벤트 */
  #bindHeroEvents() {
    // 영웅 공격 성공 시 오크에게 피해 적용
    this.#hero.on('hit', (damage: number) => {
      for (const o of this.#orcs) {
        if (checkCollision(this.#hero.hitbox, this.#hero.worldTransform, o.hurtbox, o.worldTransform)) {
          o.takeDamage(damage)
        }
      }
    })

    // HP 변동 UI
    this.#hero.on('changeHp', () => {
      this.#hpText.textContent = `HP: ${this.#hero.hp}`
    })

    // 영웅 사망 처리
    this.#hero.on('dead', () => {
      this.#gameOver()
    })
  }

  /** 게임오버 처리 */
  #gameOver() {
    if (this.#isGameOver) return
    this.#isGameOver = true

    this.#spawnOrcInterval.remove()
    this.#spawnPotionInterval.remove()
    this.#tickInterval.remove()

    for (const o of this.#orcs) o.stop()

    const gameOverText = createTextElement()
    gameOverText.textContent = 'Game Over'
    gameOverText.style.left = '50%'
    gameOverText.style.top = '50%'
    gameOverText.style.transform = 'translate(-50%, -50%)'
    gameOverText.style.fontSize = '32px'
    this.renderer?.container.append(gameOverText)
  }

  // ==== 렌더러 연결 시 UI 붙이기 ====
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

  // ==== 스폰 로직 ====
  #spawnOrc() {
    const o = new Orc()
    o.x = Math.random() * 800 - 400
    o.y = Math.random() * 600 - 300

    // 오크 공격 → 영웅 피해
    o.on('hit', (damage: number) => {
      if (checkCollision(this.#hero.hurtbox, this.#hero.worldTransform, o.hitbox, o.worldTransform)) {
        this.#hero.takeDamage(damage)
      }
    })

    // 오크 제거 및 점수 반영
    o.on('dead', () => {
      this.#orcs.delete(o)
      this.#score += SCORE_PER_ORC
      this.#scoreText.textContent = `Score: ${this.#score}`
    })

    this.add(o)
    this.#orcs.add(o)
  }

  #spawnPotion() {
    const p = new Potion()
    p.x = Math.random() * 800 - 400
    p.y = Math.random() * 600 - 300
    this.add(p)
    this.#potions.add(p)
    p.on('remove', () => this.#potions.delete(p))
  }

  // ==== 유틸: 가장 가까운 오크/포션 ====
  #getClosestOrc(): Orc | undefined {
    let best: Orc | undefined
    let minD2 = Infinity
    for (const o of this.#orcs) {
      if (o.dead) continue
      const dx = o.x - this.#hero.x
      const dy = o.y - this.#hero.y
      const d2 = dx * dx + dy * dy
      if (d2 < minD2) { minD2 = d2; best = o }
    }
    return best
  }

  #getClosestPotion(): Potion | undefined {
    let best: Potion | undefined
    let minD2 = Infinity
    for (const p of this.#potions) {
      const dx = p.x - this.#hero.x
      const dy = p.y - this.#hero.y
      const d2 = dx * dx + dy * dy
      if (d2 < minD2) { minD2 = d2; best = p }
    }
    return best
  }

  // ==== 메인 업데이트 ====
  protected override update(dt: number) {
    super.update(dt)
    if (this.#isGameOver) return

    const h = this.#hero
    if (h.dead) return

    // ===== 오크 AI(영웅 추적/공격) =====
    for (const o of this.#orcs) {
      if (checkCollision(h.hurtbox, h.worldTransform, o.hitbox, o.worldTransform)) {
        o.attack()
      } else {
        o.moveTo(h.x, h.y)
      }

      // 모바일에서 근접 시 자동 공격(품질 개선)
      if (isMobile && checkCollision(h.hitbox, h.worldTransform, o.hurtbox, o.worldTransform)) {
        h.attack()
      }
    }

    // ===== 포션 줍기(충돌은 월드가 처리, heal & remove는 아래 루프에서) =====
    for (const p of this.#potions) {
      if (checkCollision(h.hitbox, h.worldTransform, p.triggerCollider, p.worldTransform)) {
        h.heal(p.healAmount)
        this.#hpText.textContent = `HP: ${h.hp}`
        p.remove()
      }
    }

    // ===== 영웅 AI(FSM) =====

    // 1) HP 낮으면 포션 최우선
    if (h.hp < SEEK_POTION_HP_THRESHOLD && this.#potions.size > 0) {
      const closest = this.#getClosestPotion()
      if (closest) {
        this.#targetPotion = closest
        this.#aiState = 'seekingPotion'
      }
    } else if (this.#aiState === 'seekingPotion') {
      // 임계치 해소되면 취소
      this.#targetPotion = undefined
      this.#aiState = 'idle'
    }

    switch (this.#aiState) {
      case 'idle': {
        // 타겟 오크 탐색
        const tgt = this.#getClosestOrc()
        if (tgt) {
          this.#targetOrc = tgt
          this.#aiState = 'chasing'
        } else {
          // 적이 없으면 집으로 복귀
          this.#aiState = 'returning'
        }
        break
      }

      case 'chasing': {
        const t = this.#targetOrc
        if (!t || t.dead) {
          const nxt = this.#getClosestOrc()
          if (nxt) {
            this.#targetOrc = nxt
          } else {
            this.#targetOrc = undefined
            this.#aiState = 'returning'
          }
          break
        }

        const inRange = checkCollision(h.hitbox, h.worldTransform, t.hurtbox, t.worldTransform)
        if (!inRange) {
          h.moveTo(t.x, t.y)
        } else {
          // 정지(엔진에 stop이 없으면 현재 위치로 moveTo)
          if ((h as any).stop) (h as any).stop()
          else h.moveTo(h.x, h.y)

          h.attack()
          this.#attackCooldown = ATTACK_COOLDOWN
          this.#aiState = 'attacking'
        }
        break
      }

      case 'attacking': {
        const t = this.#targetOrc
        if (!t || t.dead) {
          const nxt = this.#getClosestOrc()
          if (nxt) {
            this.#targetOrc = nxt
            this.#aiState = 'chasing'
          } else {
            this.#targetOrc = undefined
            this.#aiState = 'returning'
          }
          this.#attackCooldown = 0
          break
        }

        if (this.#attackCooldown <= 0) {
          const inRange = checkCollision(h.hitbox, h.worldTransform, t.hurtbox, t.worldTransform)
          if (inRange) {
            h.attack()
            this.#attackCooldown = ATTACK_COOLDOWN
          } else {
            this.#aiState = 'chasing'
          }
        } else {
          this.#attackCooldown -= dt
        }
        break
      }

      case 'returning': {
        const dx = this.#homeX - h.x
        const dy = this.#homeY - h.y
        const d2 = dx * dx + dy * dy
        if (d2 > STOP_DIST2) {
          h.moveTo(this.#homeX, this.#homeY)
        } else {
          if ((h as any).stop) (h as any).stop()
          else h.moveTo(h.x, h.y)
          this.#aiState = 'idle'
        }
        break
      }

      case 'seekingPotion': {
        const p = this.#targetPotion
        if (!p) {
          this.#aiState = 'idle'
          break
        }
        const dx = p.x - h.x
        const dy = p.y - h.y
        const d2 = dx * dx + dy * dy
        if (d2 > STOP_DIST2) {
          h.moveTo(p.x, p.y)
        } else {
          if ((h as any).stop) (h as any).stop()
          else h.moveTo(h.x, h.y)
          // 실제 힐/삭제는 위 충돌 루프에서 처리
        }
        break
      }
    }
  }
}
