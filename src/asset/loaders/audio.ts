import { audioContext } from '../audio';
import { Loader } from './loader';

class AudioLoader extends Loader<AudioBuffer> {
  protected override async _load(src: string) {
    const loadingPromise = (async () => {
      const response = await fetch(src);
      if (!response.ok) {
        console.error(`Failed to load audio data: ${src}`);
        return;
      }

      const arrayBuffer = await response.arrayBuffer();

      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        this.loadingPromises.delete(src);

        if (this.hasActiveRef(src)) {
          if (this.loadedAssets.has(src)) {
            console.error(`Audio buffer already exists: ${src}`);
          } else {
            this.loadedAssets.set(src, audioBuffer);
            return audioBuffer;
          }
        }
      } catch (error) {
        console.error(`Failed to decode audio data: ${src}`, error);
        this.loadingPromises.delete(src);
      }
    })();

    this.loadingPromises.set(src, loadingPromise);
    return await loadingPromise;
  }
}

export const audioLoader = new AudioLoader();
