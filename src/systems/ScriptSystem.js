// import { Subject } from 'rxjs';
import { combineLatest } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
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
  targetGroup = ['ColliderRuntime', 'Script0'];
  entities = [];

  setup(e, { globalEventBus }) {
    // console.log('@@@ScriptSystem.setup', new Error().stack);
    // if (e.isSetupDoneForScriptSystem) return;
    // e.isSetupDoneForScriptSystem = true;
  }

  reactToData(e, { globalEventBus }) {
    const script = e.components.Script0;
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
    e.components.Script0.actions.forEach(action => {
      e.addComponent(action.type, action);
    });
  }
}
