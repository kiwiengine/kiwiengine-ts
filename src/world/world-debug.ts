import Matter from 'matter-js';
import Stats from 'stats.js';
import { debugMode } from '../utils/debug';

export class WorldDebug {
  #container: HTMLElement;
  #stats?: Stats;
  #matterDebugRenderer?: Matter.Render;

  constructor(container: HTMLElement) {
    this.#container = container;

    if (debugMode) {
      const stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.showPanel(0);
      container.appendChild(stats.dom);
      this.#stats = stats;
    }
  }

  update() {
    this.#stats?.update();
  }

  createMatterDebugRenderer(engine: Matter.Engine, width: number, height: number) {
    if (debugMode) {
      const matterDebugRenderer = Matter.Render.create({
        element: this.#container,
        engine,
        options: {
          width,
          height,
          background: 'transparent',
          wireframes: false,
          showCollisions: true,
          pixelRatio: window.devicePixelRatio,
        },
      });
      this.#matterDebugRenderer = matterDebugRenderer;

      const debugCanvas = matterDebugRenderer.canvas;
      debugCanvas.style.position = 'absolute';
      debugCanvas.style.zIndex = '1';
      debugCanvas.style.touchAction = 'auto';
      Matter.Render.run(matterDebugRenderer);

      if (this.#lastRect) this.setMatterDebugRendererSize(this.#lastRect, this.#lastWidth, this.#lastHeight, this.#lastCameraX, this.#lastCameraY);
    }
  }

  #lastRect?: DOMRectReadOnly;
  #lastWidth = 0;
  #lastHeight = 0;
  #lastCameraX = 0;
  #lastCameraY = 0;

  setMatterDebugRendererSize(
    rect: DOMRectReadOnly,
    width: number,
    height: number,
    cameraX: number,
    cameraY: number,
  ) {
    this.#lastRect = rect;
    this.#lastWidth = width;
    this.#lastHeight = height;
    this.#lastCameraX = cameraX;
    this.#lastCameraY = cameraY;

    if (!debugMode || !this.#matterDebugRenderer) return;

    const r = this.#matterDebugRenderer;
    const pr = window.devicePixelRatio || 1;

    r.options.width = width;
    r.options.height = height;

    r.canvas.width = Math.max(1, Math.floor(width * pr));
    r.canvas.height = Math.max(1, Math.floor(height * pr));

    const scale = Math.min(rect.width / width, rect.height / height);

    const displayW = width * scale;
    const displayH = height * scale;

    const left = (rect.width - displayW) / 2;
    const top = (rect.height - displayH) / 2;

    r.canvas.style.width = `${displayW}px`;
    r.canvas.style.height = `${displayH}px`;
    r.canvas.style.left = `${left}px`;
    r.canvas.style.top = `${top}px`;

    this.setMatterDebugRendererCamera(cameraX, cameraY);
  }

  setMatterDebugRendererCamera(cameraX: number, cameraY: number) {
    if (this.#matterDebugRenderer) {
      const r = this.#matterDebugRenderer;
      const halfW = this.#lastWidth / 2;
      const halfH = this.#lastHeight / 2;

      r.bounds.min.x = cameraX - halfW;
      r.bounds.min.y = cameraY - halfH;
      r.bounds.max.x = cameraX + halfW;
      r.bounds.max.y = cameraY + halfH;

      Matter.Render.lookAt(r, r.bounds);
    }
  }

  destroy() { }
}
