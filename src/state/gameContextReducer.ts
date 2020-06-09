import _ from 'lodash';
import produce from 'immer';
import type { StaticScene, StaticEntity } from '../types';

export const initialState : StaticScene = {
  entities: [],
  bgColor: [0, 0, 0],
};
Object.freeze(initialState);

// TODO define action types
export default (state : StaticScene, action : any) : StaticScene => {
  if (action.entities && action.entities.find((e : StaticEntity) => e.id === 'Self')) throw new Error('Entity ID Self is reserved.');
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
      const color = _.clamp(action.color, 0, 255);
      return { ...state, bgColor: [color, color, color] };
    } default:
      throw new Error(`Unknown action type:'${action.type}'`);
  }
};