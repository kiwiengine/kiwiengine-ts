import { audioLoader } from './loaders/audio';
import { binaryLoader } from './loaders/binary';
import { fontFamilyLoader } from './loaders/font';
import { getCachedId, spritesheetLoader } from './loaders/spritesheet';
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
async function loadAsset(asset) {
    if (typeof asset === 'string') {
        const loader = getLoaderForPath(asset);
        if (!loader) {
            console.warn(`No loader found for asset: ${asset}`);
            return;
        }
        await loader.load(asset);
    }
    else {
        const id = getCachedId(asset.src, asset.atlas);
        await spritesheetLoader.load(id, asset.src, asset.atlas);
    }
}
function releaseAsset(asset) {
    if (typeof asset === 'string') {
        const loader = getLoaderForPath(asset);
        if (!loader) {
            console.warn(`No loader found for asset: ${asset}`);
            return;
        }
        loader.release(asset);
    }
    else {
        const id = getCachedId(asset.src, asset.atlas);
        spritesheetLoader.release(id);
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
    return () => assets.forEach(releaseAsset);
}
//# sourceMappingURL=preload.js.map