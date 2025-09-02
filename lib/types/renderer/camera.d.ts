import { EventEmitter } from '@webtaku/event-emitter';
export declare class Camera extends EventEmitter<{
    positionChanged: () => void;
    scaleChanged: () => void;
}> {
    #private;
    get x(): number;
    get y(): number;
    get scale(): number;
    setPosition(x: number, y: number): void;
    setScale(scale: number): void;
}
//# sourceMappingURL=camera.d.ts.map