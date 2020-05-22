import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import GameContext from '../state/GameContext';

function createSketch(sceneRef, sketchRef, node) {
  if (!node) return;
  const sketch = (p5instance) => {
    const p = p5instance;
    p.setup = () => {
      p.createCanvas(500, 500);
      // p.colorMode(p.HSB);
    };
    p.draw = () => {
      const { bgColor, entities } = sceneRef.current;
      p.background(bgColor);

      entities.forEach((o) => {
        // console.log(`@@@ draw ${key}:`, o);
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
  sketch.onSceneChanged = () => {
    console.log('@@@ sketch#onSceneChanged', sceneRef.current);
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
      sketchRef.current.onSceneChanged();
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
