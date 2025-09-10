import { EventMap } from '@webtaku/event-emitter'
import { FillInput, Graphics, StrokeInput } from 'pixi.js'
import { TransformableNode, TransformableNodeOptions } from '../core/transformable'

export type CircleNodeOptions = {
  radius: number
  fill?: FillInput
  stroke?: StrokeInput
} & TransformableNodeOptions

export class CircleNode extends TransformableNode<Graphics, EventMap> {
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

  set radius(v) {
    if (v !== this.#radius) {
      this.#radius = v
      this.#draw()
    }
  }
  get radius() { return this.#radius }

  set fill(v) {
    if (v !== this.#fill) {
      this.#fill = v
      this.#draw()
    }
  }
  get fill() { return this.#fill }

  set stroke(v) {
    if (v !== this.#stroke) {
      this.#stroke = v
      this.#draw()
    }
  }
  get stroke() { return this.#stroke }
}
