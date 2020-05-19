import React, { useContext } from 'react';
import _ from 'lodash';
import GamePlayer from './GamePlayer.js';
import GameContext from '../state/GameContext';
import './Editor.css';

function Editor() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;
  const addTestEntity = () => {
    const id = parseInt(_.uniqueId(), 10);
    gameDispatch({
      type: 'setEntities',
      entities: {
        [`testEntity_${id}`]: {
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

  const removeTestEntity = () => {
    if (Object.keys(gameState.entities).length < 1) return;
    gameDispatch({
      type: 'removeEntities',
      entityIds: [Object.keys(gameState.entities)[0]],
    });
  };

  const shiftBgColor = (amount) => {
    gameDispatch({ type: 'setBgColor', color: gameState.bgColor + amount });
  };

  return (
    <div className="container">
      Controls:<br />
      <button className="button" onClick={addTestEntity}>
        Add Test Entity
      </button>
      <button className="button" onClick={removeTestEntity}>
        Remove Test Entity
      </button>
      <button className="button" onClick={() => gameDispatch({ type: 'clearEntities' })}>
        Clear Entities
      </button>
      <br />
      <button className="button" onClick={shiftBgColor.bind(null, 10)}>
        BG Color +
      </button>
      <button className="button" onClick={shiftBgColor.bind(null, -10)}>
        BG Color-
      </button>
      <GamePlayer />
      <br />
      Scene:
      <pre class="codePreview">{`GameState: ${JSON.stringify(gameState, undefined, 2)}`}</pre>
    </div>
  );
}

export default Editor;
