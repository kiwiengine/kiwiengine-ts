import { Texture } from 'pixi.js';
import { Loader } from './loader';
class TextureLoader extends Loader {
    async _load(src) {
        const loadingPromise = new Promise((resolve) => {
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
    _dispose(src, texture) {
        texture.destroy(true);
    }
}
export const textureLoader = new TextureLoader();
//# sourceMappingURL=texture.js.map