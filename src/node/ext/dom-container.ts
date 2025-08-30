import { EventMap } from '@webtaku/event-emitter'
import { GameObject, GameObjectOptions } from '../core/game-object'

type DomContainerNodeOptions = {
  el: HTMLElement
} & GameObjectOptions

export class DomContainerNode extends GameObject<EventMap> {
  #el: HTMLElement

  constructor(opts: DomContainerNodeOptions) {
    super(opts)
    this.#el = opts.el
  }

  protected update(deltaTime: number): void {
    super.update(deltaTime)

    const renderer = this.renderer
    if (renderer) {
    }
  }
}
