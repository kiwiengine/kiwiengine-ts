import { EventMap } from '@webtaku/event-emitter'
import { Renderer } from '../../renderer/renderer'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type DomContainerNodeOptions = {} & GameObjectOptions

export class DomContainerNode extends GameObject<EventMap> {
  #el: HTMLElement

  constructor(x: number, y: number, el: HTMLElement, options?: DomContainerNodeOptions) {
    super(x, y, options)
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.zIndex = '1'
    this.#el = el
  }

  #syncTransform() {
    const renderer = this.renderer
    if (renderer) {
      const gt = this.globalTransform
      const S = renderer.viewportScale

      this.#el.style.transform = `
        translate(
          calc(-50% + ${gt.x.v * S + renderer.canvasLeft + renderer.centerX * S}px),
          calc(-50% + ${gt.y.v * S + renderer.canvasTop + renderer.centerY * S}px)
        )
        scale(${gt.scaleX.v * S}, ${gt.scaleY.v * S})
        rotate(${gt.rotation.v}rad)
      `
    }
  }

  protected override set renderer(renderer: Renderer | undefined) {
    super.renderer = renderer
    if (renderer) {
      renderer.container.appendChild(this.#el)
      this.#syncTransform()
    }
  }

  protected override get renderer() {
    return super.renderer
  }

  protected update(deltaTime: number): void {
    super.update(deltaTime)

    const renderer = this.renderer
    if (renderer && (renderer._isContainerSizeDirty || this.globalTransform.dirty)) {
      this.#syncTransform()
    }
    if (this.globalAlpha.dirty) this.#el.style.opacity = this.globalAlpha.v.toString()
  }
}
