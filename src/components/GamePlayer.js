import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import _ from 'lodash';
import { Subject } from 'rxjs';
import GameContext from '../state/GameContext';
import EcsManager from '../systems/EcsManager';

function createSketch(sceneRef, sketchRef, node) {
  if (!node) return;
  let ecsManager;
  const globalEventBus = new Subject();
  const sketch = (p5instance) => {
    const p = p5instance;
    ecsManager = new EcsManager(p, globalEventBus, sceneRef.current);
    sketch.onPlayingChanged = ecsManager.onPlayingChanged.bind(ecsManager);
    p.setup = () => {
      p.createCanvas(500, 500);
      // p.colorMode(p.HSB);
    };
    p.draw = () => {
      ecsManager.onUpdate();

      const { bgColor } = sceneRef.current;
      p.background(bgColor);

      ecsManager.onDraw();
    };
    p.mousePressed = (event) => {
      globalEventBus.next({ type: 'Tap', data: { mousePos: { x: p.mouseX, y: p.mouseY } }});
    };
  };
  sketch.onSceneChanged = (scene) => {
    console.log('@@@ sketch#onSceneChanged', scene);
    ecsManager.onSceneChanged(scene);
  }
  // eslint-disable-next-line no-new
  new P5(sketch, node);
  sketchRef.current = sketch;
}

function GamePlayer({ playing }) {
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

  useEffect(() => {
    if (sketchRef.current && sketchRef.current.onPlayingChanged) {
      sketchRef.current.onPlayingChanged(playing);
    }
  }, [playing]);
  return (
    <div id="container" ref={sketchContainerRef} />
  );
}

export default GamePlayer;
