import { get } from "svelte/store";
import { HandleState, type Handle, type Road as RoadType } from "../types/road";
import { path, point } from "../utils/canvas";
import { handles } from "../road/handle";
import { catmullRomFitting } from "../utils/math";
import Road from ".";

export function renderRoad(ctx: CanvasRenderingContext2D, road: RoadType) {
	const path2d = new Path2D(
		catmullRomFitting([
			road.from,
			road.curve,
			typeof road.to === "string" ? Road.find(road.to).from : road.to,
		]),
	);
	path(ctx, path2d, road.ghost ? "hsla(0,0%,0%,0.2)" : "black");
}
export function renderHandle(ctx: CanvasRenderingContext2D, handle: Handle) {
	point(
		ctx,
		handle.position,
		handle.affects === "curve" ? "lime" : "green",
		handle.affects === "curve" ? 5 : 10,
	);
}

export function render(ctx: CanvasRenderingContext2D, roads: RoadType[]) {
	for (const road of roads) renderRoad(ctx, road);
	for (const handle of get(handles)) renderHandle(ctx, handle);
}
