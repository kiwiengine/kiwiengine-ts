import { Loader } from "../../asset/loaders/loader";

class DomTextureLoader extends Loader<HTMLImageElement> {
  protected override async _load(src: string) {
    const loadingPromise = new Promise<HTMLImageElement | undefined>((resolve) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = src;

      image.onload = () => {
        this.loadingPromises.delete(src);

        if (!this.hasActiveRef(src)) {
          resolve(undefined);
          return;
        }

        if (this.loadedAssets.has(src)) {
          console.error(`Texture already loaded: ${src}`);
          resolve(undefined);
          return;
        }

        this.loadedAssets.set(src, image);
        resolve(image);
      };

      image.onerror = (error) => {
        this.loadingPromises.delete(src);
        console.error(`Failed to load texture: ${src}`, error);
        resolve(undefined);
      };
    });

    this.loadingPromises.set(src, loadingPromise);
    return await loadingPromise;
  }

  protected override _dispose(src: string, texture: HTMLImageElement) {
    texture.remove();
  }
}

export const domTextureLoader = new DomTextureLoader();
