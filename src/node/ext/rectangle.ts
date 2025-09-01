import { EventMap } from '@webtaku/event-emitter'
import { FillInput, Graphics, StrokeInput } from 'pixi.js'
import { DisplayNode, DisplayNodeOptions } from '../core/display-node'

export type RectangleNodeOptions = {
  width: number
  height: number
  fill?: FillInput
  stroke?: StrokeInput
} & DisplayNodeOptions

export class RectangleNode extends DisplayNode<Graphics, EventMap> {
  #width: number
  #height: number
  #fill?: FillInput
  #stroke?: StrokeInput

  constructor(x: number, y: number, options: RectangleNodeOptions) {
    super(new Graphics({ sortableChildren: true }), options)

    this.localTransform.x = x
    this.localTransform.y = y

    this.#width = options.width
    this.#height = options.height
    this.#fill = options.fill
    this.#stroke = options.stroke

    this.#draw()
  }

  #draw() {
    this._pixiContainer.clear().rect(
      -this.#width / 2,
      -this.#height / 2,
      this.#width,
      this.#height,
    )
    if (this.#fill) this._pixiContainer.fill(this.#fill)
    if (this.#stroke) this._pixiContainer.stroke(this.#stroke)
  }
}
