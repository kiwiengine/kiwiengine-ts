import { autoDetectRenderer, ColorSource, Renderer as PixiRenderer } from 'pixi.js'
import { HasPixiContainer } from '../node/core/has-pixi-container'
import { PixiContainerNode } from '../node/core/pixi-container-node'
import { RendererContainerManager } from './container-manager'
import { Layer } from './layer'

export type RendererOptions = {
  logicalWidth?: number
  logicalHeight?: number
  backgroundColor?: ColorSource
  layers?: { name: string; drawOrder: number }[]
}

export class Renderer extends PixiContainerNode {
  #containerManager: RendererContainerManager

  #logicalWidth?: number
  #logicalHeight?: number
  #backgroundColor?: ColorSource

  #pixiRenderer?: PixiRenderer
  #layers: { [name: string]: Layer } = {}
  _isSizeDirty = false

  canvasLeft = 0
  canvasTop = 0
  viewportScale = 1
  centerX = 0
  centerY = 0

  constructor(public container: HTMLElement, options?: RendererOptions) {
    super()
    this.#containerManager = new RendererContainerManager(container)

    if (options) {
      if (options.logicalWidth !== undefined) this.#logicalWidth = options.logicalWidth
      if (options.logicalHeight !== undefined) this.#logicalHeight = options.logicalHeight
      if (options.backgroundColor !== undefined) this.#backgroundColor = options.backgroundColor

      if (options.layers) {
        for (const layerOption of options.layers) {
          const layer = new Layer(layerOption.drawOrder)
          this._pixiContainer.addChild(layer._pixiContainer)
          this.#layers[layerOption.name] = layer
        }
      }
    }

    this.init()
  }

  private async init() {
    const pr = await autoDetectRenderer({
      width: this.#logicalWidth,
      height: this.#logicalHeight,
      backgroundColor: this.#backgroundColor,
      eventMode: 'none',
      resolution: window.devicePixelRatio,
    })

    const canvas = pr.canvas
    canvas.style.position = 'absolute'
    canvas.style.touchAction = 'auto'
    this.container.appendChild(canvas)

    this.#pixiRenderer = pr
  }

  _addToLayer(node: HasPixiContainer, layerName: string) {
    const layer = this.#layers[layerName]
    if (!layer) throw new Error(`Layer ${layerName} does not exist.`)
    layer._pixiContainer.addChild(node._pixiContainer)
  }

  override remove() {
    this.#containerManager.remove()
    super.remove()
  }
}
