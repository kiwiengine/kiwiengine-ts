import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from './game-node'
import { GlobalTransform, LocalTransform } from './transform'

export function isTransformableNode(v: unknown): v is TransformableNode<EventMap> {
  return (v as any).globalTransform !== undefined
}

export abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
  protected localTransform = new LocalTransform()
  protected globalTransform = new GlobalTransform()

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

  set x(v: number) { this.localTransform.x = v }
  get x() { return this.localTransform.x }

  set y(v: number) { this.localTransform.y = v }
  get y() { return this.localTransform.y }

  set scale(v: number) { this.localTransform.scaleX = v; this.localTransform.scaleY = v }
  get scale() { return this.localTransform.scaleX }

  set scaleX(v: number) { this.localTransform.scaleX = v }
  get scaleX() { return this.localTransform.scaleX }

  set scaleY(v: number) { this.localTransform.scaleY = v }
  get scaleY() { return this.localTransform.scaleY }

  set pivotX(v: number) { this.localTransform.pivotX = v }
  get pivotX() { return this.localTransform.pivotX }

  set pivotY(v: number) { this.localTransform.pivotY = v }
  get pivotY() { return this.localTransform.pivotY }

  set rotation(v: number) { this.localTransform.rotation = v }
  get rotation() { return this.localTransform.rotation }
}
