import { EventMap } from '@webtaku/event-emitter'
import { DisplayNode } from "../core/display-node"

export class GameObject<E extends EventMap> extends DisplayNode<E> { }
