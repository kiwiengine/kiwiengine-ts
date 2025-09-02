import { EventMap } from '@webtaku/event-emitter'
import Matter, { IChamferableBodyDefinition } from 'matter-js'
import { Collider, ColliderType } from '../../collision/colliders'
import { GameNode } from '../core/game-node'
import { PixiContainerNode } from '../core/pixi-container-node'
import { LocalTransform } from '../core/transform'
import { isTransformableNode } from '../core/transformable-node'
import { PhysicsWorld } from './physics-world'

export type PhysicsObjectOptions = {
  collider: Collider
  x?: number
  y?: number
}

export class PhysicsObject<E extends EventMap = EventMap> extends PixiContainerNode<E> {
  #localTransform = new LocalTransform()
  #matterBody: Matter.Body

  constructor(options: PhysicsObjectOptions) {
    super()

    const x = options.x ?? 0
    const y = options.y ?? 0
    const c = options.collider

    const bodyOptions: IChamferableBodyDefinition = {
    }

    if (c.type === ColliderType.Rectangle) {
      this.#matterBody = Matter.Bodies.rectangle(x, y, c.width, c.height, bodyOptions)
    } else if (c.type === ColliderType.Circle) {
      this.#matterBody = Matter.Bodies.circle(x, y, c.radius, bodyOptions)
    } else if (c.type === ColliderType.Polygon) {
      this.#matterBody = Matter.Bodies.fromVertices(x, y, [c.vertices], bodyOptions)
    } else {
      throw new Error('Invalid collider type')
    }
  }

  override set parent(parent: GameNode<EventMap> | undefined) {
    if (!(parent instanceof PhysicsWorld)) {
      const actual = parent === undefined
        ? 'undefined'
        : parent.constructor?.name ?? typeof parent
      throw new Error(`PhysicsObject parent must be PhysicsWorld, but got ${actual}`)
    }
    super.parent = parent
  }

  override get parent() {
    return super.parent
  }

  protected override update(dt: number) {
    super.update(dt)

    const mb = this.#matterBody

    const pc = this._pixiContainer
    pc.position.set(mb.position.x, mb.position.y)
    pc.rotation = mb.angle

    const lt = this.#localTransform
    lt.x = mb.position.x
    lt.y = mb.position.y
    lt.rotation = mb.angle

    const parent = this.parent
    if (parent && isTransformableNode(parent)) {
      this.worldTransform.update(parent.worldTransform, lt)
    }
  }

  set x(v) { Matter.Body.setPosition(this.#matterBody, { x: v, y: this.#matterBody.position.y }) }
  get x() { return this.#matterBody.position.x }

  set y(v) { Matter.Body.setPosition(this.#matterBody, { x: this.#matterBody.position.x, y: v }) }
  get y() { return this.#matterBody.position.y }
}
