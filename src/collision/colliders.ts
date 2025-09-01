export enum ColliderType {
  Rectangle,
  Circle,
  Ellipse,
  Polygon,
}

export type Point = { x: number, y: number }

export type RectangleCollider = { type: ColliderType.Rectangle, width: number, height: number } & Point
export type CircleCollider = { type: ColliderType.Circle, radius: number } & Point
export type EllipseCollider = { type: ColliderType.Ellipse, width: number, height: number } & Point
export type PolygonCollider = { type: ColliderType.Polygon, vertices: Point[] } & Point

export type Collider =
  | RectangleCollider
  | CircleCollider
  | EllipseCollider
  | PolygonCollider