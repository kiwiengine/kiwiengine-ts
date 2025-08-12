import { Spritesheet, SpritesheetData } from 'pixi.js';
import { Loader } from './loader';
import { textureLoader } from './texture';

const atlasIdCache = new WeakMap<object, Map<string, string>>();
let idCounter = 0;

function getCachedId(src: string, atlas: object): string {
  let innerMap = atlasIdCache.get(atlas);
  if (!innerMap) {
    innerMap = new Map<string, string>();
    atlasIdCache.set(atlas, innerMap);
  }

  if (!innerMap.has(src)) {
    innerMap.set(src, `${src}#${idCounter++}`);
  }

  return innerMap.get(src)!;
}

class SpritesheetLoader extends Loader<Spritesheet> {
  #idToSrc: Map<string, string> = new Map();

  protected override async _load(id: string, src: string, atlas: SpritesheetData) {
    this.#idToSrc.set(id, src);

    const loadingPromise = (async () => {
      const texture = await textureLoader.load(src);
      if (!texture) {
        console.error(`Failed to load texture: ${src}`);
        return;
      }

      const spritesheet = new Spritesheet(texture, atlas);
      await spritesheet.parse();

      this.loadingPromises.delete(id);

      if (this.hasActiveRef(id)) {
        if (this.loadedAssets.has(id)) {
          textureLoader.release(src);
          console.error(`Spritesheet already exists: ${src}`);
        } else {
          this.loadedAssets.set(id, spritesheet);
          return spritesheet;
        }
      } else {
        textureLoader.release(src);
      }
    })();

    this.loadingPromises.set(id, loadingPromise);
    return await loadingPromise;
  }

  protected override _dispose(id: string, spritesheet: Spritesheet) {
    spritesheet.destroy();

    const src = this.#idToSrc.get(id);
    if (src) textureLoader.release(src);
  }
}

const spritesheetLoader = new SpritesheetLoader();

export { getCachedId, spritesheetLoader };
