import { EventMap } from '@webtaku/event-emitter'
import { FillInput, Graphics, StrokeInput } from 'pixi.js'
import { DisplayNode, DisplayNodeOptions } from '../core/display-node'

export type CircleNodeOptions = {
  radius: number
  fill?: FillInput
  stroke?: StrokeInput
} & DisplayNodeOptions

export class CircleNode extends DisplayNode<Graphics, EventMap> {
  #radius: number
  #fill?: FillInput
  #stroke?: StrokeInput

  constructor(options: CircleNodeOptions) {
    super(new Graphics({ sortableChildren: true }), options)

    this.#radius = options.radius
    this.#fill = options.fill
    this.#stroke = options.stroke

    this.#draw()
  }

  #draw() {
    this._pixiContainer.clear().circle(0, 0, this.#radius)
    if (this.#fill) this._pixiContainer.fill(this.#fill)
    if (this.#stroke) this._pixiContainer.stroke(this.#stroke)
  }

  get radius() { return this.#radius }
  set radius(v) { this.#radius = v; this.#draw() }

  get fill() { return this.#fill }
  set fill(v) { this.#fill = v; this.#draw() }

  get stroke() { return this.#stroke }
  set stroke(v) { this.#stroke = v; this.#draw() }
}
