import { Loader } from './loader';
declare class FontFamilyLoader extends Loader<boolean> {
    protected _load(fontName: string): Promise<true | undefined>;
}
export declare const fontFamilyLoader: FontFamilyLoader;
export {};
//# sourceMappingURL=font.d.ts.map