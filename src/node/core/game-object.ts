import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { DisplayNode, DisplayNodeOptions } from "./display-node"

export type GameObjectOptions = {} & DisplayNodeOptions

export class GameObject<E extends EventMap = EventMap> extends DisplayNode<Container, E> {
  constructor(options?: GameObjectOptions) {
    super(new Container({ sortableChildren: true }), options ?? {})
  }
}
