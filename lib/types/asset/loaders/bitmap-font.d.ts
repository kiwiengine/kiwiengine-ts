import { BitmapFont, Char } from '../../types/bitmap-font';
import { Loader } from './loader';
declare class BitmapFontLoader extends Loader<BitmapFont> {
    #private;
    protected doLoad(fnt: string, src: string): Promise<{
        src: string;
        chars: Record<number, Char>;
        texture: import("pixi.js").Texture<import("pixi.js").TextureSource<any>>;
        size: number;
        lineHeight: number;
    }>;
    protected cleanup(fnt: string): void;
}
export declare const bitmapFontLoader: BitmapFontLoader;
export {};
//# sourceMappingURL=bitmap-font.d.ts.map