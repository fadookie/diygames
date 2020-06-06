import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import _ from 'lodash';
import { Subject, interval, BehaviorSubject, NEVER } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import GameContext from '../state/GameContext';
import EcsManager from '../systems/EcsManager';

const GAME_LENGTH_MS = 5 * 1000;
const NUM_GAME_TIME_SEGMENTS = 5;
const GAME_TIME_SEGMENT_LENGTH_MS = GAME_LENGTH_MS / NUM_GAME_TIME_SEGMENTS;

function createSketch(sceneRef, sketchRef, node) {
  if (!node) return;

  let ecsManager;

  const isPlaying = new BehaviorSubject(false);

  const globalEventBus = new Subject();
  const timelineObservable =
    isPlaying.asObservable().pipe(
      switchMap(playing => playing
        ? interval(GAME_TIME_SEGMENT_LENGTH_MS).pipe(
            take(NUM_GAME_TIME_SEGMENTS),
            map(i => ({ type: 'TimeSegment', segment: i + 1 })),
          )
        : NEVER),
      tap(console.log.bind(console, 'TIME:')),
    );
  timelineObservable.subscribe(globalEventBus);

  const sketch = (p5instance) => {
    const p = p5instance;
    ecsManager = new EcsManager(p, globalEventBus, sceneRef.current);
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
  sketch.onPlayingChanged = (playing) => {
    console.log('@@@ onPlayingChanged', playing);
    isPlaying.next(playing);
    ecsManager.onPlayingChanged(playing);
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
