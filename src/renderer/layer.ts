import { Container } from 'pixi.js'
import { GameNode } from '../node/core/game-node'
import { HasPixiContainer } from '../node/core/has-pixi-container'

export class Layer extends GameNode implements HasPixiContainer {
  pixiContainer = new Container({ sortableChildren: true })

  constructor(drawOrder: number) {
    super()
    this.pixiContainer.zIndex = drawOrder
  }

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
