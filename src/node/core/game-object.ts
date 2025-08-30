import { EventMap } from '@webtaku/event-emitter'
import { DisplayNode } from "./display-node"
import { Container } from 'pixi.js'

export type GameObjectOptions = {}

export class GameObject<E extends EventMap> extends DisplayNode<E> {
  constructor(opts?: GameObjectOptions) {
    super(new Container())
  }
}
