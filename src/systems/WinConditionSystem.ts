import _ from 'lodash';
import { map, filter } from 'rxjs/operators';
import type { ReactToGroupDataSystem, ComponentTypeString, Context } from './types';
import type Entity from './Entity';

export default class WinConditionSystem implements ReactToGroupDataSystem<boolean> {
  tag = 'WinConditionSystem';
  targetGroup : ComponentTypeString[] = ['WinCondition'];
  entities = [];
  reactToGroupData(ents : Entity[], { globalEventBus } : Context) {
    return globalEventBus.pipe(
      filter(evt => !!(evt.type === 'TimeSegment' && evt.special && evt.special === 'End')),
      map((_) => (
        ents.map(e => (
          e.switch === e.componentByType('WinCondition').expectedSwitchState
        ))
        .every(x => x)
      )),
    );
  }
  execute(ents : Entity[], context: Context, gameWon : boolean) {
    if (gameWon) {
      alert('You win!');
    } else {
      alert('You lose!');
    }
  }
}