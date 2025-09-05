import { audioLoader } from '../asset/loaders/audio';
import { fontFamilyLoader } from '../asset/loaders/font';
import { domTextureLoader } from './dom-texture-loader';
const loaderForPathMap = [
    { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: domTextureLoader },
    { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
    { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
];
function getLoaderForPath(path) {
    return loaderForPathMap.find(({ check }) => check(path))?.loader;
}
async function loadAsset(asset) {
    const loader = getLoaderForPath(asset);
    if (!loader) {
        console.warn(`No loader found for asset: ${asset}`);
        return;
    }
    await loader.load(asset);
}
function releaseAsset(asset) {
    const loader = getLoaderForPath(asset);
    if (!loader) {
        console.warn(`No loader found for asset: ${asset}`);
        return;
    }
    loader.release(asset);
}
export async function domPreload(assets, progressCallback) {
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
//# sourceMappingURL=dom-preload.js.map