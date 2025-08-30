import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from './game-node'

export abstract class TransformableNode<E extends EventMap> extends GameNode<E> { }
