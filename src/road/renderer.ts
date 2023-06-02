import { get } from "svelte/store";
import { HandleState, type Handle, type Road } from "../types/road";
import { line, point } from "../utils/canvas";
import { handles } from "../road/handle";

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	line(ctx, road.from, road.to, road.ghost ? `hsla(0,0%,0%,0.2)` : "black");
}
export function renderHandle(ctx: CanvasRenderingContext2D, handle: Handle) {
	console.log(handle.state);
	point(ctx, handle.position, handle.state === HandleState.Dragging ? "orange" : "coral", 10)
}

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
	for (const road of roads)
		renderRoad(ctx, road);
	for (const handle of get(handles))
		renderHandle(ctx, handle);
}
