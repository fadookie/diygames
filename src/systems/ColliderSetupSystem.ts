import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { pointIntersectsAABB } from '../utils/collision';
import type { Context, ColliderProperty, ColliderRuntimeProperty } from './types';
import type Entity from './Entity';

export default class ColliderSetupSystem {
  targetGroup = ['Transform', 'Collider'];
  entities = [];  

  setup(e : Entity<ColliderProperty & Partial<ColliderRuntimeProperty>>, { globalEventBus } : Context) {
    if (e.components.ColliderRuntime) return;

    const collider = e.components.Collider;
    if (collider.type !== 'AABB') throw new Error(`Unrecognized collision type '${collider.type}'`);

    const onDispose = new Subject();
    e.addComponent('ColliderRuntime', {
      onTap: globalEventBus
        .pipe(
          filter(evt => evt.type === 'Tap'
            && pointIntersectsAABB(evt.data.mousePos, e.components.Transform)
          ),
          takeUntil(onDispose),
        ),
      dispose: onDispose.next.bind(onDispose),
    });
  }
}
