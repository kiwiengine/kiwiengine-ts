import { ObjectStateTree, ROOT } from '@kiwiengine/core'
import { autoDetectRenderer, Container, DOMAdapter, ICanvas, Renderer as PixiRenderer, WebWorkerAdapter } from 'pixi.js'

export class Renderer {
  readonly #canvas: ICanvas
  readonly #objectStateTree: ObjectStateTree

  #pixiRenderer?: PixiRenderer
  readonly #root = new Container({ sortableChildren: true })
  readonly #containers = new Map<string, Container>()

  constructor(
    canvas: ICanvas,
    objectStateTree: ObjectStateTree,
  ) {
    this.#canvas = canvas
    this.#objectStateTree = objectStateTree
    this.#init()
  }

  async #init() {
    this.#pixiRenderer = await autoDetectRenderer({
      canvas: this.#canvas,
    })
  }

  render() {
    if (this.#pixiRenderer) {
      let zIndex = 0
      this.#objectStateTree.forEach((i) => {
        if (i === ROOT) return

        const id = i.toString()
        const container = this.#containers.get(id)
        if (container) {
          container.zIndex = zIndex
        } else {
          const container = new Container()
          this.#containers.set(id, container)
          this.#root.addChild(container)
          container.zIndex = zIndex
        }
        zIndex++
      })
      this.#pixiRenderer.render(this.#root)
    }
  }
}

export class WebWorkerRenderer extends Renderer {
  constructor(canvas: ICanvas, objectStateTree: ObjectStateTree) {
    DOMAdapter.set(WebWorkerAdapter)
    super(canvas, objectStateTree)
  }
}