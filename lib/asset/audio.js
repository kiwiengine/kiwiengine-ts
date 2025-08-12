import { audioLoader } from './loaders/audio';
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
window.addEventListener('mousedown', () => audioContext.resume());
window.addEventListener('touchend', () => audioContext.resume());
async function getAvailableContext() {
    if (audioContext.state === 'suspended')
        await audioContext.resume();
    return audioContext;
}
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isPageVisible = !document.hidden;
window.addEventListener('visibilitychange', () => isPageVisible = !document.hidden);
class Audio {
    src;
    #volume;
    #loop;
    #audioBuffer;
    #audioContext;
    #gainNode;
    #source;
    #isPlaying = false;
    #isPaused = false;
    #startTime = 0;
    #pauseTime = 0;
    #offset = 0;
    constructor(src, volume, loop) {
        this.src = src;
        this.#volume = volume;
        this.#loop = loop;
        this.play();
    }
    get volume() { return this.#volume; }
    set volume(volume) {
        this.#volume = volume;
        if (this.#gainNode)
            this.#gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
    async play() {
        if (isMobile && !isPageVisible)
            return;
        if (!this.#audioBuffer) {
            if (!audioLoader.checkLoaded(this.src)) {
                console.info(`Audio not preloaded. Loading now: ${this.src}`);
            }
            this.#audioBuffer = await audioLoader.load(this.src);
        }
        if (!this.#audioBuffer)
            return;
        if (this.#isPlaying)
            this.stop();
        if (!this.#isPaused)
            this.#offset = 0;
        this.#isPlaying = true;
        this.#isPaused = false;
        if (!this.#audioContext)
            this.#audioContext = await getAvailableContext();
        if (!this.#isPlaying)
            return;
        if (!this.#gainNode) {
            this.#gainNode = this.#audioContext.createGain();
            this.#gainNode.gain.value = this.#volume;
            this.#gainNode.connect(this.#audioContext.destination);
        }
        this.#source = this.#audioContext.createBufferSource();
        this.#source.buffer = this.#audioBuffer;
        this.#source.loop = this.#loop;
        this.#source.connect(this.#gainNode);
        this.#source.start(0, this.#offset);
        this.#startTime = this.#audioContext.currentTime;
        this.#source.onended = () => { if (!this.#isPaused && !this.#loop)
            this.stop(); };
    }
    #clear() {
        if (this.#source) {
            this.#source.stop();
            this.#source.disconnect();
            this.#source = undefined;
        }
    }
    pause() {
        if (this.#isPlaying && !this.#isPaused) {
            if (this.#audioContext) {
                this.#pauseTime = this.#audioContext.currentTime;
                this.#offset += this.#pauseTime - this.#startTime;
            }
            this.#isPaused = true;
            this.#isPlaying = false;
            this.#clear();
        }
    }
    stop() {
        this.#isPlaying = false;
        this.#isPaused = false;
        this.#offset = 0;
        this.#clear();
    }
}
class MusicPlayer {
    #volume = 0.7;
    #currentAudio;
    constructor() {
        const stored = parseFloat(localStorage.getItem('musicVolume') || '');
        this.#volume = Number.isNaN(stored) ? this.#volume : stored;
        if (isMobile) {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden)
                    this.pause();
                else {
                    isPageVisible = true;
                    this.#currentAudio?.play();
                }
            });
        }
    }
    get volume() {
        return this.#volume;
    }
    set volume(volume) {
        this.#volume = volume;
        localStorage.setItem('musicVolume', volume.toString());
        if (this.#currentAudio)
            this.#currentAudio.volume = volume;
    }
    play(src) {
        if (this.#currentAudio?.src === src)
            return;
        this.#currentAudio?.stop();
        this.#currentAudio = new Audio(src, this.#volume, true);
    }
    pause() {
        this.#currentAudio?.pause();
    }
    stop() {
        this.#currentAudio?.stop();
        this.#currentAudio = undefined;
    }
}
class SfxPlayer {
    #volume = 1;
    constructor() {
        const stored = parseFloat(localStorage.getItem('sfxVolume') || '');
        this.#volume = Number.isNaN(stored) ? this.#volume : stored;
    }
    get volume() {
        return this.#volume;
    }
    set volume(volume) {
        this.#volume = volume;
        localStorage.setItem('sfxVolume', volume.toString());
    }
    play(src) {
        new Audio(src, this.#volume, false);
    }
}
const musicPlayer = new MusicPlayer();
const sfxPlayer = new SfxPlayer();
export { audioContext, musicPlayer, sfxPlayer };
//# sourceMappingURL=audio.js.map