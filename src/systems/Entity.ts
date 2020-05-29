import _ from 'lodash';
import { BehaviorSubject, asyncScheduler,  } from 'rxjs';
import type { Subscription } from 'rxjs';
import { delay, subscribeOn, debounceTime, distinctUntilChanged } from 'rxjs/operators';

type Component = {
  tags?: string[],
  dispose?: () => void,
}

type Components = {
  [index: string]: Component,
}

type SubscriptionToken = {
  system: Object,
  subscription: Subscription,
}

function makeComponent(componentName : string, componentData : Component) : Component {
  switch(componentName) {
    case 'DirectionalMovement': {
      return { tags: ['movement'], ...componentData };
    } case 'StopMovement': {
      return { tags: ['movement'], ...componentData };
    } default: {
      return componentData;
    }
  }
}

export default class Entity {
  id: string;
  sceneEntity: Object;
  subscriptions : SubscriptionToken[] = []
  _switch = new BehaviorSubject(false);
  _components = new BehaviorSubject<Components>({});

  constructor(entity : { id: string, components: Components }) {
    this.id = entity.id;
    this.sceneEntity = entity;
    this._components.next(_.cloneDeep(entity.components));
  }

  get components() {
    return this._components.value;
  }

  get componentsObservable() {
    return this._components.asObservable()
      .pipe(
        distinctUntilChanged(),
        debounceTime(0),
        subscribeOn(asyncScheduler),
      );
  }

  get componentTypes() {
    return Object.keys(this.components);
  }

  get switchObservable() {
    // Need to defer this event so we don't get stuck in infinite recursion
    return this._switch.asObservable().pipe(
      distinctUntilChanged(),
      delay(0),
      subscribeOn(asyncScheduler),
    );
  }

  get switch() {
    return this._switch.value;
  }

  set switch(value) {
    this._switch.next(value);
  }

  addComponent(componentName : string, componentData : Component) {
    // Only one component per type is allowed - dispose the old one first.
    this.disposeComponent(componentName);
    const newComponent = makeComponent(componentName, componentData);
    _.chain(this.components)
      // .pickBy(other => _.intersection(other.tags, newComponent.tags).length > 0)
      // .tap(x => console.log('XXX Chain START:', x))
      .pickBy((other : Component) => {
        const intersection = _.intersection(other.tags || [], newComponent.tags || []);
        // console.log('other:', other, 'compData:', newComponent.tags, 'intersection: ', intersection);
        return intersection.length > 0;
      })
      // .tap(x => console.log('XXX intersected:', x, 'allComp:', this.components))
      .forEach((__, otherName) => { 
        // console.log('XXX disposeComp:',otherName, 'tags:', __.tags);
        this.removeComponent(otherName);
      })
      .value();
    this._components.next({ ...this.components, [componentName]: newComponent });
    console.log('XXX makeComponent', newComponent);
  }

  removeComponent(componentName : string) {
    this.disposeComponent(componentName);
    this._components.next(_.omit(this.components, [componentName]));
  }

  disposeComponent(componentName : string) {
    const oldComponent = this.components[componentName];
    if (oldComponent && oldComponent.dispose) {
      oldComponent.dispose();
    }
    delete this.components[componentName];
  }

  dispose() {
    Object.keys(this.components).forEach(this.disposeComponent.bind(this));
    this._components.complete();
    this._switch.complete();
    this.subscriptions.forEach(s => s.subscription.unsubscribe());
    this.subscriptions = [];
  }
}