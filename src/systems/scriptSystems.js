import _ from 'lodash';
import { combineLatest } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { reject, every, flow, isNull, identity } from 'lodash/fp';
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

  parseTriggers(e, { globalEventBus }) {
    const triggers = e.components[scriptNumber].triggers;
    return triggers.map((trigger) => {
          switch(trigger.type) {
            case 'TapTrigger': {
              switch(trigger.target) {
                case 'Any': {
                  return globalEventBus
                    .pipe(
                      filter(evt => evt.type === 'Tap'),
                    )
                } case 'Self': {
                  return e.components.ColliderRuntime.onTap.pipe(
                    map(() => null)
                  );
                } default: {
                  throw new Error(`Unrecognized tap target: '${trigger.target}'`);
                }
              }
            } default: {
              throw new Error(`Unrecognized trigger type: ${trigger.type}`);
            }
          }
        });
  }

  parseConditions(e, { entities }) {
    const conditions = e.components[scriptNumber].conditions;
    return conditions.map((condition) => {
      const conditionMet = map(value => value === condition.condition);
      switch(condition.type) {
        case 'Switch': {
          switch(condition.target) {
            case 'Self': {
              return e.switchObservable.pipe(
                conditionMet,
              );
            } default: {
              const other = entities.find(other => other.id === condition.target);
              if (!other) throw new Error(`Unrecognized switch condition: '${condition.target}'`);
              return other.switchObservable.pipe(
                conditionMet,
              );
            }
          }
        } default: {
          throw new Error(`Unrecognized condition type: ${condition.type}`);
        }
      }
    });
  }

  reactToData(e, context) {
    const triggerObservables = this.parseTriggers(e, context);
    const conditionObservables = this.parseConditions(e, context);
    // Emit only when all boolean triggers are true
    return combineLatest(...triggerObservables)
            .pipe(
              withLatestFrom(...conditionObservables),
              filter(
                  flow(
                    reject(isNull),
                    every(identity),
                  )
              ),
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
