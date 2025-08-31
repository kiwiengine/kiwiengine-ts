import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { GameNode } from '../core/game-node'
import { HasPixiContainer } from '../core/has-pixi-container'

export class PhysicsWorld<E extends EventMap> extends GameNode<E> implements HasPixiContainer {
  pixiContainer = new Container({ sortableChildren: true })

  override add(...children: GameNode[]): void {
    super.add(...children)

    for (const child of children) {
      if ('pixiContainer' in child) {
        this.pixiContainer.addChild((child as HasPixiContainer).pixiContainer)
      }
    }
  }

  override remove() {
    this.pixiContainer.destroy({ children: true })
    super.remove()
  }
}
