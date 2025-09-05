import { Loader } from '../asset/loaders/loader';
declare class DomTextureLoader extends Loader<HTMLImageElement> {
    protected doLoad(src: string): Promise<HTMLImageElement | undefined>;
    protected cleanup(src: string, texture: HTMLImageElement): void;
}
export declare const domTextureLoader: DomTextureLoader;
export {};
//# sourceMappingURL=dom-texture-loader.d.ts.map