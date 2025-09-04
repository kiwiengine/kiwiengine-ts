import { Loader } from './loader'

class BinaryLoader extends Loader<Uint8Array> {
  protected override async doLoad(src: string) {
    const loadingPromise = (async () => {
      const response = await fetch(src)
      if (!response.ok) {
        console.error(`Failed to load binary data: ${src}`)
        return
      }

      const arrayBuffer = await response.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)

      this.loadingPromises.delete(src)

      if (this.hasActiveRef(src)) {
        if (this.cachedAssets.has(src)) {
          console.error(`Binary data already exists: ${src}`)
        } else {
          this.cachedAssets.set(src, data)
          return data
        }
      }
    })()

    this.loadingPromises.set(src, loadingPromise)
    return await loadingPromise
  }
}

export const binaryLoader = new BinaryLoader()
