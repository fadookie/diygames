/**
 * Checks if a point intersects an axis-aligned bounding box
 */
export function pointIntersectsAABB(point, aabb) {
  return (
    point.x > aabb.pos.x - aabb.size.w &&
    point.x < aabb.pos.x + aabb.size.w &&
    point.y > aabb.pos.y - aabb.size.h &&
    point.y < aabb.pos.y + aabb.size.h
  );
}