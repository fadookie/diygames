import type { TransformProperty, DirectionalMovementProperty } from './types';
import type Entity from './Entity';

export default class DirectionalMovementSystem {
  targetGroup = ['Transform', 'DirectionalMovement'];
  entities = [];

  execute(e : Entity<TransformProperty & DirectionalMovementProperty>) {
    const transform = e.components.Transform;
    const movement = e.components.DirectionalMovement;
    transform.pos.x += movement.velocity.x;
    transform.pos.y += movement.velocity.y;
  }
}