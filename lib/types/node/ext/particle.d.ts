import { BLEND_MODES } from 'pixi.js';
import { GameObject, GameObjectOptions } from '../core/game-object';
type RandomRange = {
    min: number;
    max: number;
};
export type ParticleSystemOptions = {
    texture: string;
    count: RandomRange;
    lifespan: RandomRange;
    angle: RandomRange;
    velocity: RandomRange;
    scale: RandomRange;
    startAlpha?: number;
    fadeRate: number;
    orientToVelocity: boolean;
    blendMode?: BLEND_MODES;
} & GameObjectOptions;
export declare class ParticleSystem extends GameObject {
    #private;
    constructor(options: ParticleSystemOptions);
    burst({ x, y }: {
        x: number;
        y: number;
    }): Promise<void>;
    protected update(dt: number): void;
    remove(): void;
}
export {};
//# sourceMappingURL=particle.d.ts.map