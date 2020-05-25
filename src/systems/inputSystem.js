function inputSystem(entities, { p5, globalEventBus }) {
  entities.forEach((e) => {
    // const transform = e.components.Transform;
    // const movement = e.components.DirectionalMovement;
    // transform.pos.x += movement.velocity.x;
    // transform.pos.y += movement.velocity.y;
  });
}

inputSystem.targetGroup = [];
inputSystem.entities = [];

export default inputSystem;