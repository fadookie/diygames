import _ from 'lodash';
import produce from 'immer';

// type Scene = {
//   [entities : string]: 
// }

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
      });
    } case 'removeEntities': {
      return produce(state, next => {
        _.remove(next.entities, entity => action.entityIds.contains(entity)); 
      });
    } case 'clearEntities': {
      return { ...state, entities: {} };
    } case 'setBgColor': {
      return { ...state, bgColor: _.clamp(action.color, 0, 255) };
    } default:
      throw new Error(`Unknown action type:'${action.type}'`);
  }
};
