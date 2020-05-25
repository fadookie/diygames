// import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
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
export default class ScriptSystem {
  targetGroup = ['Scripts'];
  entities = [];

  setup(entities, { globalEventBus }) {
    console.log('@@@ScriptSystem.setup', new Error().stack);
    entities.forEach((e) => {
      if (e.isSetupDoneForScriptSystem) return;
      e.isSetupDoneForScriptSystem = true;
      const scripts = e.components.Scripts;
      // scripts.eventBus = new Subject();
      scripts.forEach(script => {
          script.triggers.forEach((trigger) => {
          switch(trigger.type) {
            case 'TapTrigger': {
              console.assert(trigger.target === 'Anywhere', 'Unrecognized tap target');
              const subscription = globalEventBus
                .pipe(filter(evt => evt.type === 'Tap'))
                .subscribe(evt => {
                  console.log('@@@Entity.Tap', evt);
                  script.actions.forEach(action => {
                    e.addComponent(action.type, action);
                  });
                });
              e.subscriptions.push(subscription);
              break;
            } default: {
              throw new Error(`Unrecognized trigger type: ${trigger.type}`);
            }
              
          }
        });
      });
    });
  }
}
