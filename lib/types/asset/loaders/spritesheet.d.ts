import { Dict, Spritesheet, SpritesheetFrameData } from 'pixi.js';
import { Atlas } from '../../types/atlas';
import { Loader } from './loader';
export declare function getCachedAtlasId(src: string, atlas: Atlas): string;
declare class SpritesheetLoader extends Loader<Spritesheet> {
    #private;
    protected doLoad(id: string, src: string, atlas: Atlas): Promise<Spritesheet<{
        frames: Dict<SpritesheetFrameData>;
        meta: {
            scale: number;
        };
        animations: Dict<string[]>;
    }> | undefined>;
    protected cleanup(id: string, spritesheet: Spritesheet): void;
}
export declare const spritesheetLoader: SpritesheetLoader;
export {};
//# sourceMappingURL=spritesheet.d.ts.map