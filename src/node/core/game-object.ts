import { EventMap } from '@webtaku/event-emitter'
import { DisplayNode } from "./display-node"
import { Container } from 'pixi.js'

export class GameObject<E extends EventMap> extends DisplayNode<E> {
  constructor() {
    super(new Container())
  }
}
