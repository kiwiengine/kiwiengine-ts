import { SpritesheetData } from 'pixi.js';
export type AssetSource = string | {
    src: string;
    atlas: SpritesheetData;
} | {
    fnt: string;
    src: string;
};
export declare function preload(assets: AssetSource[], progressCallback?: (progress: number) => void): Promise<() => void>;
//# sourceMappingURL=preload.d.ts.map