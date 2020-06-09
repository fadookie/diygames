import React, { useState, useContext } from 'react';
import GamePlayer from './GamePlayer';
import GameContext from '../state/GameContext';
import CodeEditor from './CodeEditor';
import { generateBaseEntity, generateTestSceneEntities } from './testSceneUtils';
import './Editor.css';

function Editor() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;

  const [gamePlaying, setGamePlaying] = useState(true);

  const addEntity = (id) => {
    gameDispatch({
      type: 'addEntities',
      entities: [generateBaseEntity(id)],
    });
  };

  const addTestEntity = () => addEntity(`testEntity_${Date.now()}`);
  const addDuplicateEntity = addEntity.bind(null, 'duplicateEntity');
  const clearEntities = () => gameDispatch({ type: 'clearEntities' });

  const loadTestScene = () => {
    clearEntities();
    const entities = generateTestSceneEntities();
    gameDispatch({
      type: 'addEntities',
      entities,
    });
  };

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
      <button className="button" onClick={loadTestScene}>
        Load Test Scene
      </button>
      <button className="button" onClick={addTestEntity}>
        Add Test Entity
      </button>
      <button className="button" onClick={removeTestEntity}>
        Remove Test Entity
      </button>
      <button className="button" onClick={addDuplicateEntity}>
        Add Duplicate Entity
      </button>
      <button className="button" onClick={clearEntities}>
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
