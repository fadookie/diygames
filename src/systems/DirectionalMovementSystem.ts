import type Entity from './Entity';

export default class DirectionalMovementSystem {
  tag = 'DirectionalMovementSystem';
  targetGroup = ['Transform', 'DirectionalMovement'];
  entities = [];

  execute(e : Entity) {
    const transform = e.componentByType('Transform');
    const movement = e.componentByType('DirectionalMovement');
    transform.pos.x += movement.velocity.x;
    transform.pos.y += movement.velocity.y;
  }
}