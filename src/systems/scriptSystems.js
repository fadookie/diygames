import _ from 'lodash';
import { combineLatest } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
/*
Script0: {
  triggers: [
    { type: 'TapTrigger', target:'Self' },
    { type: 'Switch', target:'Self', condition:true }
  ],
  actions: [
    { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: 1, y: 0 } },
    { type: 'Switch', set:false },
  ],
},
*/

const makeScriptSystem = (scriptNumber) => (class ScriptSystem {
  targetGroup = ['ColliderRuntime', scriptNumber];
  entities = [];

  setup(e, { globalEventBus }) {
    // console.log('@@@ScriptSystem.setup', new Error().stack);
    // if (e.isSetupDoneForScriptSystem) return;
    // e.isSetupDoneForScriptSystem = true;
  }

  reactToData(e, { globalEventBus }) {
    const script = e.components[scriptNumber];
    const triggerObservables = script.triggers.map((trigger) => {
      switch(trigger.type) {
        case 'TapTrigger': {
          switch(trigger.target) {
            case 'Any': {
              return globalEventBus
                .pipe(
                  filter(evt => evt.type === 'Tap'),
                )
            } case 'Self': {
              return e.components.ColliderRuntime.onTap;
            } default: {
              throw new Error(`Unrecognized tap target: '${trigger.target}'`);
            }
          }
        } case 'Switch': {
          switch(trigger.target) {
            case 'Self': {
              return e.switchObservable.pipe(
                filter(value => value === trigger.condition)
              );
            } default: {
              throw new Error(`Unrecognized switch target: '${trigger.target}'`);
            }
          }
        } default: {
          throw new Error(`Unrecognized trigger type: ${trigger.type}`);
        }
      }
    })
    // Emit previous and current values for all triggers
    return combineLatest(...triggerObservables)
            .pipe(
              distinctUntilChanged(),
            );
  }

  execute(e, data) {
    console.log('@@@ScriptSystem#exectute e:', e, 'data:', data);
    e.components[scriptNumber].actions.forEach(action => {
      console.log('@@@ScriptSystem#exectute process action:', action);
      switch(action.type) {
        case 'SetComponent': {
          e.addComponent(action.component, action);
          break;
        } case 'Switch': {
          e.switch = action.set;
          return;
        } default: {
          throw new Error(`Unrecognized action type: ${action.type}`);
        }
      }
    });
  }
});

export default _.range(0, 2).map(i => new (makeScriptSystem(`Script${i}`))());
