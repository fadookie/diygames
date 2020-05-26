import _ from 'lodash';
import produce from 'immer';

export const initialState = {
  entities: [],
  bgColor: 0,
};
Object.freeze(initialState);

export default (state, action) => {
  switch (action.type) {
    case 'addEntities': {
      return produce(state, next => {
        next.entities.push(...action.entities); 

        if (!_.chain(next.entities)
          .groupBy('id')
          .map(Object.values)
          .every(group => group.length === 1)
          .value()) {
          throw new Error('ID collision detected');
        }
      });
    } case 'setEntities': {
      return produce(state, next => {
        const newEntities = _.reject(next.entities, e => _.some(action.entities, { id: e.id })); 
        next.entities = [...newEntities, ...action.entities];
      });
    } case 'removeEntities': {
      return produce(state, next => {
        _.remove(next.entities, entity => action.entityIds.includes(entity.id)); 
      });
    } case 'clearEntities': {
      return { ...state, entities: [] };
    } case 'setBgColor': {
      return { ...state, bgColor: _.clamp(action.color, 0, 255) };
    } default:
      throw new Error(`Unknown action type:'${action.type}'`);
  }
};
