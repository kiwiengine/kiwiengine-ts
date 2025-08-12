import { Loader } from './loader';

class TextLoader extends Loader<string> {
  protected override async _load(src: string) {
    const loadingPromise = (async () => {
      const response = await fetch(src);
      if (!response.ok) {
        console.error(`Failed to load text: ${src}`);
        return;
      }

      const text = await response.text();

      this.loadingPromises.delete(src);

      if (this.hasActiveRef(src)) {
        if (this.loadedAssets.has(src)) {
          console.error(`Text already exists: ${src}`);
        } else {
          this.loadedAssets.set(src, text);
          return text;
        }
      }
    })();

    this.loadingPromises.set(src, loadingPromise);
    return await loadingPromise;
  }
}

export const textLoader = new TextLoader();
