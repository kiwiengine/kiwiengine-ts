abstract class Loader<T> {
  protected loadedAssets: Map<string, T> = new Map();
  protected loadingPromises: Map<string, Promise<T | undefined>> = new Map();

  #refCount: Map<string, number> = new Map();
  #incRefCount(id: string) { this.#refCount.set(id, (this.#refCount.get(id) || 0) + 1); }

  protected hasActiveRef(id: string) { return this.#refCount.get(id)! > 0; }
  protected abstract _load(id: string, ...args: any[]): Promise<T | undefined>;
  protected _dispose(id: string, asset: T): void { /* override to clean up */ }

  checkLoaded(id: string) {
    return this.loadedAssets.has(id);
  }

  async load(id: string, ...args: any[]) {
    this.#incRefCount(id);
    if (this.checkLoaded(id)) return this.loadedAssets.get(id);
    if (this.loadingPromises.has(id)) return await this.loadingPromises.get(id);
    return await this._load(id, ...args);
  }

  release(id: string) {
    const refCount = this.#refCount.get(id);
    if (refCount === undefined) throw new Error(`Asset not found: ${id}`);
    if (refCount === 1) {
      this.#refCount.delete(id);
      const asset = this.loadedAssets.get(id);
      if (asset) {
        this._dispose(id, asset);
        this.loadedAssets.delete(id);
      }
    } else {
      this.#refCount.set(id, refCount - 1);
    }
  }
}

export { Loader };
