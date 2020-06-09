import type p5 from 'p5';
import type { Observable, Subscription } from 'rxjs';
import type { GlobalEventBus, Component } from '../types';
import type Entity from './Entity';

//#region Misc

export interface SubscriptionToken {
  system: Object,
  subscription: Subscription,
}

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

export interface ReactToGroupDataSystem<T> extends System {
  subscription?: Subscription,
  reactToGroupData: (ents : Entity[], c : Context) => Observable<T>,
  execute: (ents : Entity[], c : Context, data : T) => void,
}

//#endregion Misc
