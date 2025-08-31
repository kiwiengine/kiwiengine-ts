import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { GameNode } from '../core/game-node'
import { HasPixiContainer } from '../core/has-pixi-container'

export class PhysicsWorld extends GameNode<EventMap> implements HasPixiContainer {
  pixiContainer = new Container()

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
