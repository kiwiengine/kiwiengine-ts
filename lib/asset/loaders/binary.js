import { Loader } from './loader';
class BinaryLoader extends Loader {
    async _load(src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load binary data: ${src}`);
                return;
            }
            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            this.loadingPromises.delete(src);
            if (this.hasActiveRef(src)) {
                if (this.loadedAssets.has(src)) {
                    console.error(`Binary data already exists: ${src}`);
                }
                else {
                    this.loadedAssets.set(src, data);
                    return data;
                }
            }
        })();
        this.loadingPromises.set(src, loadingPromise);
        return await loadingPromise;
    }
}
export const binaryLoader = new BinaryLoader();
//# sourceMappingURL=binary.js.map