import _ from 'lodash';
import { Subject } from 'rxjs';
import RenderSystem from './RenderSystem';
import DirectionalMovementSystem from './DirectionalMovementSystem';
import ScriptSystem from './ScriptSystem';
import InputSystem from './InputSystem';

export default class EcsManager {
  updateSystems = [
    new InputSystem(),
    new ScriptSystem(),
    new DirectionalMovementSystem(),
  ]

  drawSystems = [
    new RenderSystem(),
  ]

  get systems() {
    return _.uniq([...this.updateSystems, ...this.drawSystems]);
  }

  runtimeEntities = [];
  globalEventBus = new Subject();

  constructor(p5) {
    this.p5 = p5;
  }

  onComponentsChanged(entity) {
    this.onTargetGroupsChanged();
  }

  onSceneChanged(scene) {
    // Re-create runtime entity instances
    const onComponentsChanged = this.onComponentsChanged.bind(this);
    this.runtimeEntities = scene.entities.map(entity => ({
      id: entity.id,
      components: _.cloneDeep(entity.components),
      sceneEntity: entity,
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
    }));
    
    this.onTargetGroupsChanged();
  }

  onTargetGroupsChanged() {
    // Update system's entity list based on components required by targetGroup filter
    this.systems.forEach(system => {
      console.log('@@@onSceneChanged filter for ', system.name);
      system.entities = this.runtimeEntities.filter(entity => {
        const diff = _.difference(
          system.targetGroup,
          entity.componentTypes
        );
        const predicate = diff.length === 0;
        console.log('@@@ diff:', diff, 'target:', system.targetGroup, 'components:', Object.keys(entity.components), 'predicate:', predicate);
        return predicate;
      });
    });

    this.systems.forEach(system => {
      system.setup && system.setup(system.entities);
    });
  }

  onUpdate(scene) {
    this.updateSystems.forEach(system => {
      system.execute && system.execute(system.entities, { p5: this.p5, globalEventBus: this.globalEventBus });
    });
  }

  onDraw(scene) {
    this.drawSystems.forEach(system => {
      system.execute && system.execute(system.entities, { p5: this.p5, globalEventBus: this.globalEventBus });
    });
  }

  mousePressed() {
    this.globalEventBus.next({ type: 'Tap' });
  }
}