import { SpritesheetData } from 'pixi.js';
import { audioLoader } from './loaders/audio';
import { binaryLoader } from './loaders/binary';
import { fontFamilyLoader } from './loaders/font';
import { getCachedId, spritesheetLoader } from './loaders/spritesheet';
import { textLoader } from './loaders/text';
import { textureLoader } from './loaders/texture';

export type AssetSource = string | {
  src: string;
  atlas: SpritesheetData;
};

export function isText(path: string): boolean {
  return path.endsWith('.json') ||
    path.endsWith('.atlas');
}

export function isBinary(path: string): boolean {
  return path.endsWith('.skel');
}

export function isImage(path: string): boolean {
  return path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.gif') ||
    path.endsWith('.webp');
}

export function isAudio(path: string): boolean {
  return path.endsWith('.mp3') ||
    path.endsWith('.wav') ||
    path.endsWith('.ogg');
}

export function isFontFamily(fontFamily: string): boolean {
  return !fontFamily.includes('.');
}

export async function preload(assets: AssetSource[], progressCallback?: (progress: number) => void) {
  const total = assets.length;
  let loaded = 0;

  await Promise.all(assets.map(async (asset) => {
    if (typeof asset === 'string') {
      if (isText(asset)) {
        await textLoader.load(asset);
      } else if (isBinary(asset)) {
        await binaryLoader.load(asset);
      } else if (isImage(asset)) {
        await textureLoader.load(asset);
      } else if (isAudio(asset)) {
        await audioLoader.load(asset);
      } else if (isFontFamily(asset)) {
        await fontFamilyLoader.load(asset);
      } else {
        console.error(`Unknown asset type: ${asset}`);
      }
    }
    else {
      const id = getCachedId(asset.src, asset.atlas);
      await spritesheetLoader.load(id, asset.src, asset.atlas);
    }

    loaded++;
    progressCallback?.(loaded / total);
  }));

  return () => {
    assets.forEach((asset) => {
      if (typeof asset === 'string') {
        if (isText(asset)) {
          textLoader.release(asset);
        } else if (isBinary(asset)) {
          binaryLoader.release(asset);
        } else if (isImage(asset)) {
          textureLoader.release(asset);
        } else if (isAudio(asset)) {
          audioLoader.release(asset);
        } else if (isFontFamily(asset)) {
          fontFamilyLoader.release(asset);
        } else {
          console.error(`Unknown asset type: ${asset}`);
        }
      }
      else {
        const id = getCachedId(asset.src, asset.atlas);
        spritesheetLoader.release(id);
      }
    });
  };
}
