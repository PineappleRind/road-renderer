import { get } from "svelte/store";
import { HandleState, type Handle, type Road } from "../types/road";
import { path, point } from "../utils/canvas";
import { handles } from "../road/handle";
import { catmullRomFitting } from "../utils/math";
import { offsetPath as getOffsetPath } from "./offsetCurve";
import { getRoad } from "./store";

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	const to =
		typeof road.to === "string"
			? (getRoad(road.to, true) as Road).from
			: road.to;
	// // Get 
	// const { curves } = catmullRomFitting([
	// 	road.from,
	// 	road.curve,
	// 	to,
	// ]);

	const { a: offsetCurveA, b: offsetCurveB } = getOffsetPath(
		road.from,
		road.curve,
		to,
		30,
	);
	const offsetPathA = offsetPathToSVGPath(offsetCurveA);
	const offsetPathB = offsetPathToSVGPath(offsetCurveB);

	const { a: roadLinesCurve } = getOffsetPath(
		road.from,
		road.curve,
		to,
		0,
	);
	const roadLinesPath = offsetPathToSVGPath(roadLinesCurve);

	path(
		ctx,
		new Path2D(roadLinesPath),
		road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
		undefined,
		true,
	);
	path(
		ctx,
		new Path2D(offsetPathA),
		road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	);
	path(
		ctx,
		new Path2D(offsetPathB),
		road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	);
}

function offsetPathToSVGPath(offsetPath: number[][][]) {
	return `M${offsetPath[0][0].flat()} ${offsetPath.map(
		(n) => `C${n.map((m) => m.map(Math.floor))}`,
	)}`;
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
