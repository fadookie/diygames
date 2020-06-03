import type { ExecutableSystem, ComponentTypeString } from './types';
import type Entity from './Entity';

export default class DirectionalMovementSystem implements ExecutableSystem {
  tag = 'DirectionalMovementSystem';
  targetGroup : ComponentTypeString[] = ['Transform', 'DirectionalMovement'];
  entities = [];

  execute(e : Entity) {
    const transform = e.componentByType('Transform');
    const movement = e.componentByType('DirectionalMovement');
    transform.pos.x += movement.velocity.x;
    transform.pos.y += movement.velocity.y;
  }
}