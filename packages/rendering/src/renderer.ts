import { ObjectStateTree } from '@kiwiengine/core'
import { autoDetectRenderer, Container, DOMAdapter, ICanvas, Renderer as PixiRenderer, WebWorkerAdapter } from 'pixi.js'

export class Renderer {
  readonly #canvas: ICanvas
  readonly #objectStateTree: ObjectStateTree

  readonly #root = new Container()
  #pixiRenderer?: PixiRenderer

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
      this.#objectStateTree.forEach((i) => {
        //TODO
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