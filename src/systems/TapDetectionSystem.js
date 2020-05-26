import { filter, map } from 'rxjs/operators';
import { pointIntersectsAABB } from '../utils/collision';

export default class TapDetectionSystem {
  targetGroup = ['Transform', 'Collider', 'ColliderRuntime'];
  entities = [];  

  reactToData(e, { globalEventBus }) {
    const collider = e.components.Collider;
    if (collider.type !== 'AABB') throw new Error(`Unrecognized collision type '${collider.type}'`);
    return globalEventBus
      .pipe(
        filter(evt => evt.type === 'Tap'
          && pointIntersectsAABB(evt.data.mousePos, e.components.Transform)
        )
      )
  }

  execute(e, data) {
    console.log('@@@TapDetectionSystem#exectute e:', e, 'data:', data);
    e.components.ColliderRuntime.onTap.next(data);
  }
}
