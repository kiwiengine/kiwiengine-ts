import { EventMap } from '@webtaku/event-emitter'
import { Renderer } from '../../renderer/renderer'
import { GameObject, GameObjectOptions } from '../core/game-object'

type DomContainerNodeOptions = {
  el: HTMLElement
} & GameObjectOptions

export class DomContainerNode extends GameObject<EventMap> {
  #el: HTMLElement

  constructor(options: DomContainerNodeOptions) {
    super(options)
    const el = this.#el = options.el
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.zIndex = '1'
  }

  #syncTransform() {
    const renderer = this.renderer
    if (renderer) {
      const gt = this.globalTransform
      const S = renderer.viewportScale

      this.#el.style.transform = `
        translate(
          calc(-50% + ${gt.x.value * S + renderer.canvasLeft + renderer.centerX * S}px),
          calc(-50% + ${gt.y.value * S + renderer.canvasTop + renderer.centerY * S}px)
        )
        scale(${gt.scaleX.value * S}, ${gt.scaleY.value * S})
        rotate(${gt.rotation.value}rad)
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
    if (renderer && (renderer._isContainerSizeDirty || this.globalTransform.isDirty)) {
      this.#syncTransform()
    }
    if (this.globalAlpha.isDirty) this.#el.style.opacity = this.globalAlpha.value.toString()
  }
}
