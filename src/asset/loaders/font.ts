import { Loader } from './loader';

class FontFamilyLoader extends Loader<boolean> {
  protected override async _load(fontName: string) {
    const loadingPromise = (async () => {
      if ('fonts' in document) {
        try {
          await document.fonts.load(`1em ${fontName}`);
          await document.fonts.ready;
          this.loadingPromises.delete(fontName);
          return true;
        } catch (error) {
          console.error(`Failed to load font: ${fontName}`, error);
          this.loadingPromises.delete(fontName);
        }
      } else {
        console.warn(`This browser does not support the Font Loading API`);
        this.loadingPromises.delete(fontName);
      }
    })();

    this.loadingPromises.set(fontName, loadingPromise);
    return await loadingPromise;
  }
}

export const fontFamilyLoader = new FontFamilyLoader();
