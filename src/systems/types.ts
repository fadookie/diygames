import type { Observable } from 'rxjs';
export type GlobalEvent = { type: string, data: { mousePos: { x: number, y: number } } };
export type GlobalEventBus = Observable<GlobalEvent>;
export type Context = { globalEventBus: GlobalEventBus };