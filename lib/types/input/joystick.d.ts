import { GameObject } from '../node/core/game-object';
import { Renderer } from '../renderer/renderer';
export type JoystickOptions = {
    onMove: (radian: number, strength: number) => void;
    onRelease: () => void;
    onKeyDown?: (code: string) => void;
    joystickImage?: HTMLElement;
    knobImage?: HTMLElement;
    maxKnobDistance?: number;
    moveThreshold?: number;
    idlePosition?: {
        left: number;
        top: number;
    };
};
export declare class Joystick extends GameObject {
    #private;
    constructor(options: JoystickOptions);
    protected set renderer(renderer: Renderer | undefined);
    protected get renderer(): Renderer | undefined;
    pause(): void;
    setIdlePosition(p: {
        left: number;
        top: number;
    }): void;
    remove(): void;
}
//# sourceMappingURL=joystick.d.ts.map