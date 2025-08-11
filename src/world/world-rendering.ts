import { autoDetectRenderer, Container, Renderer } from "pixi.js";

export class WorldRendering {
  #renderer?: Renderer;
  #root = new Container();
  #backgroundAlpha = 1;

  #centerX = 0;
  #centerY = 0;
  #cameraX = 0;
  #cameraY = 0;

  get backgroundAlpha() { return this.#backgroundAlpha; }
  set backgroundAlpha(v: number) {
    this.#backgroundAlpha = v;
    if (this.#renderer) this.#renderer.background.alpha = v;
  }

  async init(container: HTMLElement, width: number | undefined, height: number | undefined) {
    const renderer = await autoDetectRenderer({
      width,
      height,
      backgroundColor: 0x304C79,
      backgroundAlpha: this.#backgroundAlpha,
      eventMode: 'none',
      resolution: window.devicePixelRatio,
    });
    this.#renderer = renderer;

    const canvas = renderer.canvas;
    canvas.style.position = 'absolute';
    canvas.style.touchAction = 'auto';
    canvas.style.borderRadius = container.style.borderRadius;
    container.appendChild(canvas);
  }

  #applyPosition() {
    this.#root.x = this.#centerX - this.#cameraX;
    this.#root.y = this.#centerY - this.#cameraY;
  }

  setCanvasSize(rect: DOMRect, width: number, height: number) {
    this.#centerX = width / 2;
    this.#centerY = height / 2;
    this.#applyPosition();

    if (!this.#renderer) return;
    this.#renderer.resize(width, height);

    const scale = Math.min(rect.width / width, rect.height / height);
    const displayW = width * scale;
    const displayH = height * scale;
    const left = (rect.width - displayW) / 2;
    const top = (rect.height - displayH) / 2;

    const canvas = this.#renderer.canvas;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
  }

  update() {
    this.#renderer?.render(this.#root);
  }

  get cameraX() { return this.#cameraX; }
  set cameraX(value: number) { this.#cameraX = value; this.#applyPosition(); }
  get cameraY() { return this.#cameraY; }
  set cameraY(value: number) { this.#cameraY = value; this.#applyPosition(); }
}
