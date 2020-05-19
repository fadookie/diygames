import _ from 'lodash';

// type Scene = {
//   [entities : string]: 
// }

export const initialState = {
  entities: {},
  bgColor: 0,
};
Object.freeze(initialState);

export default (state, action) => {
  switch (action.type) {
    case 'setEntities': {
      return { ...state, entities: { ...state.entities, ...action.entities } };
    } case 'removeEntities': {
      return { ...state, entities: _.omit(state.entities, action.entityIds) };
    } case 'clearEntities': {
      return { ...state, entities: {} };
    } case 'setBgColor': {
      return { ...state, bgColor: _.clamp(action.color, 0, 255) };
    } default:
      throw new Error(`Unknown action type:'${action.type}'`);
  }
};
