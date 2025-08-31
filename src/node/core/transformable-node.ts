import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from './game-node'
import { GlobalTransform, LocalTransform } from './transform'

function isTransformableNode(v: unknown): v is TransformableNode<EventMap> {
  return (v as any).globalTransform !== undefined
}

export abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
  protected localTransform = new LocalTransform()
  protected globalTransform = new GlobalTransform()

  protected update(dt: number) {
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
}
