import { writable } from "svelte/store";
import type { Coordinate } from "../types/position";

export const mousePos = writable<Coordinate>({ x: 0, y: 0 });
document.addEventListener(
	"mousemove",
	(e) => void mousePos.set({ x: e.clientX, y: e.clientY }),
);
