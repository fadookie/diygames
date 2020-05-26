import React, { useState, useEffect, useMemo, useContext } from 'react';
import GameContext from '../state/GameContext';
import './CodeEditor.css';

function CodeEditor() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;
  const { entities } = gameState;

  const onSetEntities = entities => gameDispatch({ type: 'setEntities', entities });

  const stringifiedEntities = useMemo(
    JSON.stringify.bind(null, entities, undefined, 2),
  [entities]);

  const [text, setText] = useState(stringifiedEntities);
  useEffect(() => {
    setText(stringifiedEntities);
  }, [stringifiedEntities]);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const entities = JSON.parse(text);
      if (onSetEntities) onSetEntities(entities);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <form className="codeEditor" onSubmit={handleSubmit}>
      <input type="submit" value="Save" />
      <textarea value={text} onChange={evt => setText(evt.target.value)} />
    </form>
  );
}

export default CodeEditor;