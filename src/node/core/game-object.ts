import { EventMap } from '@webtaku/event-emitter'
import { DisplayNode } from "./display-node"

export class GameObject<E extends EventMap> extends DisplayNode<E> { }
