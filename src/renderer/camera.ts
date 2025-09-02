import { EventEmitter } from '@webtaku/event-emitter'

export class Camera extends EventEmitter<{
  positionChanged: () => void
  scaleChanged: () => void
}> {
  #x = 0
  #y = 0
  #scale = 1

  get x() { return this.#x }
  get y() { return this.#y }
  get scale() { return this.#scale }

  setPosition(x: number, y: number) {
    this.#x = x
    this.#y = y
    this.emit('positionChanged')
  }

  setScale(scale: number) {
    this.#scale = scale
    this.emit('scaleChanged')
  }
}