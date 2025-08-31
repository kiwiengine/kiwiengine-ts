import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from './game-node'
import { DirtyNumber } from './dirty-number'
import { GlobalTransform } from './transform'

export abstract class TransformableNode<E extends EventMap> extends GameNode<E> {
  protected globalTransform = new GlobalTransform()
  protected globalAlpha = new DirtyNumber(1)
}
