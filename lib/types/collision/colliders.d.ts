declare enum ColliderType {
    Rectangle = 0,
    Circle = 1,
    Ellipse = 2,
    Polygon = 3
}
type Position = {
    x: number;
    y: number;
};
type RectangleCollider = {
    type: ColliderType.Rectangle;
    width: number;
    height: number;
} & Position;
//# sourceMappingURL=colliders.d.ts.map