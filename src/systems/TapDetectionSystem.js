import { filter, map } from 'rxjs/operators';
import { pointIntersectsAABB } from '../utils/collision';
import { Subject } from 'rxjs';

export default class ScriptSystem {
  targetGroup = ['Transform', 'Collision'];
  entities = [];  

  setup(e, { globalEventBus }) {
    // Getting into a recursion loop here if we don't memoize the setup
    if (e.isSetupDoneForTapDetectionSystem) return;
    e.isSetupDoneForTapDetectionSystem = true;
    e.components.Collision.onTap = new Subject();
  }

  reactToData(e, { globalEventBus }) {
    const collision = e.components.Collision;
    if (collision.type !== 'AABB') throw new Error(`Unrecognized collision type '${collision.type}'`);
    return globalEventBus
      .pipe(
        filter(evt => evt.type === 'Tap'),
        map(evt => pointIntersectsAABB(evt.data.mousePos, e.components.Transform))
      )
  }

  execute(e, data) {
    console.log('@@@TapDetectionSystem#exectute e:', e, 'data:', data);
    e.components.Collision.onTap.next(data);
  }
}
