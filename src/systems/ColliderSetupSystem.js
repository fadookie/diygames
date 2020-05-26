import { Subject } from 'rxjs';

export default class ColliderSetupSystem {
  targetGroup = ['Transform', 'Collider'];
  entities = [];  

  setup(e, context) {
    if (e.components.ColliderRuntime) return;
    e.addComponent('ColliderRuntime', {
      onTap: new Subject(),
    });
  }
}
