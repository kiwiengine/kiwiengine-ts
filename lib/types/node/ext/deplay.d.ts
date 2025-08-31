import { GameNode } from '../core/game-node';
export declare class DelayNode extends GameNode {
    #private;
    constructor(delay: number, callback: () => void);
    protected update(dt: number): void;
}
//# sourceMappingURL=deplay.d.ts.map