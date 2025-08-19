import { audioLoader } from "../../asset/loaders/audio";
import { fontFamilyLoader } from "../../asset/loaders/font";
import { AssetSource, isAudio, isFontFamily, isImage } from "../../asset/preload";
import { domTextureLoader } from "./dom-texture";

async function domPreload(assets: string[], progressCallback?: (progress: number) => void) {
  const total = assets.length;
  let loaded = 0;

  await Promise.all(assets.map(async (asset) => {
    if (isImage(asset)) {
      await domTextureLoader.load(asset);
    } else if (isAudio(asset)) {
      await audioLoader.load(asset);
    } else if (isFontFamily(asset)) {
      await fontFamilyLoader.load(asset);
    } else {
      console.error(`Unknown asset type: ${asset}`);
    }

    loaded++;
    progressCallback?.(loaded / total);
  }));

  return () => {
    assets.forEach((asset) => {
      if (isImage(asset)) {
        domTextureLoader.release(asset);
      } else if (isAudio(asset)) {
        audioLoader.release(asset);
      } else if (isFontFamily(asset)) {
        fontFamilyLoader.release(asset);
      } else {
        console.error(`Unknown asset type: ${asset}`);
      }
    });
  };
}

export { AssetSource, domPreload };
