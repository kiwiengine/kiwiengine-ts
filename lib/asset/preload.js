import { audioLoader } from './loaders/audio';
import { binaryLoader } from './loaders/binary';
import { bitmapFontLoader } from './loaders/bitmap-font';
import { fontFamilyLoader } from './loaders/font';
import { getCachedAtlasId, spritesheetLoader } from './loaders/spritesheet';
import { textLoader } from './loaders/text';
import { textureLoader } from './loaders/texture';
const loaderForPathMap = [
    { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: textLoader },
    { check: (p) => p.endsWith('.skel'), loader: binaryLoader },
    { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: textureLoader },
    { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
    { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
];
function getLoaderForPath(path) {
    return loaderForPathMap.find(({ check }) => check(path))?.loader;
}
export async function loadAsset(asset) {
    if (typeof asset === 'string') {
        const loader = getLoaderForPath(asset);
        if (!loader) {
            console.warn(`No loader found for asset: ${asset}`);
            return;
        }
        await loader.load(asset);
    }
    else if ('atlas' in asset) {
        const id = getCachedAtlasId(asset.src, asset.atlas);
        await spritesheetLoader.load(id, asset.src, asset.atlas);
    }
    else if ('fnt' in asset) {
        await bitmapFontLoader.load(asset.fnt, asset.src);
    }
    else {
        console.warn(`Unknown asset type: ${asset}`);
    }
}
export function releaseAsset(...assets) {
    for (const asset of assets) {
        if (typeof asset === 'string') {
            const loader = getLoaderForPath(asset);
            if (!loader) {
                console.warn(`No loader found for asset: ${asset}`);
                return;
            }
            loader.release(asset);
        }
        else if ('atlas' in asset) {
            const id = getCachedAtlasId(asset.src, asset.atlas);
            spritesheetLoader.release(id);
        }
        else if ('fnt' in asset) {
            bitmapFontLoader.release(asset.fnt);
        }
        else {
            console.warn(`Unknown asset type: ${asset}`);
        }
    }
}
export async function preload(assets, progressCallback) {
    let loaded = 0;
    const total = assets.length;
    await Promise.all(assets.map(async (asset) => {
        try {
            await loadAsset(asset);
            loaded++;
            progressCallback?.(loaded / total);
        }
        catch (err) {
            console.error(`Failed to load asset:`, asset, err);
        }
    }));
    return () => releaseAsset(...assets);
}
//# sourceMappingURL=preload.js.map