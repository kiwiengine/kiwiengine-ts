import { Texture } from 'pixi.js';
import { Loader } from './loader';
declare class TextureLoader extends Loader<Texture> {
    protected doLoad(src: string): Promise<Texture<import("pixi.js").TextureSource<any>> | undefined>;
    protected cleanup(src: string, texture: Texture): void;
}
export declare const textureLoader: TextureLoader;
export {};
//# sourceMappingURL=texture.d.ts.map