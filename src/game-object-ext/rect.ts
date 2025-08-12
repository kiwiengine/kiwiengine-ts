import { EventMap } from '@webtaku/event-emitter';
import { FillInput, Graphics, StrokeInput } from 'pixi.js';
import { GameObject } from '../game-object/game-object';

class RectangleObject<E extends EventMap = EventMap> extends GameObject<E> {
  #graphics = new Graphics({ zIndex: -999999 });
  #width: number = 0;
  #height: number = 0;
  #fill?: FillInput;
  #stroke?: StrokeInput;

  constructor() {
    super();
    this._addPixiChild(this.#graphics);
  }

  #draw() {
    this.#graphics.clear().rect(
      -this.#width / 2,
      -this.#height / 2,
      this.#width,
      this.#height,
    );
    if (this.#fill) this.#graphics.fill(this.#fill);
    if (this.#stroke) this.#graphics.stroke(this.#stroke);
  }

  get width(): number { return this.#width; }
  set width(value: number) { this.#width = value; this.#draw(); }
  get height(): number { return this.#height; }
  set height(value: number) { this.#height = value; this.#draw(); }

  get fill(): FillInput | undefined { return this.#fill; }
  set fill(value: FillInput | undefined) { this.#fill = value; this.#draw(); }

  get stroke(): StrokeInput | undefined { return this.#stroke; }
  set stroke(value: StrokeInput | undefined) { this.#stroke = value; this.#draw(); }
}

export { RectangleObject };
