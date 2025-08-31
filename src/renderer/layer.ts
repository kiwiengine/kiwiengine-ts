import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { GameNode } from '../node/core/game-node'
import { HasPixiContainer } from '../node/core/has-pixi-container'

export type LayerOptions = {
  drawOrder: number
}

export class Layer extends GameNode<EventMap> implements HasPixiContainer {
  pixiContainer = new Container({ sortableChildren: true })

  constructor(options: LayerOptions) {
    super()
    this.pixiContainer.zIndex = options.drawOrder
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
