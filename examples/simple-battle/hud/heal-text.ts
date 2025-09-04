import { BitmapTextNode, GameObjectOptions } from '../../../src/index'

export type HealTextOptions = {
  hp: number
} & GameObjectOptions

export class HealText extends BitmapTextNode {
  #velocityY = -50
  #gravity = 100
  #lifetime = 1.0
  #elapsed = 0
  #fadeStart = 0.5
  #initialScale = 1.0
  #targetScale = 1.2

  constructor(options: HealTextOptions) {
    super({
      ...options,
      text: `+${options.hp}`,
      fnt: 'assets/bitmap-fonts/white-peaberry.fnt',
      src: 'assets/bitmap-fonts/white-peaberry.png'
    })
  }

  protected override update(dt: number) {
    super.update(dt)

    this.#elapsed += dt
    this.#velocityY += this.#gravity * dt
    this.y += this.#velocityY * dt

    const progress = Math.min(this.#elapsed / this.#lifetime, 1)
    const scale = this.#initialScale + (this.#targetScale - this.#initialScale) * progress
    this.scale = scale

    if (this.#elapsed > this.#fadeStart) {
      const fadeProgress = (this.#elapsed - this.#fadeStart) / (this.#lifetime - this.#fadeStart)
      this.alpha = Math.max(1 - fadeProgress, 0)
    }

    if (this.#elapsed >= this.#lifetime) {
      this.remove()
    }
  }
}
