import { audioLoader } from '../asset/loaders/audio'
import { fontFamilyLoader } from '../asset/loaders/font'
import { Loader } from '../asset/loaders/loader'
import { domTextureLoader } from './dom-texture-loader'

const loaderForPathMap: Array<{ check: (path: string) => boolean, loader: Loader<any> }> = [
  { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: domTextureLoader },
  { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
  { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
]

function getLoaderForPath(path: string): Loader<any> | undefined {
  return loaderForPathMap.find(({ check }) => check(path))?.loader
}

async function loadAsset(asset: string): Promise<void> {
  const loader = getLoaderForPath(asset)
  if (!loader) {
    console.warn(`No loader found for asset: ${asset}`)
    return
  }
  await loader.load(asset)
}

function releaseAsset(asset: string): void {
  const loader = getLoaderForPath(asset)
  if (!loader) {
    console.warn(`No loader found for asset: ${asset}`)
    return
  }
  loader.release(asset)
}

export async function domPreload(
  assets: string[],
  progressCallback?: (progress: number) => void
): Promise<() => void> {
  let loaded = 0
  const total = assets.length

  await Promise.all(
    assets.map(async (asset) => {
      try {
        await loadAsset(asset)
        loaded++
        progressCallback?.(loaded / total)
      } catch (err) {
        console.error(`Failed to load asset:`, asset, err)
      }
    })
  )

  return () => assets.forEach(releaseAsset)
}
