import { audioLoader } from './loaders/audio';
import { binaryLoader } from './loaders/binary';
import { bitmapFontLoader } from './loaders/bitmap-font';
import { fontFamilyLoader } from './loaders/font';
import { getCachedId, spritesheetLoader } from './loaders/spritesheet';
import { textLoader } from './loaders/text';
import { textureLoader } from './loaders/texture';
const hasExt = (path, ...exts) => {
    const lower = path.toLowerCase();
    return exts.some((e) => lower.endsWith(e));
};
export function isText(path) {
    return hasExt(path, '.json', '.atlas');
}
export function isBinary(path) {
    return hasExt(path, '.skel');
}
export function isImage(path) {
    return hasExt(path, '.png', '.jpg', '.jpeg', '.gif', '.webp');
}
export function isAudio(path) {
    return hasExt(path, '.mp3', '.wav', '.ogg');
}
export function isFontFamily(fontFamily) {
    // e.g. 'Inter' or 'Arial', not 'Inter.ttf'
    return !fontFamily.includes('.');
}
export function isSpritesheet(asset) {
    return typeof asset === 'object' && asset !== null && 'src' in asset && 'atlas' in asset;
}
export function isBitmapFont(asset) {
    return typeof asset === 'object' && asset !== null && 'fnt' in asset;
}
export function isStringAsset(asset) {
    return typeof asset === 'string';
}
export async function preload(assets, progressCallback) {
    const total = assets.length;
    let loaded = 0;
    // Edge case: nothing to do
    if (total === 0) {
        progressCallback?.(1);
        return () => void 0;
    }
    const updateProgress = () => {
        loaded += 1;
        progressCallback?.(loaded / total);
    };
    await Promise.all(assets.map(async (asset) => {
        try {
            if (isStringAsset(asset)) {
                if (isText(asset)) {
                    await textLoader.load(asset);
                }
                else if (isBinary(asset)) {
                    await binaryLoader.load(asset);
                }
                else if (isImage(asset)) {
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
            else if (isSpritesheet(asset)) {
                const id = getCachedId(asset.src, asset.atlas);
                await spritesheetLoader.load(id, asset.src, asset.atlas);
            }
            else if (isBitmapFont(asset)) {
                await bitmapFontLoader.load(asset.fnt, asset.src);
            }
            else {
                console.error('Unsupported asset variant encountered');
            }
        }
        finally {
            updateProgress();
        }
    }));
    // Return disposer to release all loaded assets
    return () => {
        for (const asset of assets) {
            if (isStringAsset(asset)) {
                if (isText(asset)) {
                    textLoader.release(asset);
                }
                else if (isBinary(asset)) {
                    binaryLoader.release(asset);
                }
                else if (isImage(asset)) {
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
            else if (isSpritesheet(asset)) {
                const id = getCachedId(asset.src, asset.atlas);
                spritesheetLoader.release(id);
            }
            else if (isBitmapFont(asset)) {
                bitmapFontLoader.release(asset.fnt);
            }
        }
    };
}
//# sourceMappingURL=preload.js.map