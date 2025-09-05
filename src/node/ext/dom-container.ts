import { Renderer } from '../../renderer/renderer'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type DomContainerNodeOptions = {} & GameObjectOptions

export class DomContainerNode extends GameObject {
  #el: HTMLElement

  constructor(el: HTMLElement, options?: DomContainerNodeOptions) {
    super(options)
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.zIndex = '1'
    this.#el = el
  }

  #syncTransform() {
    const renderer = this.renderer
    if (renderer) {
      const wt = this.worldTransform
      const S = renderer.viewportScale

      this.#el.style.transform = `
        translate(
          calc(-50% + ${wt.x.v * S + renderer.canvasLeft + renderer.centerX * S}px),
          calc(-50% + ${wt.y.v * S + renderer.canvasTop + renderer.centerY * S}px)
        )
        scale(${wt.scaleX.v * S}, ${wt.scaleY.v * S})
        rotate(${wt.rotation.v}rad)
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

  protected update(dt: number): void {
    super.update(dt)

    const renderer = this.renderer
    if (renderer && (renderer._isSizeDirty || this.worldTransform.dirty)) {
      this.#syncTransform()
    }
    if (this.worldAlpha.dirty) this.#el.style.opacity = this.worldAlpha.v.toString()
  }

  override remove() {
    this.#el.remove()
    super.remove()
  }
}
