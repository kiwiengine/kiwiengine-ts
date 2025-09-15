import { Atlas } from '../types/atlas';
export type AssetSource = string | {
    src: string;
    atlas: Atlas;
} | {
    fnt: string;
    src: string;
};
export declare function loadAsset(asset: AssetSource): Promise<void>;
export declare function releaseAsset(...assets: AssetSource[]): void;
export declare function preload(assets: AssetSource[], progressCallback?: (progress: number) => void): Promise<() => void>;
//# sourceMappingURL=preload.d.ts.map