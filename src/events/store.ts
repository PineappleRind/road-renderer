import { get, writable } from "svelte/store";

import type { Coordinate } from "@/types/position";

type MouseState = Coordinate & { down: boolean };
export type MouseStateWithPrevious = MouseState & { previous: MouseState };

export const mouseState = writable<MouseStateWithPrevious>({
	x: 0,
	y: 0,
	down: null,
	previous: null,
});

export function setMouseState(value: MouseState) {
	const previous = get(mouseState);
	previous.previous = undefined;
	mouseState.set({ ...previous, ...value, previous });
}

export function setMouseDown(to: boolean) {
	setMouseState({ ...get(mouseState), down: to });
}
