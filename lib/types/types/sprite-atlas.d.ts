export type AnimationAtlas = {
    frames: Record<string, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>;
    animations: Record<string, {
        frames: string[];
        loop?: boolean;
    }>;
};
//# sourceMappingURL=sprite-atlas.d.ts.map