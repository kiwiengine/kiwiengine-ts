import { EventEmitter } from '@webtaku/event-emitter';
export declare class RendererContainerManager extends EventEmitter<{
    resize: (width: number, height: number) => void;
}> {
    #private;
    constructor(container: HTMLElement);
    remove(): void;
}
//# sourceMappingURL=container-manager.d.ts.map