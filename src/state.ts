import { writable } from "svelte/store";

export enum AppState {
    Idle = 0,
    IsCreatingRoad = 1,
}

export const appState = writable<AppState>(AppState.Idle);

export function setAppState(newState: AppState) {
    appState.set(newState);
}