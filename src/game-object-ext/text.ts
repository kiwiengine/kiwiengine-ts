import { EventMap } from '@webtaku/event-emitter';
import { Text as PixiText } from 'pixi.js';
import { GameObject, GameObjectOptions } from '../game-object/game-object';

type TextObjectOptions = {
  text: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: number;
  color?: string;
} & GameObjectOptions;

class TextObject<E extends EventMap = EventMap> extends GameObject<E> {
  #pixiText = new PixiText({ anchor: 0.5 });
  #text?: string;
  #textAlign?: 'left' | 'center' | 'right';
  #fontSize?: number;
  #color?: string;

  constructor(opts?: TextObjectOptions) {
    super(opts);
    this._addPixiChild(this.#pixiText);
    if (opts) {
      if (opts.text) this.text = opts.text;
      if (opts.textAlign) this.textAlign = opts.textAlign;
      if (opts.fontSize) this.fontSize = opts.fontSize;
      if (opts.color) this.color = opts.color;
    }
  }

  get text() {
    return this.#text;
  }

  set text(text: string | undefined) {
    this.#text = text;
    this.#pixiText.text = text || '';
  }

  get textAlign() {
    return this.#textAlign;
  }

  set textAlign(textAlign: 'left' | 'center' | 'right' | undefined) {
    this.#textAlign = textAlign;
    if (textAlign !== undefined) this.#pixiText.style.align = textAlign;
  }

  get fontSize() {
    return this.#fontSize;
  }

  set fontSize(fontSize: number | undefined) {
    this.#fontSize = fontSize;
    if (fontSize !== undefined) this.#pixiText.style.fontSize = fontSize;
  }

  get color() {
    return this.#color;
  }

  set color(color: string | undefined) {
    this.#color = color;
    if (color !== undefined) this.#pixiText.style.fill = color;
  }

  get anchorX() {
    return this.#pixiText.anchor.x - 0.5;
  }

  set anchorX(value: number) {
    this.#pixiText.anchor.x = value + 0.5;
  }

  get anchorY() {
    return this.#pixiText.anchor.y - 0.5;
  }

  set anchorY(value: number) {
    this.#pixiText.anchor.y = value + 0.5;
  }
}

export { TextObject };
