import { SpritesheetData } from 'pixi.js';
export type SpritesheetSource = {
    src: string;
    atlas: SpritesheetData;
};
export type BitmapFontSource = {
    fnt: string;
    src: string;
};
export type AssetSource = string | SpritesheetSource | BitmapFontSource;
export declare function isText(path: string): boolean;
export declare function isBinary(path: string): boolean;
export declare function isImage(path: string): boolean;
export declare function isAudio(path: string): boolean;
export declare function isFontFamily(fontFamily: string): boolean;
export declare function isSpritesheet(asset: AssetSource): asset is SpritesheetSource;
export declare function isBitmapFont(asset: AssetSource): asset is BitmapFontSource;
export declare function isStringAsset(asset: AssetSource): asset is string;
export declare function preload(assets: readonly AssetSource[], progressCallback?: (progress01: number) => void): Promise<() => void>;
//# sourceMappingURL=preload.d.ts.map