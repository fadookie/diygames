import {
  useReducer,
  useEffect,
} from 'react';

const loadState = (storageKey, initialState) => {
  const state = window.localStorage.getItem(storageKey);
  if (state) return JSON.parse(state);
  return initialState;
};

const useRedux = (reducer, initialState, storageKey) => {
  const redux = useReducer(reducer, initialState, loadState.bind(null, storageKey, initialState));
  const [state] = redux;
  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);
  return redux;
};

export default useRedux;
