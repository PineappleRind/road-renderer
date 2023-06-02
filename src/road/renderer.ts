import { get } from "svelte/store";
import { HandleState, type Handle, type Road } from "../types/road";
import { path, point } from "../utils/canvas";
import { handles } from "../road/handle";
import { catmullRomFitting } from "../utils/math";

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	const path2d = new Path2D(
		catmullRomFitting([road.from, road.curve, road.to]),
	);
	path(ctx, path2d, road.ghost ? `hsla(0,0%,0%,0.2)` : "black");
}
export function renderHandle(ctx: CanvasRenderingContext2D, handle: Handle) {
	point(
		ctx,
		handle.position,
		handle.affects === "curve" ? "lime" : "green",
		handle.affects === "curve" ? 5 : 10,
	);
}

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
	for (const road of roads) renderRoad(ctx, road);
	for (const handle of get(handles)) renderHandle(ctx, handle);
}
