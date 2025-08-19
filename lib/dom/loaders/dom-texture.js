import { Loader } from "../../asset/loaders/loader";
class DomTextureLoader extends Loader {
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
    _dispose(src, texture) {
        texture.remove();
    }
}
export const domTextureLoader = new DomTextureLoader();
//# sourceMappingURL=dom-texture.js.map