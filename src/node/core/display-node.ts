import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { GameNode } from './game-node'
import { HasPixiContainer } from './has-pixi-container'
import { isHasPixiContainer } from './pixi-container-node'
import { TransformableNode } from './transformable-node'

export type DisplayNodeOptions = {
  layer?: string
}

export abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
  _pixiContainer: Container
  #layer?: string

  constructor(pixiContainer: Container, options: DisplayNodeOptions) {
    super()
    this._pixiContainer = pixiContainer
    this.#layer = options.layer
  }

  protected override set renderer(renderer: Renderer | undefined) {
    super.renderer = renderer
    if (this.#layer && renderer) renderer._addToLayer(this, this.#layer)
  }

  protected override get renderer() {
    return super.renderer
  }

  override add(...children: GameNode[]) {
    super.add(...children)

    for (const child of children) {
      if (isHasPixiContainer(child)) {
        this._pixiContainer.addChild(child._pixiContainer)
      }
    }
  }

  override remove() {
    this._pixiContainer.destroy({ children: true })
    super.remove()
  }
}
