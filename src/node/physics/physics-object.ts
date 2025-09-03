import { EventMap } from '@webtaku/event-emitter'
import Matter, { IChamferableBodyDefinition } from 'matter-js'
import { Container as PixiContainer } from 'pixi.js'
import { Collider, ColliderType } from '../../collision/colliders'
import { GameNode } from '../core/game-node'
import { isRenderableNode, RenderableNode } from '../core/renderable'
import { LocalTransform } from '../core/transform'
import { PhysicsWorld } from './physics-world'

function createEllipseBody(
  x: number,
  y: number,
  width: number,
  height: number,
  options: IChamferableBodyDefinition = {},
  // segLen은 "인접 정점 사이의 목표 간격(px)" 정도로 생각하면 됩니다.
  segLen = 6
): Matter.Body {
  const rx = width / 2
  const ry = height / 2

  // 주변길이 ~ π(a+b) 근사 → 그 길이를 segLen 간격으로 쪼개서 정점 수 결정
  const perimeterApprox = Math.PI * (rx + ry)
  const segments = Math.max(12, Math.ceil(perimeterApprox / segLen))

  const verts = Array.from({ length: segments }, (_, i) => {
    const t = (i / segments) * Math.PI * 2
    return { x: Math.cos(t) * rx, y: Math.sin(t) * ry }
  })

  // fromVertices는 로컬 기준이므로 x,y는 중심 위치로 넘깁니다.
  return Matter.Bodies.fromVertices(x, y, [verts], options)
}

export type PhysicsObjectOptions = {
  collider: Collider
  x?: number
  y?: number
  rotation?: number
  fixedRotation?: boolean
  velocityX?: number
  velocityY?: number
  isStatic?: boolean
}

export class PhysicsObject<E extends EventMap = EventMap> extends RenderableNode<PixiContainer, E> {
  #localTransform = new LocalTransform()
  #matterBody: Matter.Body

  constructor(options: PhysicsObjectOptions) {
    super(new PixiContainer({ sortableChildren: true }))

    const c = options.collider
    const x = options.x ?? 0
    const y = options.y ?? 0

    const bodyOptions: IChamferableBodyDefinition = {
      angle: options.rotation ?? 0,
      velocity: { x: options.velocityX ?? 0, y: options.velocityY ?? 0 },
      isStatic: options.isStatic ?? false
    }

    if (options.fixedRotation) {
      bodyOptions.inertia = Infinity
      bodyOptions.angularVelocity = 0
    }

    if (c.type === ColliderType.Rectangle) {
      this.#matterBody = Matter.Bodies.rectangle(x, y, c.width, c.height, bodyOptions)
    } else if (c.type === ColliderType.Circle) {
      this.#matterBody = Matter.Bodies.circle(x, y, c.radius, bodyOptions)
    } else if (c.type === ColliderType.Ellipse) {
      this.#matterBody = createEllipseBody(
        x, y, c.width, c.height, bodyOptions,
        /* segLen= */ 6 // 더 매끄럽게 하고 싶으면 더 작게
      )
    } else if (c.type === ColliderType.Polygon) {
      this.#matterBody = Matter.Bodies.fromVertices(x, y, [c.vertices], bodyOptions)
    } else {
      throw new Error('Invalid collider type')
    }
  }

  protected override set parent(parent: GameNode<EventMap> | undefined) {
    if (!(parent instanceof PhysicsWorld)) {
      const actual = parent === undefined
        ? 'undefined'
        : parent.constructor?.name ?? typeof parent
      throw new Error(`PhysicsObject parent must be PhysicsWorld, but got ${actual}`)
    }
    parent.addBody(this.#matterBody)
    super.parent = parent
  }

  protected override get parent() {
    return super.parent
  }

  override _updateWorldTransform() {
    const mb = this.#matterBody

    const pc = this._pixiContainer
    pc.position.set(mb.position.x, mb.position.y)
    pc.rotation = mb.angle

    const lt = this.#localTransform
    lt.x = mb.position.x
    lt.y = mb.position.y
    lt.rotation = mb.angle

    const parent = this.parent
    if (parent && isRenderableNode(parent)) {
      this.worldTransform.update(parent.worldTransform, this.#localTransform)
    }

    super._updateWorldTransform()
  }

  override remove() {
    (this.parent as PhysicsWorld)?.removeBody(this.#matterBody)
    super.remove()
  }

  set x(v) { Matter.Body.setPosition(this.#matterBody, { x: v, y: this.#matterBody.position.y }) }
  get x() { return this.#matterBody.position.x }

  set y(v) { Matter.Body.setPosition(this.#matterBody, { x: this.#matterBody.position.x, y: v }) }
  get y() { return this.#matterBody.position.y }

  set rotation(v) { Matter.Body.setAngle(this.#matterBody, v) }
  get rotation() { return this.#matterBody.angle }

  set velocityX(v) { Matter.Body.setVelocity(this.#matterBody, { x: v, y: this.#matterBody.velocity.y }) }
  get velocityX() { return this.#matterBody.velocity.x }

  set velocityY(v) { Matter.Body.setVelocity(this.#matterBody, { x: this.#matterBody.velocity.x, y: v }) }
  get velocityY() { return this.#matterBody.velocity.y }

  set isStatic(v) { Matter.Body.setStatic(this.#matterBody, v) }
  get isStatic() { return this.#matterBody.isStatic }
}
