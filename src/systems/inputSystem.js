export default class InputSystem {
  targetGroup = [];
  entities = [];

  execute(entities, { p5, globalEventBus }) {
    entities.forEach((e) => {
      // const transform = e.components.Transform;
      // const movement = e.components.DirectionalMovement;
      // transform.pos.x += movement.velocity.x;
      // transform.pos.y += movement.velocity.y;
    });
  }
}