import { audioLoader } from './loaders/audio';
import { fontFamilyLoader } from './loaders/font';
import { getCachedId, spritesheetLoader } from './loaders/spritesheet';
import { textureLoader } from './loaders/texture';
function isImage(path) {
    return path.endsWith('.png') ||
        path.endsWith('.jpg') ||
        path.endsWith('.jpeg') ||
        path.endsWith('.gif') ||
        path.endsWith('.webp');
}
function isAudio(path) {
    return path.endsWith('.mp3') ||
        path.endsWith('.wav') ||
        path.endsWith('.ogg');
}
function isFontFamily(fontFamily) {
    return !fontFamily.includes('.');
}
async function preload(assets, progressCallback) {
    const total = assets.length;
    let loaded = 0;
    await Promise.all(assets.map(async (asset) => {
        if (typeof asset === 'string') {
            if (isImage(asset)) {
                await textureLoader.load(asset);
            }
            else if (isAudio(asset)) {
                await audioLoader.load(asset);
            }
            else if (isFontFamily(asset)) {
                await fontFamilyLoader.load(asset);
            }
            else {
                console.error(`Unknown asset type: ${asset}`);
            }
        }
        else {
            const id = getCachedId(asset.src, asset.atlas);
            await spritesheetLoader.load(id, asset.src, asset.atlas);
        }
        loaded++;
        progressCallback?.(loaded / total);
    }));
    return () => {
        assets.forEach((asset) => {
            if (typeof asset === 'string') {
                if (isImage(asset)) {
                    textureLoader.release(asset);
                }
                else if (isAudio(asset)) {
                    audioLoader.release(asset);
                }
                else if (isFontFamily(asset)) {
                    fontFamilyLoader.release(asset);
                }
                else {
                    console.error(`Unknown asset type: ${asset}`);
                }
            }
            else {
                const id = getCachedId(asset.src, asset.atlas);
                spritesheetLoader.release(id);
            }
        });
    };
}
export { preload };
//# sourceMappingURL=preload.js.map