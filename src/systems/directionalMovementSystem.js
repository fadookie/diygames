export default class DirectionalMovementSystem {
  targetGroup = ['Transform', 'DirectionalMovement'];
  entities = [];

  execute(entities) {
    entities.forEach((e) => {
      const transform = e.components.Transform;
      const movement = e.components.DirectionalMovement;
      transform.pos.x += movement.velocity.x;
      transform.pos.y += movement.velocity.y;
    });
  }
}