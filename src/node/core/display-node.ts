import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { GameNode } from './game-node'
import { HasPixiContainer } from './has-pixi-container'
import { TransformableNode } from './transformable-node'

export type DisplayNodeOptions = {
  layer?: string
}

export abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
  pixiContainer: Container

  constructor(pixiContainer: Container, options: DisplayNodeOptions) {
    super()
    this.pixiContainer = pixiContainer
  }

  override add(...children: (GameNode<EventMap> & HasPixiContainer)[]): void {
    super.add(...children)

    for (const child of children) {
      this.pixiContainer.addChild(child.pixiContainer)
    }
  }

  override remove() {
    this.pixiContainer.destroy({ children: true })
    super.remove()
  }
}
