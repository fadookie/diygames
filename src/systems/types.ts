import type p5 from 'p5';
import type { Observable, Subscription  } from 'rxjs';
import type Entity from './Entity';

//#region Misc

export interface Point2D {
  x: number,
  y: number,
}

export interface SubscriptionToken {
  system: Object,
  subscription: Subscription,
}

export type GlobalEvent = { type: string, data: { mousePos: Point2D } };

export type GlobalEventBus = Observable<GlobalEvent>;

export type Context = { p5: p5, globalEventBus: GlobalEventBus, entities: Entity[] };

//#endregion Misc


//#region Script Components

export type ComponentName = 'DirectionalMovement';

export interface TapTrigger {
  type: 'TapTrigger',
  target: string,
}

export interface SwitchTrigger {
  type: 'Switch',
  target: 'Any' | 'Self',
  changingTo: boolean,
}

export type Trigger = TapTrigger | SwitchTrigger;

export type ActionType = 'SetComponent' | 'Switch';

export interface SetComponentAction {
  type: 'SetComponent',
  componentName: ComponentName,
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
  strokeColor: [number, number, number],
  fillColor: [number, number, number],
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

export type Component = Collider | ColliderRuntime | DirectionalMovement | Renderer | Script0 | Script1 | Script2 | Script3 | Transform ;

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
