// import { Subject } from 'rxjs';
import { merge, empty } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
  targetGroup = ['Collision', 'Scripts'];
  entities = [];

  setup(e, { globalEventBus }) {
    // console.log('@@@ScriptSystem.setup', new Error().stack);
    // if (e.isSetupDoneForScriptSystem) return;
    // e.isSetupDoneForScriptSystem = true;
  }

  reactToData(e, { globalEventBus }) {
    const scripts = e.components.Scripts;
    const observables = scripts.map(script => {
      const triggerObservables = script.triggers.map((trigger) => {
        switch(trigger.type) {
          case 'TapTrigger': {
            switch(trigger.target) {
              case 'Anywhere': {
                return globalEventBus
                  .pipe(
                    filter(evt => evt.type === 'Tap'),
                    map(evt => ({ ...evt, script, trigger })),
                  )
              } case 'Self': {
                if (!e.components.Collision.onTap) {
                  console.warn('no onTap');
                  return empty();
                }
                return e.components.Collision.onTap.pipe(
                  map(evt => ({ ...evt, script, trigger })),
                );
              } default: {
                throw new Error(`Unrecognized tap target: '${trigger.target}'`);
              }
            }
          } default: {
            throw new Error(`Unrecognized trigger type: ${trigger.type}`);
          }
        }
      })
      return merge(...triggerObservables);
    });
    return merge(...observables);
  }

  execute(e, data) {
    console.log('@@@ScriptSystem#exectute e:', e, 'data:', data);
    data.script.actions.forEach(action => {
      e.addComponent(action.type, action);
    });
  }
}
