import { Texture } from 'pixi.js';
import { Loader } from './loader';

class TextureLoader extends Loader<Texture> {
  protected override async _load(src: string) {
    const loadingPromise = new Promise<Texture | undefined>((resolve) => {
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

        const texture = Texture.from(image);
        this.loadedAssets.set(src, texture);
        resolve(texture);
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

  protected override _dispose(src: string, texture: Texture) {
    texture.destroy(true);
  }
}

export const textureLoader = new TextureLoader();
