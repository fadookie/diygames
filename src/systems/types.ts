import type p5 from 'p5';
import type { Observable, Subscription  } from 'rxjs';
import type Entity from './Entity';

//#region Misc

export type Color = [number, number, number];

export interface Point2D {
  x: number,
  y: number,
}

export interface SubscriptionToken {
  system: Object,
  subscription: Subscription,
}

export interface GlobalTapEvent {
  type: 'Tap',
  data: { mousePos: Point2D },
};

export interface GlobalTimeSegmentEvent {
  type: 'TimeSegment',
  segment: number,
};

export type GlobalEvent = GlobalTapEvent | GlobalTimeSegmentEvent;

export type GlobalEventBus = Observable<GlobalEvent>;

export interface Scene {
  entities: Array<Entity>,
  bgColor: Color,
};

export type Context = { p5: p5, globalEventBus: GlobalEventBus, entities: Entity[] };

export interface System {
  tag: string,
  targetGroup: Array<Component['type']>,
  entities: Array<Entity>,  
}

export interface SetupSystem extends System {
  setup: (e : Entity, c : Context) => void,
}

export interface ExecutableSystem extends System {
  execute: (e : Entity, c : Context) => void,
}

export interface ReactToDataSystem<T> extends System {
  reactToData: (e : Entity, c : Context) => Observable<T>,
  execute: (e : Entity, c : Context, data : T) => void,
}

//#endregion Misc


//#region Script Components

export interface TapTrigger {
  type: 'TapTrigger',
  target: 'Any' | 'Self',
}

export interface TimeSegmentTrigger {
  type: 'TimeSegment',
  segment: number,
}

export interface SwitchTrigger {
  type: 'Switch',
  target: string,
  changingTo: boolean,
}

export type Trigger = TapTrigger | SwitchTrigger;

export type ActionType = 'SetComponent' | 'Switch';

export interface SetComponentAction {
  type: 'SetComponent',
  componentName: ComponentTypeString,
  component: Component,
}

export interface SetSwitchAction {
  type: 'Switch',
  set: boolean,
}

export type Action = SetComponentAction | SetSwitchAction;

export interface CheckSwitchCondition {
  type: 'Switch',
  target: string,
  condition: boolean, 
}

export type Condition = CheckSwitchCondition;

export interface Script extends ComponentBase {
  triggers: Array<Trigger>,
  conditions: Array<Condition>,
  actions: Array<Action>,
}

export interface Script0 extends Script {
  type: 'Script0',
}

export interface Script1 extends Script {
  type: 'Script1',
}

export interface Script2 extends Script {
  type: 'Script2',
}

export interface Script3 extends Script {
  type: 'Script3',
}

//#endregion Script Components

//#region Components
export interface ComponentBase {
  tags?: string[],
  dispose?: () => void,
}

export interface Collider extends ComponentBase {
  type: 'Collider',
  colliderType: 'AABB',
}

export interface ColliderRuntime extends ComponentBase {
  type: 'ColliderRuntime',
  onTap: Observable<GlobalEvent>,
  dispose: () => void,
}

export interface DirectionalMovement extends ComponentBase {
  type: 'DirectionalMovement',
  velocity: Point2D,
}

export interface Renderer extends ComponentBase {
  type: 'Renderer',
  strokeColor: Color,
  fillColor: Color,
}

// Script is defined above

export interface Transform extends ComponentBase {
  type: 'Transform',
  pos: Point2D,
  size: {
    w: number,
    h: number,
  }
}

export type Component = Collider | ColliderRuntime | DirectionalMovement | Renderer | Script0 | Script1 | Script2 | Script3 | Transform;

export type ComponentTypeString = Component['type'];

//#endregion Components

export interface ComponentsBase {
  [index: string]: Component,
}

export interface ComponentsMap {
  Collider: Collider,
  ColliderRuntime: ColliderRuntime,
  DirectionalMovement: DirectionalMovement,
  Renderer: Renderer,
  Script0: Script0,
  Script1: Script1,
  Script2: Script2,
  Script3: Script3,
  Transform: Transform,
}

export type Components = ComponentsBase;
//#endregion Components Collection
