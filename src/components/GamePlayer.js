import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import _ from 'lodash';
import GameContext from '../state/GameContext';
import renderSystem from '../systems/renderSystem';

function createSketch(sceneRef, sketchRef, node) {
  if (!node) return;
  const sketch = (p5instance) => {
    const p = p5instance;
    p.setup = () => {
      p.createCanvas(500, 500);
      // p.colorMode(p.HSB);
    };
    p.draw = () => {
      const { bgColor } = sceneRef.current;
      p.background(bgColor);

      renderSystem(p, renderSystem.entities);
    };
  };
  sketch.onSceneChanged = (scene) => {
    console.log('@@@ sketch#onSceneChanged', scene);
    renderSystem.entities = scene.entities.filter(
      entity => _.difference(
        ['Transform', 'Renderer'],
        Object.keys(entity.components)
      ).length === 0
    );
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
