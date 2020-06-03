import _ from 'lodash';
import { merge } from 'rxjs';
import { filter, map, skip, withLatestFrom } from 'rxjs/operators';
import { every, flow, identity } from 'lodash/fp';
import type { Context } from './types';
import Entity from './Entity';
import { assertNever } from '../utils/tsutils';
/*
Script0: {
  triggers: [
    { type: 'TapTrigger', target:'Self' },
    { type: 'Switch', target:'Self', condition:true }
  ],
  conditions: [
      { type: 'Switch', target:'Self', condition:false },
  ]
  actions: [
    { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: 1, y: 0 } },
    { type: 'Switch', set:false },
  ],
},
*/

type ScriptName = 'Script0' | 'Script1' | 'Script2' | 'Script3' ;

function isEntity(x : any): x is boolean {
  return !!(x as Entity);
}

const makeScriptSystem = (scriptNumber : ScriptName) => (class ScriptSystem {
  tag = `${scriptNumber}System`;
  targetGroup = ['ColliderRuntime', scriptNumber];
  entities = [];

  //#region  helpers

  assert(condition : boolean, message : string, e : Entity) : asserts condition {
    if (!condition) throw this.getError(message, e);
  }

  getError(message : string, e : Entity) {
    return new Error(`${message} (in entity ${e.id} ${scriptNumber})`);
  }

  findTarget(e : Entity, target : string, { entities } : Context) : Entity {
    if (target === 'Self') return e;
    const other = entities.find(other => other.id === target);
    this.assert(isEntity(other), `Unrecognized switch target: '${target}'`, e);
    return other;
  }

  parseTriggers(e : Entity, context : Context) {
    const { globalEventBus } = context;
    const triggers = e.componentByType(scriptNumber).triggers;
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
                  return e.componentByType('ColliderRuntime').onTap;
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
              assertNever(trigger);
              // throw this.getError(`Unrecognized trigger type: ${trigger.type}`, e);
              throw this.getError(`Unrecognized trigger on: ${trigger}`, e); // This will never get hit but appeases compiler
            }
          }
        });
  }

  parseConditions(e : Entity, context : Context) {
    const conditions = e.componentByType(scriptNumber).conditions || [];
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

  //#endregion

  reactToData(e : Entity, context : Context) {
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

  execute(e : Entity, data : any) {
    console.log(`@@@${scriptNumber}System#exectute e:`, e, 'data:', data);
    const script = e.componentByType(scriptNumber);
    script.actions.forEach(action => {
      console.log(`@@@${scriptNumber}#exectute process action:`, action);
      switch(action.type) {
        case 'SetComponent': {
          e.addComponent(action.component);
          break;
        } case 'Switch': {
          e.switch = action.set;
          return;
        } default: {
          assertNever(action);
          // throw this.getError(`Unrecognized action type: ${action.type}`, e);
        }
      }
    });
  }
});

export default [
  new (makeScriptSystem('Script0'))(),
  new (makeScriptSystem('Script1'))(),
  new (makeScriptSystem('Script2'))(),
  new (makeScriptSystem('Script3'))(),
];
