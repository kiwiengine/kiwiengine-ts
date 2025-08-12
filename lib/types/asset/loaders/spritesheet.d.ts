import { Spritesheet, SpritesheetData } from 'pixi.js';
import { Loader } from './loader';
declare function getCachedId(src: string, atlas: object): string;
declare class SpritesheetLoader extends Loader<Spritesheet> {
    #private;
    protected _load(id: string, src: string, atlas: SpritesheetData): Promise<Spritesheet<SpritesheetData> | undefined>;
    protected _dispose(id: string, spritesheet: Spritesheet): void;
}
declare const spritesheetLoader: SpritesheetLoader;
export { getCachedId, spritesheetLoader };
//# sourceMappingURL=spritesheet.d.ts.map