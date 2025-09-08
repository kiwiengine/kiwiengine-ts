import { Texture } from 'pixi.js';
import { Loader } from './loader';
class TextureLoader extends Loader {
    async doLoad(src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load texture: ${src}`);
                return;
            }
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob, { premultiplyAlpha: 'premultiply' });
            this.loadingPromises.delete(src);
            if (this.hasActiveRef(src)) {
                if (this.cachedAssets.has(src)) {
                    console.error(`Texture already exists: ${src}`);
                }
                else {
                    const texture = Texture.from(bitmap);
                    texture.source.scaleMode = 'nearest';
                    this.cachedAssets.set(src, texture);
                    return texture;
                }
            }
        })();
        this.loadingPromises.set(src, loadingPromise);
        return await loadingPromise;
    }
    async load(src) {
        return await super.load(src);
    }
}
export const textureLoader = new TextureLoader();
//# sourceMappingURL=texture.js.map