import { autoDetectRenderer, ColorSource, Renderer as PixiRenderer } from 'pixi.js'
import { debugMode } from '../debug'
import { HasPixiContainer } from '../node/core/has-pixi-container'
import { PixiContainerNode } from '../node/core/pixi-container-node'
import { isTransformableNode } from '../node/core/transformable-node'
import { Camera } from './camera'
import { RendererContainerManager } from './container-manager'
import { FpsDisplay } from './fps-display'
import { Layer } from './layer'
import { Ticker } from './ticker'

export type RendererOptions = {
  logicalWidth?: number
  logicalHeight?: number
  backgroundColor?: ColorSource
  layers?: { name: string; drawOrder: number }[]
}

export class Renderer extends PixiContainerNode {
  #containerManager: RendererContainerManager
  #ticker = new Ticker((dt) => this.#render(dt))
  camera = new Camera()
  fpsDisplay?: FpsDisplay

  #logicalWidth?: number
  #logicalHeight?: number
  #backgroundColor?: ColorSource

  #pixiRenderer?: PixiRenderer
  #layers: { [name: string]: Layer } = {}
  _isSizeDirty = false

  canvasWidth = 0
  canvasHeight = 0
  canvasLeft = 0
  canvasTop = 0
  viewportScale = 1
  centerX = 0
  centerY = 0

  constructor(public container: HTMLElement, options?: RendererOptions) {
    super()
    this.renderer = this

    this.#containerManager = new RendererContainerManager(container)
    this.#containerManager.on('resize', (width, height) => this.#updateSize(width, height))

    this.camera.on('positionChanged', () => this.#updatePosition())
    this.camera.on('scaleChanged', () => this.#updatePosition())

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

    if (debugMode) {
      this.fpsDisplay = new FpsDisplay(container)
    }

    const cr = this.container.getBoundingClientRect()
    this.#updateSize(cr.width, cr.height)
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

  #updatePosition() {
    const S = this.camera.scale
    this._pixiContainer.scale = S
    this._pixiContainer.position.set(
      this.centerX - this.camera.x * S,
      this.centerY - this.camera.y * S
    )
  }

  #updateSize(containerWidth: number, containerHeight: number) {
    const canvasWidth = this.#logicalWidth ?? containerWidth
    const canvasHeight = this.#logicalHeight ?? containerHeight
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.centerX = canvasWidth / 2
    this.centerY = canvasHeight / 2
    this.#updatePosition()

    const S = Math.min(containerWidth / canvasWidth, containerHeight / canvasHeight)
    this.viewportScale = S

    const displayWidth = canvasWidth * S
    const displayHeight = canvasHeight * S

    const canvasLeft = (containerWidth - displayWidth) / 2
    const canvasTop = (containerHeight - displayHeight) / 2
    this.canvasLeft = canvasLeft
    this.canvasTop = canvasTop

    if (this.#pixiRenderer) {
      this.#pixiRenderer.resize(canvasWidth, canvasHeight)

      const canvas = this.#pixiRenderer.canvas
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`
      canvas.style.left = `${canvasLeft}px`
      canvas.style.top = `${canvasTop}px`
    }

    this._isSizeDirty = true
  }

  #render(dt: number) {
    this.update(dt)
    for (const child of this.children) {
      if (isTransformableNode(child)) child._resetTransformDirty()
    }
    this._isSizeDirty = false
    this.#pixiRenderer?.render(this._pixiContainer)
    this.fpsDisplay?.update()
  }

  _addToLayer(node: HasPixiContainer, layerName: string) {
    const layer = this.#layers[layerName]
    if (!layer) throw new Error(`Layer ${layerName} does not exist.`)
    layer._pixiContainer.addChild(node._pixiContainer)
  }

  override remove() {
    this.#containerManager.remove()
    this.#ticker.remove()
    this.#pixiRenderer?.destroy()
    this.fpsDisplay?.remove()
    super.remove()
  }
}
