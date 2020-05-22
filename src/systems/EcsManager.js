import _ from 'lodash';
import renderSystem from './renderSystem';
import transformSetupSystem from './transformSetupSystem';
import directionalMovementSystem from './directionalMovementSystem';

export default class EcsManager {
  setupSystems = [
    transformSetupSystem,
  ]

  updateSystems = [
    directionalMovementSystem,
  ]

  drawSystems = [
    renderSystem,
  ]

  get systems() {
    return _.uniq([...this.setupSystems, ...this.updateSystems, ...this.drawSystems]);
  }

  runtimeEntities = [];

  recievedFirstSceneUpdate = false

  onSceneChanged(scene) {
    // Re-create runtime entity instances
    this.runtimeEntities = scene.entities.map(entity => ({
      id: entity.id,
      runtimeComponents: {},
      sceneEntity: entity,
      get components() {
        return { ...this.sceneEntity.components, ...this.runtimeComponents };
      },
      get componentTypes() {
        return Object.keys(this.components);
      }
    }));

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

    this.setupSystems.forEach(setupSystem => {
      setupSystem(setupSystem.entities);
    });

    // this.recievedFirstSceneUpdate = true;
  }

  onUpdate(scene) {
    // if (!this.recievedFirstSceneUpdate) return;
    this.updateSystems.forEach(updateSystem => {
      updateSystem(updateSystem.entities);
    });
  }

  onDraw(scene, p5) {
    // if (!this.recievedFirstSceneUpdate) return;
    this.drawSystems.forEach(drawSystem => {
      drawSystem(p5, drawSystem.entities);
    });
  }
}