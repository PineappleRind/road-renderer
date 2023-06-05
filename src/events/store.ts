import { get, writable } from "svelte/store";
import type { Coordinate } from "../types/position";

type MouseState = Coordinate & { down: boolean };
type MouseStateWithPrevious = MouseState & { previous: MouseState }

export const mouseState = writable<MouseStateWithPrevious>({ x: 0, y: 0, down: null, previous: null });

export function setMouseState(value: MouseState) {
	let previous = get(mouseState);
	delete previous.previous;
	mouseState.set({ ...previous, ...value, previous })
}

export function setMouseDown(to: boolean) {
	setMouseState({ ...get(mouseState), down: to });
}