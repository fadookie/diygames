import { filter } from 'rxjs/operators';
import { pointIntersectsAABB } from '../utils/collision';

export default class ColliderSetupSystem {
  targetGroup = ['Transform', 'Collider'];
  entities = [];  

  setup(e, { globalEventBus }) {
    if (e.components.ColliderRuntime) return;

    const collider = e.components.Collider;
    if (collider.type !== 'AABB') throw new Error(`Unrecognized collision type '${collider.type}'`);

    e.addComponent('ColliderRuntime', {
      onTap: globalEventBus
        .pipe(
          filter(evt => evt.type === 'Tap'
            && pointIntersectsAABB(evt.data.mousePos, e.components.Transform)
          )
        ),
    });
  }
}
