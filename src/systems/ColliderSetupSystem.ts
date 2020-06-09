import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { pointIntersectsAABB } from '../utils/collision';
import type { ComponentTypeString, Rect2D } from '../types';
import type { SetupSystem, Context } from './types';
import type Entity from './Entity';

export default class ColliderSetupSystem implements SetupSystem {
  tag = 'ColliderSetupSystem';
  targetGroup : ComponentTypeString[] = ['Transform', 'Collider'];
  entities = [];  

  setup(e : Entity, { globalEventBus } : Context) {
    if (e.components.ColliderRuntime) return;

    const collider = e.componentByType('Collider');
    if (collider.colliderType !== 'AABB') throw new Error(`Unrecognized collision type '${collider.type}'`);

    const onDispose = new Subject();
    e.addComponent({
      type: 'ColliderRuntime',
      onTap: globalEventBus
        .pipe(
          filter(evt => evt.type === 'Tap'
            && pointIntersectsAABB(evt.data.mousePos, e.components.Transform as Rect2D)
          ),
          takeUntil(onDispose),
        ),
      dispose: onDispose.next.bind(onDispose),
    });
  }
}
