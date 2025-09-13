import { Rectangle as PixiRectangle, Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js';
import { bitmapFontLoader } from '../../asset/loaders/bitmap-font';
import { GameObject } from '../core/game-object';
export class BitmapTextNode extends GameObject {
    #fnt;
    #src;
    #text;
    #font;
    #sprites = [];
    constructor(options) {
        super(options);
        this.#fnt = options.fnt;
        this.#src = options.src;
        this.#text = options.text;
        this.#load();
    }
    #updateText() {
        for (const sprite of this.#sprites) {
            sprite.destroy();
        }
        this.#sprites = [];
        if (!this.#font || !this.#text)
            return;
        let xPos = 0, yPos = 0;
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < this.#text.length; i++) {
            const charCode = this.#text.charCodeAt(i);
            if (charCode === 10) {
                xPos = 0;
                yPos += this.#font.lineHeight;
                continue;
            }
            const c = this.#font.chars[charCode];
            if (!c)
                continue;
            const frame = new PixiRectangle(c.x, c.y, c.width, c.height);
            const texture = new PixiTexture({ source: this.#font.texture.source, frame });
            const sprite = new PixiSprite({ texture, zIndex: -999999 });
            const x0 = xPos + c.xoffset;
            const y0 = yPos + c.yoffset;
            sprite.x = x0;
            sprite.y = y0;
            this.#sprites.push(sprite);
            const x1 = x0 + c.width;
            const y1 = y0 + c.height;
            if (x0 < minX)
                minX = x0;
            if (y0 < minY)
                minY = y0;
            if (x1 > maxX)
                maxX = x1;
            if (y1 > maxY)
                maxY = y1;
            xPos += c.xadvance;
        }
        if (minX === Infinity) {
            minX = 0;
            minY = 0;
        }
        if (maxX === -Infinity) {
            maxX = 0;
            maxY = 0;
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        for (const s of this.#sprites) {
            s.x -= cx;
            s.y -= cy;
            this._pixiContainer.addChild(s);
        }
    }
    async #load() {
        if (bitmapFontLoader.checkCached(this.#fnt)) {
            this.#font = bitmapFontLoader.getCached(this.#fnt);
        }
        else {
            console.info(`Bitmap font not preloaded. Loading now: ${this.#fnt}`);
            this.#font = await bitmapFontLoader.load(this.#fnt, this.#src);
        }
        this.#updateText();
    }
    changeFont(fnt, src) {
        if (this.#fnt !== fnt || this.#src !== src) {
            bitmapFontLoader.release(this.#fnt);
            this.#fnt = fnt;
            this.#src = src;
            this.#load();
        }
    }
    set text(text) {
        this.#text = text;
        this.#updateText();
    }
    get text() {
        return this.#text;
    }
    remove() {
        bitmapFontLoader.release(this.#fnt);
        super.remove();
    }
}
//# sourceMappingURL=bitmap-text.js.map