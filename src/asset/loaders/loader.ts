abstract class Loader<T> {
  protected loadedAssets = new Map<string, T>()
  protected loadingPromises = new Map<string, Promise<T | undefined>>()

  #refCount = new Map<string, number>()
  #incRefCount(id: string) { this.#refCount.set(id, (this.#refCount.get(id) || 0) + 1) }

  protected hasActiveRef(id: string) { return this.#refCount.get(id)! > 0 }
  protected abstract doLoad(id: string, ...args: any[]): Promise<T | undefined>
  protected cleanup(id: string, asset: T): void { /* override to clean up */ }

  checkLoaded(id: string) {
    return this.loadedAssets.has(id)
  }

  async load(id: string, ...args: any[]) {
    this.#incRefCount(id)
    if (this.checkLoaded(id)) return this.loadedAssets.get(id)
    if (this.loadingPromises.has(id)) return await this.loadingPromises.get(id)
    return await this.doLoad(id, ...args)
  }

  release(id: string) {
    const refCount = this.#refCount.get(id)
    if (refCount === undefined) throw new Error(`Asset not found: ${id}`)
    if (refCount === 1) {
      this.#refCount.delete(id)
      const asset = this.loadedAssets.get(id)
      if (asset) {
        this.cleanup(id, asset)
        this.loadedAssets.delete(id)
      }
    } else {
      this.#refCount.set(id, refCount - 1)
    }
  }
}

export { Loader }
