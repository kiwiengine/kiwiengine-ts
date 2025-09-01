import { textureLoader } from './loaders/texture';
export async function preload(assets, progressCallback) {
    const total = assets.length;
    let loaded = 0;
    await Promise.all(assets.map(async (asset) => {
        await textureLoader.load(asset);
        loaded++;
        progressCallback?.(loaded / total);
    }));
    return () => {
        assets.forEach((asset) => {
            textureLoader.release(asset);
        });
    };
}
//# sourceMappingURL=preload.js.map