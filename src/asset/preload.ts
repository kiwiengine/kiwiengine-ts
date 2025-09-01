import { SpritesheetData } from 'pixi.js'
import { audioLoader } from './loaders/audio'
import { binaryLoader } from './loaders/binary'
import { fontFamilyLoader } from './loaders/font'
import { Loader } from './loaders/loader'
import { getCachedId, spritesheetLoader } from './loaders/spritesheet'
import { textLoader } from './loaders/text'
import { textureLoader } from './loaders/texture'

export type AssetSource = string | {
  src: string
  atlas: SpritesheetData
}

const loaderForPathMap: Array<{ check: (path: string) => boolean, loader: Loader<any> }> = [
  { check: (p) => p.endsWith('.json') || p.endsWith('.atlas'), loader: textLoader },
  { check: (p) => p.endsWith('.skel'), loader: binaryLoader },
  { check: (p) => /\.(png|jpe?g|gif|webp)$/.test(p), loader: textureLoader },
  { check: (p) => /\.(mp3|wav|ogg)$/.test(p), loader: audioLoader },
  { check: (p) => !p.includes('.'), loader: fontFamilyLoader }
]

function getLoaderForPath(path: string): Loader<any> | undefined {
  return loaderForPathMap.find(({ check }) => check(path))?.loader
}

async function loadAsset(asset: AssetSource): Promise<void> {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for asset: ${asset}`)
      return
    }
    await loader.load(asset)
  } else {
    const id = getCachedId(asset.src, asset.atlas)
    await spritesheetLoader.load(id, asset.src, asset.atlas)
  }
}

function releaseAsset(asset: AssetSource): void {
  if (typeof asset === 'string') {
    const loader = getLoaderForPath(asset)
    if (!loader) {
      console.warn(`No loader found for asset: ${asset}`)
      return
    }
    loader.release(asset)
  } else {
    const id = getCachedId(asset.src, asset.atlas)
    spritesheetLoader.release(id)
  }
}

export async function preload(
  assets: AssetSource[],
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
