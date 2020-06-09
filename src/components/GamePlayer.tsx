import React, { useEffect, useCallback, useRef, useContext } from 'react';
import P5 from 'p5';
import _ from 'lodash';
import produce from 'immer';
import { Subject, interval, BehaviorSubject, NEVER } from 'rxjs';
import { take, map, tap, switchMap, startWith } from 'rxjs/operators';
import GameContext from '../state/GameContext';
import EcsManager from '../systems/EcsManager';
import type { StaticScene, GlobalEvent, GlobalTimeSegmentEvent } from '../types';

const GAME_LENGTH_MS = 5 * 1000;
const NUM_GAME_TIME_SEGMENTS = 5;
const GAME_TIME_SEGMENT_LENGTH_MS = GAME_LENGTH_MS / NUM_GAME_TIME_SEGMENTS;

interface Sketch {
  (p5instance : P5) : void,
  onSceneChanged(scene : StaticScene) : void,
  onPlayingChanged(playing : boolean) : void,
}

type SceneRef = React.MutableRefObject<StaticScene>;
type SketchRef = React.MutableRefObject<Sketch | null>;

function createSketch(sceneRef : SceneRef, sketchRef : SketchRef, node : any) {
  if (!node) return;

  let ecsManager : EcsManager;

  const isPlaying = new BehaviorSubject(false);

  const globalEventBus = new Subject<GlobalEvent>();
  const timelineObservable =
    isPlaying.asObservable().pipe(
      switchMap(playing => playing
        ? interval(GAME_TIME_SEGMENT_LENGTH_MS).pipe(
            startWith(-1),
            take(NUM_GAME_TIME_SEGMENTS),
            map(i => {
              const segment = i + 1;
              return produce({ type: 'TimeSegment', segment } as GlobalTimeSegmentEvent, draft => {
                if(segment === 0) {
                  draft.special = 'Start';
                } else if(segment === NUM_GAME_TIME_SEGMENTS - 1) {
                  draft.special = 'End';
                }
              });
            }),
          )
        : NEVER),
      tap(console.log.bind(console, 'TIME:')),
    );
  timelineObservable.subscribe(globalEventBus);

  const sketch : Sketch = (p5instance : P5) => {
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
  sketch.onSceneChanged = (scene : StaticScene) => {
    console.log('@@@ sketch#onSceneChanged', scene);
    ecsManager.onSceneChanged(scene);
  }
  sketch.onPlayingChanged = (playing : boolean) => {
    console.log('@@@ onPlayingChanged', playing);
    isPlaying.next(playing);
    ecsManager.onPlayingChanged(playing);
  }
  // eslint-disable-next-line no-new
  new P5(sketch, node);
  sketchRef.current = sketch;
}

interface GamePlayerProps {
  playing: boolean
}

function GamePlayer({ playing } : GamePlayerProps) {
  const context = useContext(GameContext);
  const { gameState, gameDispatch } = context;

  const sceneRef = useRef(gameState);
  const sketchRef : SketchRef = useRef(null);
  const sketchContainerRef = useCallback(createSketch.bind(null, sceneRef, sketchRef), []);

  useEffect(() => {
    sceneRef.current = gameState;
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
