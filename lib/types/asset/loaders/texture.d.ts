import { Texture } from 'pixi.js';
import { Loader } from './loader';
declare class TextureLoader extends Loader<Texture> {
    protected _load(src: string): Promise<Texture<import("pixi.js").TextureSource<any>> | undefined>;
    protected _dispose(src: string, texture: Texture): void;
}
export declare const textureLoader: TextureLoader;
export {};
//# sourceMappingURL=texture.d.ts.map