import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { DirtyNumber } from './dirty-number'
import { GameNode } from './game-node'
import { HasPixiContainer } from './has-pixi-container'
import { isHasPixiContainer } from './pixi-container-node'
import { TransformableNode } from './transformable-node'

export type DisplayNodeOptions = {
  layer?: string
  useYSort?: boolean
}

export abstract class DisplayNode<E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
  _pixiContainer: Container
  #layer?: string
  #useYSort = false

  protected localAlpha = new DirtyNumber(1)
  protected globalAlpha = new DirtyNumber(1)

  constructor(pixiContainer: Container, options: DisplayNodeOptions) {
    super()
    this._pixiContainer = pixiContainer
    this.#layer = options.layer
    this.#useYSort = options.useYSort ?? false
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

  protected update(deltaTime: number): void {
    super.update(deltaTime)

    const pc = this._pixiContainer
    const renderer = this.renderer

    if (this.#layer && renderer) {
      const lt = this.localTransform
      if (lt.x.dirty) pc.x = lt.x.v
      if (lt.y.dirty) {
        pc.y = lt.y.v
        if (this.#useYSort) pc.zIndex = lt.y.v
      }
      if (lt.pivotX.dirty) pc.pivot.x = lt.pivotX.v
      if (lt.pivotY.dirty) pc.pivot.y = lt.pivotY.v
      if (lt.scaleX.dirty) pc.scale.x = lt.scaleX.v
      if (lt.scaleY.dirty) pc.scale.y = lt.scaleY.v
      if (lt.rotation.dirty) pc.rotation = lt.rotation.v
    }

    if (this.localAlpha.dirty) pc.alpha = this.localAlpha.v
  }
}
