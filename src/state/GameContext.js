import React from 'react';
import useRedux from './reRedux';
import reducer, { initialState } from './gameContextReducer';

const GameContext = React.createContext();

export function GameProvider({ children }) {
  const [gameState, gameDispatch] = useRedux(
    reducer,
    initialState,
    'GameContextStorage',
  );

  return (
    <GameContext.Provider value={{ gameState, gameDispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
