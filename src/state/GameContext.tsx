import React from 'react';
import type { ReactNode } from 'react';
import useRedux from './reRedux';
import reducer, { initialState } from './gameContextReducer';
import type { StaticScene, GameDispatch } from '../types';

interface GameContextType {
  gameState: StaticScene,
  gameDispatch: GameDispatch,
}

const GameContext = React.createContext<GameContextType>({
  get gameState(): never {
      throw new Error("Accessed context outside of provider")
  },
  gameDispatch: () => {
      throw new Error("Accessed context outside of provider");
  },
});

interface GameProviderProps {
  children: ReactNode,
}

export function GameProvider({ children } : GameProviderProps) {
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
