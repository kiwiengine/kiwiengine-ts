import { BitmapFont } from '../../types/bitmap-font';
import { Loader } from './loader';
declare class BitmapFontLoader extends Loader<BitmapFont> {
    #private;
    protected _load(fnt: string, src: string): Promise<BitmapFont | undefined>;
    protected _dispose(fnt: string): void;
}
export declare const bitmapFontLoader: BitmapFontLoader;
export {};
//# sourceMappingURL=bitmap-font.d.ts.map