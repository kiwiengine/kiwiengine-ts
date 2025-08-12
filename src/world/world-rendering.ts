import { autoDetectRenderer, Container, EventEmitter, Renderer, Sprite } from "pixi.js";
import { textureLoader } from '../asset/loaders/texture';

export class WorldRendering extends EventEmitter<{
  positionChanged: () => void;
}> {
  #renderer?: Renderer;
  #root = new Container();
  #backgroundAlpha = 1;

  #cameraX = 0;
  #cameraY = 0;

  centerX = 0;
  centerY = 0;
  renderWidth = 0;
  renderHeight = 0;
  renderScale = 1;
  canvasLeft = 0;
  canvasTop = 0;

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

    if (this.#lastRect) this.setRendererSize(this.#lastRect, this.#lastWidth, this.#lastHeight);
  }

  #applyPosition() {
    this.#root.x = this.centerX - this.#cameraX;
    this.#root.y = this.centerY - this.#cameraY;

    if (this.#backgroundSprite) {
      this.#backgroundSprite.x = this.#cameraX;
      this.#backgroundSprite.y = this.#cameraY;
    }

    this.emit('positionChanged');
  }

  #lastRect?: DOMRect;
  #lastWidth = 0;
  #lastHeight = 0;

  setRendererSize(rect: DOMRect, width: number, height: number) {
    this.#lastRect = rect;
    this.#lastWidth = width;
    this.#lastHeight = height;

    this.centerX = width / 2;
    this.centerY = height / 2;
    this.#applyPosition();

    this.renderWidth = width;
    this.renderHeight = height;

    const scale = Math.min(rect.width / width, rect.height / height);
    this.renderScale = scale;

    const displayW = width * scale;
    const displayH = height * scale;

    const left = (rect.width - displayW) / 2;
    const top = (rect.height - displayH) / 2;
    this.canvasLeft = left;
    this.canvasTop = top;

    if (!this.#renderer) return;
    this.#renderer.resize(width, height);

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

  addPixiChildToRoot(child: Container) {
    this.#root.addChild(child);
  }

  destroy() {
    this.#renderer?.destroy();
    this.#renderer = undefined;
  }

  #backgroundSprite?: Sprite;
  setBackgroundImage(image: string | undefined) {
    if (image) {
      if (!textureLoader.checkLoaded(image)) {
        console.info(`Background image not preloaded. Loading now: ${image}`);
      }
      textureLoader.load(image).then((texture) => {
        if (texture) {
          this.#backgroundSprite?.destroy();
          this.#backgroundSprite = new Sprite({
            x: this.#cameraX,
            y: this.#cameraY,
            texture,
            anchor: { x: 0.5, y: 0.5 },
            width: this.renderWidth,
            height: this.renderHeight,
            zIndex: -999999,
          });
          this.#root.addChild(this.#backgroundSprite);
        }
      });
    }
  }
}
