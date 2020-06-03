import _ from 'lodash';
import type p5 from 'p5';
import { Subject, asyncScheduler } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import Entity from './Entity';
import RenderSystem from './RenderSystem';
import DirectionalMovementSystem from './DirectionalMovementSystem';
import scriptSystems from './scriptSystems';
import ColliderSetupSystem from './ColliderSetupSystem';
import { System, ExecutableSystem, SetupSystem, ReactToDataSystem, Scene, GlobalEventBus, SubscriptionToken } from './types';

export default class EcsManager {
  setupSystems : SetupSystem[] = [
    new ColliderSetupSystem(),
  ]

  reactiveSystems : ReactToDataSystem<any>[] = [
    ...scriptSystems,
  ]

  updateSystems : ExecutableSystem[] = [
    new DirectionalMovementSystem(),
  ]

  drawSystems : ExecutableSystem[] = [
    new RenderSystem(),
  ]

  playing = false

  get systems() : System[] {
    return _.uniq([...this.setupSystems,  ...this.reactiveSystems, ...this.updateSystems, ...this.drawSystems]);
  }

  p5 : p5;
  globalEventBus : GlobalEventBus;
  scene : Scene;
  runtimeEntities : Entity[] = [];
  updateSubject = new Subject<void>();

  get context() {
    return { p5: this.p5, globalEventBus: this.globalEventBus, entities: this.runtimeEntities };
  }

  constructor(p5 : p5, globalEventBus : GlobalEventBus, scene : Scene) {
    this.p5 = p5;
    this.globalEventBus = globalEventBus;
    this.scene = scene;
    this.updateSubject.pipe(
      subscribeOn(asyncScheduler),
    ).subscribe(this.onUpdateTick.bind(this));
    console.log('EcsManager#constructor systems: ', this.systems);
    this.onSceneChanged(scene);
  }

  onComponentsChanged(entity : Entity) {
    this.onTargetGroupsChanged();
  }

  onPlayingChanged(playing : boolean) {
    const prevPlaying = this.playing;
    this.playing = playing;
    if (prevPlaying !== playing) {
      this.onSceneChanged(this.scene);
    }
  }

  onSceneChanged(scene : Scene) {
    this.scene = scene;
    // Re-create runtime entity instances
    // Easy to get caught in infinite recursion here so debounce any group re-creation until the next frame
    this.runtimeEntities.forEach(e => e.dispose());
    this.runtimeEntities = scene.entities.map(e => new Entity(e));
    this.runtimeEntities.forEach(e => e.componentsObservable.subscribe(this.onComponentsChanged.bind(this)));
    
    this.onTargetGroupsChanged();
  }

  onTargetGroupsChanged() {
    // Update system's entity list based on components required by targetGroup filter
    // console.log('onTargetGroupsChanged stack:', new Error().stack);
    this.systems.forEach(system => {
      console.log('@@@onSceneChanged filter for ', system.tag);
      system.entities = this.runtimeEntities.filter(entity => {
        const diff = _.difference(
          system.targetGroup,
          entity.componentTypes
        )
        const predicate = diff.length === 0;
        // console.log('@@@ diff:', diff, 'target:', system.targetGroup, 'components:', Object.keys(entity.components), 'predicate:', predicate);
        return predicate;
      });
    });

    // Invoke setup systems
    for(let system of this.setupSystems) {
        for (let e of system.entities) {
          system.setup(e, this.context);
        }
    }

    // Refresh subscriptions for reactToData systems
    for(let system of this.reactiveSystems) {
      console.log('@@@ refresh subs. playing:', this.playing, 'system:', system.tag, 'reactToData:', system.reactToData);
      if (this.playing) {
        console.log('Refresh subscriptions for ', system.constructor.name, system.tag);
        const systemSubscriptionPredicate = (systemSubscription : SubscriptionToken) => systemSubscription.system === system;
        for (let e of system.entities) {
          e.subscriptions
            .filter(systemSubscriptionPredicate)
            .forEach(systemSubscription => {
              systemSubscription.subscription.unsubscribe();
            });
          _.remove(e.subscriptions, systemSubscriptionPredicate);
          const observable = system.reactToData(e, this.context);
          // console.log('reactToData setup e:', e, 'observable:', observable);
          const subscription = observable.subscribe(x => { system.execute(e, this.context, x); })
          e.subscriptions.push({ system, subscription });
        }
        console.log('reactToData setup done for', system.constructor.name, ', ents:', system.entities);
      }
    }
  }

  onUpdate() {
    if (!this.playing) return;
    this.updateSubject.next();
  }

  onUpdateTick() {
    this.updateSystems.forEach(system => {
      system.entities.forEach(e => {
        system.execute(e, this.context);
      });
    });
  }

  onDraw() {
    this.drawSystems.forEach(system => {
      system.entities.forEach(e => {
        system.execute(e, this.context);
      });
    });
  }
}