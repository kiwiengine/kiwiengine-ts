import Matter from 'matter-js';
export declare class WorldDebug {
    #private;
    constructor(container: HTMLElement);
    update(): void;
    createMatterDebugRenderer(engine: Matter.Engine, width: number, height: number): void;
    setMatterDebugRendererSize(rect: DOMRectReadOnly, width: number, height: number, cameraX: number, cameraY: number): void;
    setMatterDebugRendererCamera(cameraX: number, cameraY: number): void;
    destroy(): void;
}
//# sourceMappingURL=world-debug.d.ts.map