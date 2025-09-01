import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from './game-node'
import { GlobalTransform, LocalTransform } from './transform'

export function isTransformableNode(v: unknown): v is TransformableNode<EventMap> {
  return (v as TransformableNode<EventMap>).globalTransform !== undefined
}

export type TransformableNodeOptions = {
  x?: number
  y?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  pivotX?: number
  pivotY?: number
  rotation?: number
}

export abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
  protected localTransform = new LocalTransform()
  globalTransform = new GlobalTransform()

  constructor(options: TransformableNodeOptions) {
    super()
    if (options) {
      if (options.x !== undefined) this.x = options.x
      if (options.y !== undefined) this.y = options.y
      if (options.scale !== undefined) this.scale = options.scale
      if (options.scaleX !== undefined) this.scaleX = options.scaleX
      if (options.scaleY !== undefined) this.scaleY = options.scaleY
      if (options.pivotX !== undefined) this.pivotX = options.pivotX
      if (options.pivotY !== undefined) this.pivotY = options.pivotY
      if (options.rotation !== undefined) this.rotation = options.rotation
    }
  }

  protected override update(dt: number) {
    super.update(dt)

    const parent = this.parent
    if (parent && isTransformableNode(parent)) {
      this.globalTransform.update(parent.globalTransform, this.localTransform)
    }
  }

  _resetTransformDirty() {
    this.globalTransform.resetDirty()

    for (const child of this.children) {
      if (isTransformableNode(child)) child._resetTransformDirty()
    }
  }

  set x(v) { this.localTransform.x = v }
  get x() { return this.localTransform.x }

  set y(v) { this.localTransform.y = v }
  get y() { return this.localTransform.y }

  set scale(v) { this.localTransform.scaleX = v; this.localTransform.scaleY = v }
  get scale() { return this.localTransform.scaleX }

  set scaleX(v) { this.localTransform.scaleX = v }
  get scaleX() { return this.localTransform.scaleX }

  set scaleY(v) { this.localTransform.scaleY = v }
  get scaleY() { return this.localTransform.scaleY }

  set pivotX(v) { this.localTransform.pivotX = v }
  get pivotX() { return this.localTransform.pivotX }

  set pivotY(v) { this.localTransform.pivotY = v }
  get pivotY() { return this.localTransform.pivotY }

  set rotation(v) { this.localTransform.rotation = v }
  get rotation() { return this.localTransform.rotation }
}
