import type { Observable, Subscription  } from 'rxjs';

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

export type Context = { globalEventBus: GlobalEventBus };

//#endregion Misc

//#region Components
export interface ComponentBase {
  tags?: string[],
  dispose?: () => void,
}

export interface Collider extends ComponentBase {
  type: 'AABB';
}

export interface ColliderRuntime extends ComponentBase {
  onTap: Observable<GlobalEvent>,
  dispose: () => void,
}

export interface DirectionalMovement extends ComponentBase {
  velocity: Point2D,
}

export interface Transform extends ComponentBase {
  pos: Point2D,
  size: {
    w: number,
    h: number,
  }
}

export type Component = ComponentBase | Collider | ColliderRuntime | DirectionalMovement | Transform;

//#endregion Components

//#region Components Collection
export interface ColliderProperty extends ComponentsBase {
  Collider: Collider,
}

export interface ColliderRuntimeProperty extends ComponentsBase {
  ColliderRuntime: ColliderRuntime,
}

export interface DirectionalMovementProperty extends ComponentsBase {
  DirectionalMovement: DirectionalMovement,
}

export interface TransformProperty extends ComponentsBase {
  Transform: Transform,
}

export interface ComponentsBase {
  [index: string]: ComponentBase,
}

export type Components = ComponentsBase & Partial<ColliderProperty> & Partial<ColliderRuntimeProperty>;
//#endregion Components Collection
