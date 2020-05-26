import React, { useState, useEffect, useMemo, useContext } from 'react';
import GameContext from '../state/GameContext';
import './CodeEditor.css';

function CodeEditor() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;
  const { entities } = gameState;

  const stringifiedEntities = useMemo(
    JSON.stringify.bind(null, entities, undefined, 2),
  [entities]);

  const [error, setError] = useState(null);
  const [text, setText] = useState(stringifiedEntities);
  useEffect(() => {
    setText(stringifiedEntities);
  }, [stringifiedEntities]);

  useEffect(() => {
    try {
      const entities = JSON.parse(text);
      gameDispatch({ type: 'setEntities', entities });
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [text, gameDispatch]);

  return (
    <div className="codeEditor">
      <p className="error">{error}</p>
      <textarea value={text} onChange={evt => setText(evt.target.value)} />
    </div>
  );
}

export default CodeEditor;