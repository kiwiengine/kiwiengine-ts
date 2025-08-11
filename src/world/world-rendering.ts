import { autoDetectRenderer, Container, Renderer } from "pixi.js";

export class WorldRendering {
  #renderer?: Renderer;
  #root = new Container();
  #backgroundAlpha = 1;

  get backgroundAlpha() { return this.#backgroundAlpha; }
  set backgroundAlpha(v: number) {
    this.#backgroundAlpha = v;
    if (this.#renderer) this.#renderer.background.alpha = v;
  }

  async init(width: number | undefined, height: number | undefined) {
    const renderer = await autoDetectRenderer({
      width,
      height,
      backgroundColor: 0x304C79,
      backgroundAlpha: this.#backgroundAlpha,
      eventMode: 'none',
      resolution: window.devicePixelRatio,
    });
    this.#renderer = renderer;

    //TODO
  }

  update() {
    if (!this.#renderer) return;
    this.#renderer.render(this.#root);
  }
}
