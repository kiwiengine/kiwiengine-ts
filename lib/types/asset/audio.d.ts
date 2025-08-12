declare const audioContext: AudioContext;
declare class MusicPlayer {
    #private;
    constructor();
    get volume(): number;
    set volume(volume: number);
    play(src: string): void;
    pause(): void;
    stop(): void;
}
declare class SfxPlayer {
    #private;
    constructor();
    get volume(): number;
    set volume(volume: number);
    play(src: string): void;
}
declare const musicPlayer: MusicPlayer;
declare const sfxPlayer: SfxPlayer;
export { audioContext, musicPlayer, sfxPlayer };
//# sourceMappingURL=audio.d.ts.map