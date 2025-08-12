import { Text as PixiText } from 'pixi.js';
import { GameObject } from '../game-object/game-object';
class TextObject extends GameObject {
    #pixiText = new PixiText({ anchor: 0.5 });
    #text;
    #textAlign;
    #fontSize;
    #color;
    constructor(opts) {
        super(opts);
        this._addPixiChild(this.#pixiText);
        if (opts) {
            if (opts.text)
                this.text = opts.text;
            if (opts.textAlign)
                this.textAlign = opts.textAlign;
            if (opts.fontSize)
                this.fontSize = opts.fontSize;
            if (opts.color)
                this.color = opts.color;
        }
    }
    get text() {
        return this.#text;
    }
    set text(text) {
        this.#text = text;
        this.#pixiText.text = text || '';
    }
    get textAlign() {
        return this.#textAlign;
    }
    set textAlign(textAlign) {
        this.#textAlign = textAlign;
        if (textAlign !== undefined)
            this.#pixiText.style.align = textAlign;
    }
    get fontSize() {
        return this.#fontSize;
    }
    set fontSize(fontSize) {
        this.#fontSize = fontSize;
        if (fontSize !== undefined)
            this.#pixiText.style.fontSize = fontSize;
    }
    get color() {
        return this.#color;
    }
    set color(color) {
        this.#color = color;
        if (color !== undefined)
            this.#pixiText.style.fill = color;
    }
    get anchorX() {
        return this.#pixiText.anchor.x - 0.5;
    }
    set anchorX(value) {
        this.#pixiText.anchor.x = value + 0.5;
    }
    get anchorY() {
        return this.#pixiText.anchor.y - 0.5;
    }
    set anchorY(value) {
        this.#pixiText.anchor.y = value + 0.5;
    }
}
export { TextObject };
//# sourceMappingURL=text.js.map