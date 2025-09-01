import { Spritesheet, SpritesheetData } from 'pixi.js';
import { Loader } from './loader';
export declare function getCachedId(src: string, atlas: object): string;
declare class SpritesheetLoader extends Loader<Spritesheet> {
    #private;
    protected doLoad(id: string, src: string, atlas: SpritesheetData): Promise<Spritesheet<SpritesheetData> | undefined>;
    protected cleanup(id: string, spritesheet: Spritesheet): void;
}
export declare const spritesheetLoader: SpritesheetLoader;
export {};
//# sourceMappingURL=spritesheet.d.ts.map