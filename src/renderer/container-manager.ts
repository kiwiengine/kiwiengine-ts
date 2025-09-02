import { EventEmitter } from '@webtaku/event-emitter'
import { DirtyNumber } from '../node/core/dirty-number'

export class RendererContainerManager extends EventEmitter<{
  resize: (width: number, height: number) => void
}> {
  #container: HTMLElement
  #containerResizeObserver: ResizeObserver
  #containerWidth = new DirtyNumber(0)
  #containerHeight = new DirtyNumber(0)

  constructor(container: HTMLElement) {
    super()
    this.#container = container
    this.#containerResizeObserver = new ResizeObserver(this.#resizeListener.bind(this))
    this.#containerResizeObserver.observe(container)
  }

  #resizeListener() {
    const cr = this.#container.getBoundingClientRect()
    this.#containerWidth.v = cr.width
    this.#containerHeight.v = cr.height

    if (this.#containerWidth.dirty || this.#containerHeight.dirty) {
      this.emit('resize', this.#containerWidth.v, this.#containerHeight.v)

      this.#containerWidth.resetDirty()
      this.#containerHeight.resetDirty()
    }
  }

  override remove() {
    this.#containerResizeObserver.disconnect()
    super.remove()
  }
}
