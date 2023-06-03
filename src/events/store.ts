import { writable } from "svelte/store";
import type { Coordinate } from "../types/position";

type MouseState = Coordinate & { down: boolean };

export const mouseState = writable<MouseState>({ x: 0, y: 0, down: null });
document.addEventListener(
	"mousemove",
	(e) =>
		void mouseState.set({ x: e.offsetX, y: e.offsetY, down: e.buttons === 1 }),
);
