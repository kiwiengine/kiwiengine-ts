import { Loader } from './loader';
class TextLoader extends Loader {
    async _load(src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load text: ${src}`);
                return;
            }
            const text = await response.text();
            this.loadingPromises.delete(src);
            if (this.hasActiveRef(src)) {
                if (this.loadedAssets.has(src)) {
                    console.error(`Text already exists: ${src}`);
                }
                else {
                    this.loadedAssets.set(src, text);
                    return text;
                }
            }
        })();
        this.loadingPromises.set(src, loadingPromise);
        return await loadingPromise;
    }
}
export const textLoader = new TextLoader();
//# sourceMappingURL=text.js.map