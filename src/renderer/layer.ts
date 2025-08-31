import { PixiContainerNode } from '../node/core/pixi-container-node'

export class Layer extends PixiContainerNode {
  constructor(drawOrder: number) {
    super()
    this._pixiContainer.zIndex = drawOrder
  }
}
