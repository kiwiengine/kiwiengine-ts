import { EventMap } from '@webtaku/event-emitter'
import { TransformableNode } from './transformable-node'
import { Container } from 'pixi.js'

export abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> {
  #container: Container

  constructor(container: Container) {
    super()
    this.#container = container
  }

  remove() {
    this.#container.destroy({ children: true })
    super.remove()
  }
}
