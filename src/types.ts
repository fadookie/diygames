import type { Observable } from 'rxjs';

//#region Misc

export type Color = [number, number, number];

export interface Point2D {
  x: number,
  y: number,
}

export interface Rect2D {
  pos: Point2D,
  size: {
    w: number,
    h: number,
  }
}

export interface GlobalTapEvent {
  type: 'Tap',
  data: { mousePos: Point2D },
};

export interface GlobalTimeSegmentEvent {
  type: 'TimeSegment',
  segment: number,
  special? : 'Start' | 'End',
};

export type GlobalEvent = GlobalTapEvent | GlobalTimeSegmentEvent;

export type GlobalEventBus = Observable<GlobalEvent>;


export interface StaticEntity {
  id: string,
  components: Components
}

export interface StaticScene {
  entities: Array<StaticEntity>,
  bgColor: Color,
};

//#endregion Misc


//#region Script Components

export interface TapTrigger {
  type: 'TapTrigger',
  target: 'Any' | 'Self',
}

export interface TimeSegmentTrigger {
  type: 'TimeSegmentTrigger',
  segment: number,
}

export interface SwitchTrigger {
  type: 'Switch',
  target: string,
  changingTo: boolean,
}

export type Trigger = TapTrigger | TimeSegmentTrigger | SwitchTrigger;

export type ActionType = 'SetComponent' | 'Switch';

export interface SetComponentAction {
  type: 'SetComponent',
  component: Component,
}

export interface SetSwitchAction {
  type: 'Switch',
  set: boolean,
}

export type TriggerAction = SetComponentAction | SetSwitchAction;

export interface CheckSwitchCondition {
  type: 'Switch',
  target: string,
  condition: boolean, 
}

export type Condition = CheckSwitchCondition;

export interface Script extends ComponentBase {
  triggers: Array<Trigger>,
  conditions: Array<Condition>,
  actions: Array<TriggerAction>,
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

export interface Transform extends ComponentBase, Rect2D {
  type: 'Transform',
}

export interface StopMovement extends ComponentBase {
  type: 'StopMovement',
}

export interface WinCondition extends ComponentBase {
  type: 'WinCondition',
  expectedSwitchState: boolean,
}

export type Component = Collider | ColliderRuntime | DirectionalMovement | Renderer | Script0 | Script1 | Script2 | Script3 | StopMovement | Transform | WinCondition;

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
  StopMovement: StopMovement,
  Transform: Transform,
  WinCondition: WinCondition,
}

export type Components = ComponentsBase;
//#endregion Components Collection

//#region Redux

export interface AddEntitiesAction {
  type: 'addEntities',
  entities: StaticEntity[],
}

export interface SetEntitiesAction {
  type: 'setEntities',
  entities: StaticEntity[],
}

export interface RemoveEntitiesAction {
  type: 'removeEntities',
  entityIds: StaticEntity['id'],
}

export interface ClearEntitiesAction {
  type: 'clearEntities',
}

export interface SetBgColorAction {
  type: 'setBgColor',
  color: number,
}

export type Action = AddEntitiesAction | SetEntitiesAction | RemoveEntitiesAction | ClearEntitiesAction | SetBgColorAction;

export type Reducer = (state : StaticScene, action: Action) => StaticScene;

export type GameDispatch = (action: Action) => void;

//#endregion Redux