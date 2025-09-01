import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { DirtyNumber } from './dirty-number'
import { GameNode } from './game-node'
import { HasPixiContainer } from './has-pixi-container'
import { isHasPixiContainer } from './pixi-container-node'
import { TransformableNode } from './transformable-node'

function hasGlobalAlpha(v: unknown): v is { globalAlpha: DirtyNumber } {
  return (v as { globalAlpha: DirtyNumber }).globalAlpha !== undefined
}

export type DisplayNodeOptions = {
  layer?: string
  useYSort?: boolean
}

export abstract class DisplayNode<C extends Container, E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
  _pixiContainer: C
  #layer?: string
  #useYSort = false

  alpha = 1;
  protected globalAlpha = new DirtyNumber(1)

  constructor(pixiContainer: C, options: DisplayNodeOptions) {
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

  override add(...children: GameNode<EventMap>[]) {
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

  protected override update(dt: number): void {
    super.update(dt)

    const parent = this.parent
    if (parent && hasGlobalAlpha(parent)) {
      this.globalAlpha.v = parent.globalAlpha.v * this.alpha
    }

    const pc = this._pixiContainer
    const renderer = this.renderer

    // 레이어 상에 있는 경우, 독립적으로 업데이트
    if (this.#layer && renderer) {
      //TODO
    } else {
      const lt = this.localTransform
      pc.x = lt.x
      pc.y = lt.y
      if (this.#useYSort) pc.zIndex = lt.y
      pc.pivot.x = lt.pivotX
      pc.pivot.y = lt.pivotY
      pc.scale.x = lt.scaleX
      pc.scale.y = lt.scaleY
      pc.rotation = lt.rotation
      pc.alpha = this.alpha
    }
  }
}
