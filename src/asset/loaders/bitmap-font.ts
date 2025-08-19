import { BitmapFont, Char } from '../../types/bitmap-font';
import { Loader } from './loader';
import { textureLoader } from './texture';

class BitmapFontLoader extends Loader<BitmapFont> {
  #fntToSrc = new Map<string, string>();

  protected override async _load(fnt: string, src: string) {
    this.#fntToSrc.set(fnt, src);

    const loadingPromise = (async () => {
      const texture = await textureLoader.load(src);
      if (!texture) {
        console.error(`Failed to load texture: ${src}`);
        return;
      }

      const response = await fetch(fnt);
      if (!response.ok) {
        console.error(`Failed to load text: ${src}`);
        return;
      }

      const text = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');

      const infoEl = xmlDoc.getElementsByTagName('info')[0];
      const commonEl = xmlDoc.getElementsByTagName('common')[0];
      const charEls = xmlDoc.getElementsByTagName('char');

      const size = parseInt(infoEl.getAttribute('size') || '16', 10);
      const lineHeight = parseInt(commonEl.getAttribute('lineHeight') || '32', 10);

      const chars: Record<number, Char> = {};

      for (let i = 0; i < charEls.length; i++) {
        const charEl = charEls[i];

        const id = parseInt(charEl.getAttribute('id')!, 10);
        const x = parseInt(charEl.getAttribute('x')!, 10);
        const y = parseInt(charEl.getAttribute('y')!, 10);
        const width = parseInt(charEl.getAttribute('width')!, 10);
        const height = parseInt(charEl.getAttribute('height')!, 10);
        const xoffset = parseInt(charEl.getAttribute('xoffset')!, 10);
        const yoffset = parseInt(charEl.getAttribute('yoffset')!, 10);
        const xadvance = parseInt(charEl.getAttribute('xadvance')!, 10);

        chars[id] = { x, y, width, height, xoffset, yoffset, xadvance };
      }

      this.loadingPromises.delete(fnt);

      if (this.hasActiveRef(fnt)) {
        if (this.loadedAssets.has(fnt)) {
          console.error(`Bitmap font already exists: ${fnt}`);
        } else {
          const bitmapFont: BitmapFont = { chars, texture, size, lineHeight };
          this.loadedAssets.set(fnt, bitmapFont);
          return bitmapFont;
        }
      }
    })();

    this.loadingPromises.set(fnt, loadingPromise);
    return await loadingPromise;
  }

  protected override _dispose(fnt: string) {
    const src = this.#fntToSrc.get(fnt);
    if (src) textureLoader.release(src);
  }
}

export const bitmapFontLoader = new BitmapFontLoader();
