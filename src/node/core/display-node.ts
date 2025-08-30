import { EventMap } from '@webtaku/event-emitter'
import { TransformableNode } from './transformable-node'

export abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> { }
