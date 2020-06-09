import _ from 'lodash';
import { clamp } from 'lodash/fp';
import produce from 'immer';
import type { Action, AddEntitiesAction, Color, StaticScene, StaticEntity } from '../types';
import { assertNever } from '../utils/tsutils';

export const initialState : StaticScene = {
  entities: [],
  bgColor: [0, 0, 0],
};
Object.freeze(initialState);

export default (state : StaticScene, action : Action) : StaticScene => {
  if (Array.isArray((action as AddEntitiesAction).entities) && (action as AddEntitiesAction).entities.find((e : StaticEntity) => e.id === 'Self')) throw new Error('Entity ID Self is reserved.');
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
      const color = action.color.map(clamp(0, 255)) as Color;
      return { ...state, bgColor: color };
    } default:
      assertNever(action);
  }
};
