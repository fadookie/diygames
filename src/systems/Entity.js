import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export default class Entity {
  subscriptions = []
  _switch = new BehaviorSubject(false);

  constructor(onComponentsChanged, entity) {
    this.id = entity.id;
    this.components = _.cloneDeep(entity.components);
    this.sceneEntity = entity;
    this.onComponentsChanged = onComponentsChanged;
  }

  get componentTypes() {
    return Object.keys(this.components);
  }

  get switchObservable() {
    // Need to defer this event so we don't get stuck in infinite recursion
    return this._switch.asObservable().pipe(delay(0));
  }

  get switch() {
    return this._switch.value;
  }

  set switch(value) {
    this._switch.next(value);
  }

  addComponent(componentName, component) {
    this.components[componentName] = component;
    this.onComponentsChanged(this);
  }

  removeComponent(componentName) {
    delete this.components[componentName];
    this.onComponentsChanged(this);
  }

  dispose() {
    this.subscriptions.forEach(s => s.subscription.unsubscribe());
    this.subscriptions = [];
  }
}