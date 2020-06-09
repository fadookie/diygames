import {
  useReducer,
  useEffect,
} from 'react';
import type { StaticScene, Reducer, GameDispatch } from '../types';

const loadState = (storageKey : string, initialState : StaticScene) => {
  const state = window.localStorage.getItem(storageKey);
  if (state) return JSON.parse(state);
  return initialState;
};

const useRedux = (reducer :  Reducer, initialState : StaticScene, storageKey : string) : [StaticScene, GameDispatch] => {
  const redux = useReducer(reducer, initialState, loadState.bind(null, storageKey, initialState));
  const [state] = redux;
  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);
  return redux;
};

export default useRedux;
