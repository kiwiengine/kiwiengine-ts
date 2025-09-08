import { audioContext } from '../audio';
import { Loader } from './loader';
class AudioLoader extends Loader {
    async doLoad(src) {
        const loadingPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok) {
                console.error(`Failed to load audio data: ${src}`);
                return;
            }
            try {
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                this.loadingPromises.delete(src);
                if (this.hasActiveRef(src)) {
                    if (this.cachedAssets.has(src)) {
                        console.error(`Audio buffer already exists: ${src}`);
                    }
                    else {
                        this.cachedAssets.set(src, audioBuffer);
                        return audioBuffer;
                    }
                }
            }
            catch (error) {
                console.error(`Failed to decode audio data: ${src}`, error);
                this.loadingPromises.delete(src);
            }
        })();
        this.loadingPromises.set(src, loadingPromise);
        return await loadingPromise;
    }
}
export const audioLoader = new AudioLoader();
//# sourceMappingURL=audio.js.map