import _ from 'lodash';

function transformSetupSystem(entities) {
  console.log('@@@transformSetupSystem', entities);
  entities.forEach((e) => {
    e.runtimeComponents.Transform = _.cloneDeep(e.components.Transform);
  });
}

transformSetupSystem.targetGroup = ['Transform'];
transformSetupSystem.entities = [];

export default transformSetupSystem;