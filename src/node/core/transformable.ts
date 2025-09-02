import { EventMap } from '@webtaku/event-emitter'
import { Container as PixiContainer } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { isRenderableNode, RenderableNode } from './renderable'
import { LocalTransform } from './transform'

export type TransformableNodeOptions = {
  x?: number
  y?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  pivotX?: number
  pivotY?: number
  rotation?: number

  alpha?: number
  layer?: string
  useYSort?: boolean
}

export abstract class TransformableNode<C extends PixiContainer, E extends EventMap> extends RenderableNode<C, E> {
  protected localTransform = new LocalTransform()

  alpha = 1
  #layer?: string
  #useYSort = false

  constructor(pixiContainer: C, options: TransformableNodeOptions) {
    super(pixiContainer)

    if (options.x !== undefined) this.x = options.x
    if (options.y !== undefined) this.y = options.y
    if (options.scale !== undefined) this.scale = options.scale
    if (options.scaleX !== undefined) this.scaleX = options.scaleX
    if (options.scaleY !== undefined) this.scaleY = options.scaleY
    if (options.pivotX !== undefined) this.pivotX = options.pivotX
    if (options.pivotY !== undefined) this.pivotY = options.pivotY
    if (options.rotation !== undefined) this.rotation = options.rotation
    if (options.alpha !== undefined) this.alpha = options.alpha

    this.#layer = options.layer
    this.#useYSort = options.useYSort ?? false
  }

  protected override set renderer(renderer: Renderer | undefined) {
    super.renderer = renderer

    if (this.#layer && renderer) {
      renderer._addToLayer(this, this.#layer)
    }
  }

  protected override get renderer() {
    return super.renderer
  }

  override _updateWorldTransform() {
    const parent = this.parent
    if (parent && isRenderableNode(parent)) {
      this.worldTransform.update(parent.worldTransform, this.localTransform)
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

    super._updateWorldTransform()
  }

  set x(v) { this.localTransform.x = v }
  get x() { return this.localTransform.x }

  set y(v) { this.localTransform.y = v }
  get y() { return this.localTransform.y }

  set scale(v) { this.localTransform.scaleX = v; this.localTransform.scaleY = v }
  get scale() { return this.localTransform.scaleX }

  set scaleX(v) { this.localTransform.scaleX = v }
  get scaleX() { return this.localTransform.scaleX }

  set scaleY(v) { this.localTransform.scaleY = v }
  get scaleY() { return this.localTransform.scaleY }

  set pivotX(v) { this.localTransform.pivotX = v }
  get pivotX() { return this.localTransform.pivotX }

  set pivotY(v) { this.localTransform.pivotY = v }
  get pivotY() { return this.localTransform.pivotY }

  set rotation(v) { this.localTransform.rotation = v }
  get rotation() { return this.localTransform.rotation }
}
