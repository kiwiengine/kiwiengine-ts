import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { DisplayNode, DisplayNodeOptions } from "./display-node"

export type GameObjectOptions = {} & DisplayNodeOptions

export class GameObject<E extends EventMap> extends DisplayNode<E> {
  constructor(x: number, y: number, options?: GameObjectOptions) {
    super(new Container({ sortableChildren: true }), options ?? {})
    this.localTransform.x = x
    this.localTransform.y = y
  }
}
