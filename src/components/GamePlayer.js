import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import _ from 'lodash';
import GameContext from '../state/GameContext';
import EcsManager from '../systems/EcsManager';

function createSketch(sceneRef, sketchRef, node) {
  if (!node) return;
  let ecsManager;
  const sketch = (p5instance) => {
    const p = p5instance;
    ecsManager = new EcsManager(p);
    ecsManager.onSceneChanged(sceneRef.current);
    p.setup = () => {
      p.createCanvas(500, 500);
      // p.colorMode(p.HSB);
    };
    p.draw = () => {
      ecsManager.onUpdate(sceneRef.current);

      const { bgColor } = sceneRef.current;
      p.background(bgColor);

      ecsManager.onDraw(sceneRef.current);
    };
    p.mousePressed = ecsManager.mousePressed.bind(ecsManager);
  };
  sketch.onSceneChanged = (scene) => {
    console.log('@@@ sketch#onSceneChanged', scene);
    ecsManager.onSceneChanged(scene);
  }
  // eslint-disable-next-line no-new
  new P5(sketch, node);
  sketchRef.current = sketch;
}

function GamePlayer() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;

  const sceneRef = useRef({});
  const sketchRef = useRef(null);
  sceneRef.current = gameState;
  const sketchContainerRef = useCallback(createSketch.bind(null, sceneRef, sketchRef), []);

  useEffect(() => {
    if (sketchRef.current) {
      sketchRef.current.onSceneChanged(sceneRef.current);
    }
  }, [gameState]);
  return (
    <div className="container p-b-md p-r-md p-l-md has-text-centered">
      GamePlayer
      <div id="container" ref={sketchContainerRef} />
    </div>
  );
}

export default GamePlayer;
