function scriptSystem(entities) {
  entities.forEach((e) => {
    // const transform = e.components.Transform;
    // const movement = e.components.DirectionalMovement;
    // transform.pos.x += movement.velocity.x;
    // transform.pos.y += movement.velocity.y;
  });
}

scriptSystem.targetGroup = ['Script'];
scriptSystem.entities = [];

export default scriptSystem;