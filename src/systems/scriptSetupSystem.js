import { Subject, filter } from 'rxjs';
/*
Scripts: [
  {
    triggers: [
      { type: 'TapTrigger', target:'Anywhere' }
    ],
    actions: [
      { type: 'DirectionalMovement', velocity: { x: 1, y: 0 }}
    ],
  },
],
*/
function scriptSetupSystem(entities) {
  entities.forEach((e) => {
    const scripts = e.components.Scripts;
    scripts.eventBus = new Subject();
    scripts.triggers.map((trigger) => {
      switch(trigger.type) {
        case 'TapTrigger':
          scripts.eventBus.filter(evt => evt.type === 'Tap').subscribe(evt => {
            scripts.actions.forEach(action => {
              e.addComponent(action.type, action);
            });
          });
          break;
        default:
          throw new Error(`Unrecognized trigger type: ${trigger.type}`);
          
      }
    });
    // const movement = e.components.DirectionalMovement;
    // transform.pos.x += movement.velocity.x;
    // transform.pos.y += movement.velocity.y;
  });
}

scriptSetupSystem.targetGroup = ['Script'];
scriptSetupSystem.entities = [];

export default scriptSetupSystem;