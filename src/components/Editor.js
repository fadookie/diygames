import React, { useContext } from 'react';
import _ from 'lodash';
import GamePlayer from './GamePlayer.js';
import GameContext from '../state/GameContext';
import './Editor.css';

function Editor() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;

  const addEntity = (id) => {
    gameDispatch({
      type: 'addEntities',
      entities: [{
        id,
        components: {
          Transform: {
            pos: { x: _.random(0, 200), y: _.random(0, 200) },
            size: { w: 10, h: 10 },
          },
          Renderer: {
            strokeColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
            fillColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
          },
          // DirectionalMovement: {
          //   velocity: {
          //     x: 1,
          //     y: 0,
          //   },
          // },
          Scripts: [
            {
              triggers: [
                { type: 'TapTrigger', target:'Anywhere' }
              ],
              actions: [
                { type: 'DirectionalMovement', velocity: { x: 1, y: 0 }}
              ],
            },
          ],
        },
      }],
    });
  };

  const addTestEntity = () => addEntity(`testEntity_${Date.now()}`);
  const addDuplicateEntity = addEntity.bind(null, 'duplicateEntity');

  const removeTestEntity = () => {
    if (gameState.entities.length < 1) return;
    gameDispatch({
      type: 'removeEntities',
      entityIds: [gameState.entities[0].id],
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
      <button className="button" onClick={addDuplicateEntity}>
        Add Duplicate Entity
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
      <pre className="codePreview">{`GameState: ${JSON.stringify(gameState, undefined, 2)}`}</pre>
    </div>
  );
}

export default Editor;
