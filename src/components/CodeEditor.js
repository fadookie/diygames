// No type annotations exist for prism-core so I can't port this component to TS easily
// It's going to be removed when the GUI is done anyway so not gonna bother with it now
import React, { useState, useEffect, useMemo, useContext } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
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
  const revertText = setText.bind(null, stringifiedEntities);
  useEffect(revertText, [stringifiedEntities]);

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
    <div className="codeEditorContainer">
      {error && <p className="error">{error} <button onClick={revertText}>Revert To Saved</button></p>}
      <Editor
        className="codeEditor"
        value={text}
        onValueChange={setText}
        highlight={code => highlight(code, languages.json, 'json')}
        padding={10}
      />
    </div>
  );
}

export default CodeEditor;