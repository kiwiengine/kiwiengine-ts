import { EventMap } from '@webtaku/event-emitter'
import Matter, { IChamferableBodyDefinition } from 'matter-js'
import { Container as PixiContainer } from 'pixi.js'
import { GameNode } from '../core/game-node'
import { isRenderableNode, RenderableNode } from '../core/renderable'
import { LocalTransform } from '../core/transform'
import { PhysicsWorld } from './physics-world'
import { Rigidbody, RigidbodyType } from './rigidbodies'

export type PhysicsObjectOptions = {
  rigidbody: Rigidbody

  x?: number
  y?: number
  rotation?: number
  fixedRotation?: boolean
  velocityX?: number
  velocityY?: number
  isStatic?: boolean

  useYSort?: boolean
}

export class PhysicsObject<E extends EventMap = EventMap> extends RenderableNode<PixiContainer, E> {
  #localTransform = new LocalTransform()
  #matterBody: Matter.Body

  #useYSort = false

  constructor(options: PhysicsObjectOptions) {
    super(new PixiContainer({ sortableChildren: true }))

    const c = options.rigidbody
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

    if (c.type === RigidbodyType.Rectangle) {
      this.#matterBody = Matter.Bodies.rectangle(x, y, c.width, c.height, bodyOptions)
    } else if (c.type === RigidbodyType.Circle) {
      this.#matterBody = Matter.Bodies.circle(x, y, c.radius, bodyOptions)
    } else if (c.type === RigidbodyType.Polygon) {
      this.#matterBody = Matter.Bodies.fromVertices(x, y, [c.vertices], bodyOptions)
    } else {
      throw new Error('Invalid rigidbody type')
    }

    this.#useYSort = options.useYSort ?? false
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
    if (this.#useYSort) pc.zIndex = mb.position.y
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

  #removeFromWorld() {
    (this.parent as PhysicsWorld)?.removeBody(this.#matterBody)
  }

  override remove() {
    this.#removeFromWorld()
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

  disableCollisions() {
    this.#removeFromWorld()
  }
}
