function directionalMovementSystem(entities) {
  entities.forEach((e) => {
    const transform = e.runtimeComponents.Transform;
    const movement = e.components.DirectionalMovement;
    transform.pos.x += movement.velocity.x;
    transform.pos.y += movement.velocity.y;
  });
}

directionalMovementSystem.targetGroup = ['Transform', 'DirectionalMovement'];
directionalMovementSystem.entities = [];

export default directionalMovementSystem;