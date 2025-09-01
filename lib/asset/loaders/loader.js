class Loader {
    loadedAssets = new Map();
    loadingPromises = new Map();
    #refCount = new Map();
    #incRefCount(id) { this.#refCount.set(id, (this.#refCount.get(id) || 0) + 1); }
    hasActiveRef(id) { return this.#refCount.get(id) > 0; }
    cleanup(id, asset) { }
    checkLoaded(id) {
        return this.loadedAssets.has(id);
    }
    async load(id, ...args) {
        this.#incRefCount(id);
        if (this.checkLoaded(id))
            return this.loadedAssets.get(id);
        if (this.loadingPromises.has(id))
            return await this.loadingPromises.get(id);
        return await this.doLoad(id, ...args);
    }
    release(id) {
        const refCount = this.#refCount.get(id);
        if (refCount === undefined)
            throw new Error(`Asset not found: ${id}`);
        if (refCount === 1) {
            this.#refCount.delete(id);
            const asset = this.loadedAssets.get(id);
            if (asset) {
                this.cleanup(id, asset);
                this.loadedAssets.delete(id);
            }
        }
        else {
            this.#refCount.set(id, refCount - 1);
        }
    }
}
export { Loader };
//# sourceMappingURL=loader.js.map