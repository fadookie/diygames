import _ from 'lodash';

// type Scene = {
//   [objects : string]: 
// }

export const initialState = {
  objects: {},
  bgColor: 0,
};
Object.freeze(initialState);

export default (state, action) => {
  switch (action.type) {
    case 'setObjects': {
      return { ...state, objects: { ...state.objects, ...action.objects } };
    } case 'removeObject': {
      return { ...state, objects: _.omit(state.objects, [action.objectId]) };
    } case 'clearObjects': {
      return { ...state, objects: {} };
    } case 'setBgColor': {
      return { ...state, bgColor: _.clamp(action.color, 0, 255) };
    } default:
      throw new Error();
  }
};
