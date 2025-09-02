import { EventMap } from '@webtaku/event-emitter'
import { Container as PixiContainer } from 'pixi.js'
import { Renderer } from '../../renderer/renderer'
import { DirtyNumber } from './dirty-number'
import { GameNode } from './game-node'
import { WorldTransform } from './transform'

export function isRenderableNode(n: unknown): n is {
  renderer?: Renderer
  _pixiContainer: PixiContainer

  worldTransform: WorldTransform
  worldAlpha: DirtyNumber

  _resetTransformDirty: () => void
} {
  return (n as any).worldTransform !== undefined
}

export abstract class RenderableNode<E extends EventMap = EventMap> extends GameNode<E> {
  #renderer?: Renderer
  _pixiContainer = new PixiContainer({ sortableChildren: true })

  worldTransform = new WorldTransform()

  constructor() {
    super()
    this.worldTransform.x.v = 0
    this.worldTransform.y.v = 0
    this.worldTransform.resetDirty()
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

  _resetTransformDirty() {
    this.worldTransform.resetDirty()

    for (const child of this.children) {
      if (isRenderableNode(child)) {
        child._resetTransformDirty()
      }
    }
  }
}
