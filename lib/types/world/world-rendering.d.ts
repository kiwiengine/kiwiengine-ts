import { Container, EventEmitter } from "pixi.js";
import { GameObject } from '../game-object/game-object';
export declare class WorldRendering extends EventEmitter<{
    positionChanged: () => void;
}> {
    #private;
    centerX: number;
    centerY: number;
    renderWidth: number;
    renderHeight: number;
    renderScale: number;
    canvasLeft: number;
    canvasTop: number;
    get backgroundColor(): number;
    set backgroundColor(v: number);
    get backgroundAlpha(): number;
    set backgroundAlpha(v: number);
    init(container: HTMLElement, width: number | undefined, height: number | undefined): Promise<void>;
    addLayer(name: string, drawOrder: number): void;
    changeLayerDrawOrder(name: string, drawOrder: number): void;
    removeLayer(name: string): void;
    addToLayer(child: GameObject, layer: string): void;
    setRendererSize(rect: DOMRect, width: number, height: number): void;
    update(): void;
    get cameraX(): number;
    set cameraX(value: number);
    get cameraY(): number;
    set cameraY(value: number);
    addPixiChildToRoot(child: Container): void;
    destroy(): void;
    setBackgroundImage(image: string | undefined): void;
}
//# sourceMappingURL=world-rendering.d.ts.map