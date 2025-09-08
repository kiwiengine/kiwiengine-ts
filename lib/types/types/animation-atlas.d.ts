export type AnimationAtlas = {
    frames: Record<string, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>;
    animations: Record<string, {
        frames: string[];
        fps: number;
        loop?: boolean;
    }>;
};
//# sourceMappingURL=animation-atlas.d.ts.map