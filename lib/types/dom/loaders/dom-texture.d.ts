import { Loader } from "../../asset/loaders/loader";
declare class DomTextureLoader extends Loader<HTMLImageElement> {
    protected _load(src: string): Promise<HTMLImageElement | undefined>;
    protected _dispose(src: string, texture: HTMLImageElement): void;
}
export declare const domTextureLoader: DomTextureLoader;
export {};
//# sourceMappingURL=dom-texture.d.ts.map