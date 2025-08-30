import { EventMap, EventEmitter } from '@webtaku/event-emitter'

export abstract class GameNode<E extends EventMap> extends EventEmitter<E> {
  remove() {
    super.remove()
  }
}
