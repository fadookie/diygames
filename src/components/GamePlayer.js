import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import GameContext from '../state/GameContext';

function createSketch(scene, node) {
  if (!node) return;
  const sketch = (p5instance) => {
    const p = p5instance;
    p.setup = () => {
      p.createCanvas(500, 500);
      // p.colorMode(p.HSB);
    };
    p.draw = () => {
      const { bgColor, entities } = scene.current;
      p.background(bgColor);

      Object.keys(entities).forEach((key) => {
        const o = entities[key];
        console.log(`@@@ draw ${key}:`, o);
        p.push();
        if (o.strokeColor) {
          p.stroke(...o.strokeColor);
        } else {
          p.noStroke();
        }
        if (o.fillColor) {
          p.fill(...o.fillColor);
        } else {
          p.noFill();
        }
        p.translate(o.transform.pos.x, o.transform.pos.y);
        p.rect(0, 0, o.transform.size.w, o.transform.size.h);
        p.pop();
      });
    };
  };
  // eslint-disable-next-line no-new
  new P5(sketch, node);
}

function GamePlayer() {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;

  useEffect(createSketch, []);
  const sceneRef = useRef({});
  sceneRef.current = gameState;
  const sketchContainerRef = useCallback(createSketch.bind(null, sceneRef), []);
  return (
    <div className="container p-b-md p-r-md p-l-md has-text-centered">
      GamePlayer
      <div id="container" ref={sketchContainerRef} />
    </div>
  );
}

export default GamePlayer;
