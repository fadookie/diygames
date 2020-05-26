import _ from 'lodash';
import RenderSystem from './RenderSystem';
import DirectionalMovementSystem from './DirectionalMovementSystem';
import ScriptSystem from './ScriptSystem';
import InputSystem from './InputSystem';
import TapDetectionSystem from './TapDetectionSystem';
import ColliderSetupSystem from './ColliderSetupSystem';

export default class EcsManager {
  setupOnlySystems = [
    new ColliderSetupSystem(),
  ]

  reactiveSystems = [
    new InputSystem(),
    new ScriptSystem(),
    new TapDetectionSystem(),
  ]

  updateSystems = [
    new DirectionalMovementSystem(),
  ]

  drawSystems = [
    new RenderSystem(),
  ]

  get systems() {
    return _.uniq([...this.setupOnlySystems,  ...this.reactiveSystems, ...this.updateSystems, ...this.drawSystems]);
  }

  runtimeEntities = [];
  globalEventBus = null;

  get context() {
    return { p5: this.p5, globalEventBus: this.globalEventBus };
  }

  constructor(p5, globalEventBus) {
    this.p5 = p5;
    this.globalEventBus = globalEventBus;
  }

  onComponentsChanged(entity) {
    this.onTargetGroupsChanged();
  }

  onSceneChanged(scene) {
    // Re-create runtime entity instances
    // Easy to get caught in infinite recursion here so debounce any group re-creation until the next frame
    const onComponentsChanged = _.debounce(this.onComponentsChanged.bind(this), 0);
    this.runtimeEntities.forEach(e => e.dispose());
    this.runtimeEntities = scene.entities.map(entity => ({
      id: entity.id,
      components: _.cloneDeep(entity.components),
      sceneEntity: entity,
      subscriptions: [],
      get componentTypes() {
        return Object.keys(this.components);
      },
      addComponent(componentName, component) {
        this.components[componentName] = component;
        onComponentsChanged(this);
      },
      removeComponent(componentName) {
        delete this.components[componentName];
        onComponentsChanged(this);
      },
      dispose() {
        this.subscriptions.forEach(s => s.subscription.unsubscribe());
        this.subscriptions = [];
      }
    }));
    
    this.onTargetGroupsChanged();
  }

  onTargetGroupsChanged() {
    // Update system's entity list based on components required by targetGroup filter
    // console.log('onTargetGroupsChanged stack:', new Error().stack);
    this.systems.forEach(system => {
      // console.log('@@@onSceneChanged filter for ', system.name);
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

    this.systems.forEach(system => {
      // Invoke setup systems
      if (system.setup) {
        system.entities.forEach(e => {
          system.setup(e, this.context);
        });
      }

      // Refresh subscriptions for reactToData systems
      if (system.reactToData) {
        console.log('Refresh subscriptions for ', system.constructor.name);
        const systemSubscriptionPredicate = systemSubscription => systemSubscription.system === system;
        system.entities.forEach(e => {
          e.subscriptions
            .filter(systemSubscriptionPredicate)
            .forEach(systemSubscription => {
              systemSubscription.subscription.unsubscribe();
            });
          _.remove(e.subscriptions, systemSubscriptionPredicate);
          const observable = system.reactToData(e, this.context);
          // console.log('reactToData setup e:', e, 'observable:', observable);
          const subscription = observable.subscribe(x => { system.execute(e, x); })
          e.subscriptions.push({ system, subscription });
        });
        console.log('reactToData setup done for', system.constructor.name, ', ents:', system.entities);
      }
    });
  }


  onUpdate(scene) {
    this.updateSystems.forEach(system => {
      system.entities.forEach(e => {
        system.execute(e, this.context);
      });
    });
  }

  onDraw(scene) {
    this.drawSystems.forEach(system => {
      system.entities.forEach(e => {
        system.execute(e, this.context);
      });
    });
  }
}