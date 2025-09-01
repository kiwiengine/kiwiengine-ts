export declare enum ColliderType {
    Rectangle = 0,
    Circle = 1,
    Ellipse = 2,
    Polygon = 3
}
export type Point = {
    x: number;
    y: number;
};
export type RectangleCollider = {
    type: ColliderType.Rectangle;
    width: number;
    height: number;
} & Point;
export type CircleCollider = {
    type: ColliderType.Circle;
    radius: number;
} & Point;
export type EllipseCollider = {
    type: ColliderType.Ellipse;
    width: number;
    height: number;
} & Point;
export type PolygonCollider = {
    type: ColliderType.Polygon;
    vertices: Point[];
} & Point;
export type Collider = RectangleCollider | CircleCollider | EllipseCollider | PolygonCollider;
//# sourceMappingURL=colliders.d.ts.map