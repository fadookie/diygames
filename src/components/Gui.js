import React, { useContext } from 'react';
import _ from 'lodash';
import GamePlayer from './GamePlayer.js';
import GameContext, { GameProvider } from '../state/GameContext';

const { useState } = React;

function Gui() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;
  const addTestObject = () => {
    const id = parseInt(_.uniqueId(), 10);
    gameDispatch({
      type: 'setObjects',
      objects: {
        [`testObject_${id}`]: {
          transform: {
            pos: { x: id * 20, y: 10 },
            size: { w: 10, h: 10 },
          },
          strokeColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
          fillColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
        },
      },
    });
  };
  const removeTestObject = () => {
    if (Object.keys(gameState.objects).length < 1) return;
    gameDispatch({
      type: 'removeObject',
      objectId: Object.keys(gameState.objects)[0],
    });
  };
  const shiftBgColor = (amount) => {
    gameDispatch({ type: 'setBgColor', color: gameState.bgColor + amount });
  };
  return (
    <div className="container p-b-md p-r-md p-l-md has-text-centered">
      <hr />
      Controls:<br />
      <button className="button" onClick={addTestObject}>
        Add Test Object
      </button>
      <button className="button" onClick={removeTestObject}>
        Remove Test Object
      </button>
      <button className="button" onClick={() => gameDispatch({ type: 'clearObjects' })}>
        ClearObjects
      </button>
      <br />
      <button className="button" onClick={shiftBgColor.bind(null, 10)}>
        BG Color +
      </button>
      <button className="button" onClick={shiftBgColor.bind(null, -10)}>
        BG Color-
      </button>
      <GamePlayer scene={gameState} />
      <br />
      Objects:
      <pre style={{ textAlign: 'left' }}>{`GameState: ${JSON.stringify(gameState, undefined, 2)}`}</pre>
    </div>
  );
}

function GuiWithContext() {
  return (
    <GameProvider>
      <Gui />
    </GameProvider>
  );
}

export default GuiWithContext;
