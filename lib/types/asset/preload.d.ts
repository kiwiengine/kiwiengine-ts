import { SpritesheetData } from 'pixi.js';
type AssetSource = string | {
    src: string;
    atlas: SpritesheetData;
};
declare function preload(assets: AssetSource[], progressCallback: (progress: number) => void): Promise<() => void>;
export { AssetSource, preload };
//# sourceMappingURL=preload.d.ts.map