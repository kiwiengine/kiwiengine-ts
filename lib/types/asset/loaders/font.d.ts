import { Loader } from './loader';
declare class FontFamilyLoader extends Loader<boolean> {
    protected doLoad(fontName: string): Promise<true | undefined>;
    load(fontName: string): Promise<boolean | undefined>;
}
export declare const fontFamilyLoader: FontFamilyLoader;
export {};
//# sourceMappingURL=font.d.ts.map