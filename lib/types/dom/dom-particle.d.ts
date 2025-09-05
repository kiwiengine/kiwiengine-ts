import { BLEND_MODES } from 'pixi.js';
import { DomGameObject, DomGameObjectOptions } from './dom-game-object';
type RandomRange = {
    min: number;
    max: number;
};
export type DomParticleSystemOptions = {
    texture: string;
    count: RandomRange;
    lifespan: RandomRange;
    angle: RandomRange;
    velocity: RandomRange;
    particleScale: RandomRange;
    startAlpha?: number;
    fadeRate: number;
    orientToVelocity: boolean;
    blendMode?: BLEND_MODES;
} & DomGameObjectOptions;
export declare class DomParticleSystem extends DomGameObject {
    #private;
    constructor(options: DomParticleSystemOptions);
    burst({ x, y }: {
        x: number;
        y: number;
    }): Promise<void>;
    protected update(dt: number): void;
    remove(): void;
}
export {};
//# sourceMappingURL=dom-particle.d.ts.map