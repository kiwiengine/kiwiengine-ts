import { SpritesheetData } from 'pixi.js';
export type AssetSource = string | {
    src: string;
    atlas: SpritesheetData;
};
export declare function isText(path: string): boolean;
export declare function isBinary(path: string): boolean;
export declare function isImage(path: string): boolean;
export declare function isAudio(path: string): boolean;
export declare function isFontFamily(fontFamily: string): boolean;
export declare function preload(assets: AssetSource[], progressCallback?: (progress: number) => void): Promise<() => void>;
//# sourceMappingURL=preload.d.ts.map