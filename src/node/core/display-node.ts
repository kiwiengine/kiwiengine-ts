import { EventMap } from '@webtaku/event-emitter'
import { Container } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { DirtyNumber } from './dirty-number'
import { GameNode } from './game-node'
import { HasPixiContainer } from './has-pixi-container'
import { isRenderableNode } from './renderable-node'
import { TransformableNode, TransformableNodeOptions } from './transformable-node'

function hasWorldAlpha(v: unknown): v is { worldAlpha: DirtyNumber } {
  return (v as { worldAlpha: DirtyNumber }).worldAlpha !== undefined
}

export type DisplayNodeOptions = {
  alpha?: number
  layer?: string
  useYSort?: boolean
} & TransformableNodeOptions

export abstract class DisplayNode<C extends Container, E extends EventMap> extends TransformableNode<E> implements HasPixiContainer {
  _pixiContainer: C

  #renderer?: Renderer
  #layer?: string
  #useYSort = false

  alpha = 1;
  protected worldAlpha = new DirtyNumber(1)

  constructor(pixiContainer: C, options: DisplayNodeOptions) {
    super(options)
    this._pixiContainer = pixiContainer
    this.#layer = options.layer
    this.#useYSort = options.useYSort ?? false
    if (options.alpha !== undefined) this.alpha = options.alpha
  }

  override add(...children: GameNode<EventMap>[]) {
    super.add(...children)

    for (const child of children) {
      if (isRenderableNode(child)) {
        this._pixiContainer.addChild(child._pixiContainer)
      }
    }
  }

  override remove() {
    this._pixiContainer.destroy({ children: true })
    super.remove()
  }

  protected set renderer(renderer: Renderer | undefined) {
    this.#renderer = renderer

    for (const child of this.children) {
      if (isRenderableNode(child)) {
        child.renderer = renderer
      }
    }

    if (this.#layer && renderer) {
      renderer._addToLayer(this, this.#layer)
    }
  }

  protected get renderer() {
    return this.#renderer
  }

  protected override update(dt: number): void {
    super.update(dt)

    const parent = this.parent
    if (parent && hasWorldAlpha(parent)) {
      this.worldAlpha.v = parent.worldAlpha.v * this.alpha
    }

    const pc = this._pixiContainer
    const renderer = this.renderer

    // 레이어 상에 있는 경우, 독립적으로 업데이트
    if (this.#layer && renderer) {
      const wt = this.worldTransform
      pc.position.set(wt.x.v, wt.y.v)
      pc.scale.set(wt.scaleX.v, wt.scaleY.v)
      pc.rotation = wt.rotation.v
      pc.alpha = this.worldAlpha.v
    } else {
      const lt = this.localTransform
      pc.position.set(lt.x, lt.y)
      if (this.#useYSort) pc.zIndex = lt.y
      pc.pivot.set(lt.pivotX, lt.pivotY)
      pc.scale.set(lt.scaleX, lt.scaleY)
      pc.rotation = lt.rotation
      pc.alpha = this.alpha
    }
  }

  override _resetTransformDirty() {
    super._resetTransformDirty()
    this.worldAlpha.resetDirty()
  }
}
