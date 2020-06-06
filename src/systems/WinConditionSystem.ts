import { map, filter, withLatestFrom } from 'rxjs/operators';
import type { WinCondition, ReactToDataSystem, ComponentTypeString, Context } from './types';
import type Entity from './Entity';

export default class WinConditionSystem implements ReactToDataSystem<boolean> {
  tag = 'WinConditionSystem';
  targetGroup : ComponentTypeString[] = ['WinCondition'];
  entities = [];
  reactToData(e : Entity, { globalEventBus } : Context) {
    const winCondition : WinCondition = e.componentByType('WinCondition');
    return globalEventBus.pipe(
      filter(evt => !!(evt.type === 'TimeSegment' && evt.special && evt.special === 'End')),
      withLatestFrom(e.switchObservable), 
      map(([_, switchState]) => switchState),
      filter(switchState => switchState === winCondition.expectedSwitchState),
    );
  }
  execute(e : Entity, context: Context, data : boolean) {
    console.log('!!!! GAME WON !!!!', e, data);
  }
}