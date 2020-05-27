import React, { useState, useContext } from 'react';
import _ from 'lodash';
import GamePlayer from './GamePlayer.js';
import GameContext from '../state/GameContext';
import CodeEditor from './CodeEditor';
import './Editor.css';

function Editor() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;

  const [gamePlaying, setGamePlaying] = useState(true);

  const addEntity = (id) => {
    gameDispatch({
      type: 'addEntities',
      entities: [{
        id,
        components: {
          Transform: {
            pos: { x: _.random(0, 200), y: _.random(0, 200) },
            size: { w: 50, h: 50 },
          },
          Renderer: {
            strokeColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
            fillColor: [_.random(0, 255), _.random(0, 255), _.random(0, 255)],
          },
          Collider: {
            type: 'AABB',
          },
          Script0: {
            triggers: [
              { type: 'TapTrigger', target:'Self' },
              { type: 'Switch', target:'Self', condition:false }
            ],
            actions: [
              { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: 1, y: 0 } },
              { type: 'Switch', set:true },
            ],
          },
          Script1: {
            triggers: [
              { type: 'TapTrigger', target:'Self' },
              { type: 'Switch', target:'Self', condition:true }
            ],
            actions: [
              { type: 'SetComponent', component: 'DirectionalMovement', velocity: { x: -1, y: 0 } },
              { type: 'Switch', set:false },
            ],
          },
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
      <br />
      <button className="button" onClick={shiftBgColor.bind(null, 10)}>
        BG Color +
      </button>
      <button className="button" onClick={shiftBgColor.bind(null, -10)}>
        BG Color-
      </button>
      <br />
      <p>GamePlayer 
        <button className="button" style={{ margin: '5pt' }} onClick={() => setGamePlaying(prev => !prev)}>
          {gamePlaying ? '⏹' : '▶️'}
        </button>
      </p>
      <GamePlayer playing={gamePlaying} />
      <br />
      Entity Editor:
      <br />
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
      <CodeEditor />
      Scene:
      <pre className="codePreview">{`GameState: ${JSON.stringify({...gameState, entities: '<See Above>'}, undefined, 2)}`}</pre>
    </div>
  );
}

export default Editor;
