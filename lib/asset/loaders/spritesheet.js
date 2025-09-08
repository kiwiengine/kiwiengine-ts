import { Spritesheet } from 'pixi.js';
import { Loader } from './loader';
import { textureLoader } from './texture';
const atlasIdCache = new WeakMap();
let idCounter = 0;
export function getCachedAtlasId(src, atlas) {
    let innerMap = atlasIdCache.get(atlas);
    if (!innerMap) {
        innerMap = new Map();
        atlasIdCache.set(atlas, innerMap);
    }
    if (!innerMap.has(src)) {
        innerMap.set(src, `${src}#${idCounter++}`);
    }
    return innerMap.get(src);
}
class SpritesheetLoader extends Loader {
    #idToSrc = new Map();
    async doLoad(id, src, atlas) {
        this.#idToSrc.set(id, src);
        const loadingPromise = (async () => {
            const texture = await textureLoader.load(src);
            if (!texture) {
                console.error(`Failed to load texture: ${src}`);
                return;
            }
            const frames = {};
            for (const [key, value] of Object.entries(atlas.frames)) {
                frames[key] = { frame: value };
            }
            const animations = {};
            for (const [key, value] of Object.entries(atlas.animations)) {
                animations[key] = value.frames;
            }
            const spritesheet = new Spritesheet(texture, { frames, meta: { scale: 1 }, animations });
            await spritesheet.parse();
            this.loadingPromises.delete(id);
            if (this.hasActiveRef(id)) {
                if (this.cachedAssets.has(id)) {
                    textureLoader.release(src);
                    console.error(`Spritesheet already exists: ${src}`);
                }
                else {
                    this.cachedAssets.set(id, spritesheet);
                    return spritesheet;
                }
            }
            else {
                textureLoader.release(src);
            }
        })();
        this.loadingPromises.set(id, loadingPromise);
        return await loadingPromise;
    }
    cleanup(id, spritesheet) {
        spritesheet.destroy();
        const src = this.#idToSrc.get(id);
        if (src)
            textureLoader.release(src);
    }
}
export const spritesheetLoader = new SpritesheetLoader();
//# sourceMappingURL=spritesheet.js.map