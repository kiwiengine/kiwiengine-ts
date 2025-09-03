import { EventMap } from '@webtaku/event-emitter'
import { Container as PixiContainer } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { DirtyNumber } from './dirty-number'
import { GameNode } from './game-node'
import { WorldTransform } from './transform'

export function isRenderableNode(v: unknown): v is RenderableNode<PixiContainer, EventMap> {
  return (v as RenderableNode<PixiContainer, EventMap>).worldTransform !== undefined
}

export abstract class RenderableNode<C extends PixiContainer, E extends EventMap> extends GameNode<E> {
  #renderer?: Renderer
  _pixiContainer: C

  worldTransform = new WorldTransform()
  worldAlpha = new DirtyNumber(1)

  constructor(pixiContainer: C) {
    super()
    this._pixiContainer = pixiContainer
  }

  protected set renderer(renderer: Renderer | undefined) {
    this.#renderer = renderer

    for (const child of this.children) {
      if (isRenderableNode(child)) {
        child.renderer = renderer
      }
    }
  }

  protected get renderer() {
    return this.#renderer
  }

  override add(...children: GameNode<EventMap>[]) {
    super.add(...children)

    for (const child of children) {
      if (isRenderableNode(child)) {
        this._pixiContainer.addChild(child._pixiContainer)

        // 렌더러 설정
        if (this.#renderer) child.renderer = this.#renderer
      }
    }
  }

  override remove() {
    this._pixiContainer.destroy({ children: true })
    super.remove()
  }

  _updateWorldTransform() {
    for (const child of this.children) {
      if (isRenderableNode(child)) child._updateWorldTransform()
    }
    this.worldTransform.resetDirty()
  }

  set tint(t) { this._pixiContainer.tint = t }
  get tint() { return this._pixiContainer.tint }
}
