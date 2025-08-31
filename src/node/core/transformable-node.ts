import { EventMap } from '@webtaku/event-emitter'
import { DirtyNumber } from './dirty-number'
import { GameNode } from './game-node'
import { GlobalTransform, LocalTransform } from './transform'

export abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
  protected localTransform = new LocalTransform()
  protected globalTransform = new GlobalTransform()
  protected globalAlpha = new DirtyNumber(1)
}
