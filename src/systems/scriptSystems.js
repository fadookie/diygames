import _ from 'lodash';
import { merge } from 'rxjs';
import { filter, map, skip, withLatestFrom } from 'rxjs/operators';
import { every, flow, identity } from 'lodash/fp';
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
  tag = `${scriptNumber}System`;
  targetGroup = ['ColliderRuntime', scriptNumber];
  entities = [];

  setup(e, { globalEventBus }) {
    // console.log('@@@ScriptSystem.setup', new Error().stack);
    // if (e.isSetupDoneForScriptSystem) return;
    // e.isSetupDoneForScriptSystem = true;
  }

  assert(condition, message, e) {
    if (!condition) throw this.getError(message, e);
  }

  getError(message, e) {
    return new Error(`${message} (in entity ${e.id} ${scriptNumber})`);
  }

  findTarget(e, target, { entities}) {
    if (target === 'Self') return e;
    const other = entities.find(other => other.id === target);
    this.assert(other, `Unrecognized switch target: '${target}'`, e);
    return other;
  }

  parseTriggers(e, context) {
    const { globalEventBus } = context;
    const triggers = e.components[scriptNumber].triggers;
    return triggers.map((trigger, triggerIndex) => {
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
                  throw this.getError(`Unrecognized tap target: '${trigger.target}'`, e);
                }
              }
            } case 'Switch': {
              return this.findTarget(e, trigger.target, context).switchObservable.pipe(
                skip(1), // BehaviorSubject emits current value on subscribe, but we don't want this in case we're re-subscribing
                filter(value => value === trigger.changingTo),
                map(evt => ({ evt, triggerIndex, traceId: _.uniqueId() })),
              );
            } default: {
              throw this.getError(`Unrecognized trigger type: ${trigger.type}`, e);
            }
          }
        });
  }

  parseConditions(e, context) {
    const conditions = e.components[scriptNumber].conditions || [];
    return conditions.map((condition) => {
      switch(condition.type) {
        case 'Switch': {
          return this.findTarget(e, condition.target, context).switchObservable.pipe(
            map(value => value === condition.condition),
          );
        } default: {
          throw this.getError(`Unrecognized condition type: ${condition.type}`, e);
        }
      }
    });
  }

  reactToData(e, context) {
    const triggerObservables = this.parseTriggers(e, context);
    const conditionObservables = this.parseConditions(e, context);
    // Emit only when a trigger fires and all boolean conditions are true
    return merge(...triggerObservables)
            .pipe(
              withLatestFrom(...conditionObservables, (trigger, ...conditions) => ({ trigger, conditions })),
              filter(
                  flow(
                    evt => evt.conditions,
                    every(identity),
                  ),
              ),
            );
  }

  execute(e, data) {
    console.log(`@@@${scriptNumber}System#exectute e:`, e, 'data:', data);
    e.components[scriptNumber].actions.forEach(action => {
      console.log(`@@@${scriptNumber}#exectute process action:`, action);
      switch(action.type) {
        case 'SetComponent': {
          e.addComponent(action.component, action);
          break;
        } case 'Switch': {
          e.switch = action.set;
          return;
        } default: {
          throw this.getError(`Unrecognized action type: ${action.type}`, e);
        }
      }
    });
  }
});

export default _.range(0, 6).map(i => new (makeScriptSystem(`Script${i}`))());
