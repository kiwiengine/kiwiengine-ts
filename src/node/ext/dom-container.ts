import { EventMap } from '@webtaku/event-emitter'
import { GameObject, GameObjectOptions } from '../core/game-object'
import { Renderer } from '../../renderer/renderer'

type DomContainerNodeOptions = {
  el: HTMLElement
} & GameObjectOptions

export class DomContainerNode extends GameObject<EventMap> {
  #el: HTMLElement

  constructor(options: DomContainerNodeOptions) {
    super(options)
    this.#el = options.el
  }

  protected override set renderer(renderer: Renderer | undefined) {
    super.renderer = renderer
    if (renderer) renderer.target.appendChild(this.#el)
  }

  protected override get renderer() {
    return super.renderer
  }

  protected update(deltaTime: number): void {
    super.update(deltaTime)

    const renderer = this.renderer
    if (renderer) {
      //TODO
    }
  }
}
