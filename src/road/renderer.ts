import { get } from "svelte/store";
import { HandleState, type Handle, type Road } from "../types/road";
import { bezier, point } from "../utils/canvas";
import { handles } from "../road/handle";
import { catmullRomFitting } from "../utils/math";
import { offsetPath as getOffsetPath } from "./offsetCurve";
import { getRoad } from "./store";
import { editInteractable } from "../events/interactables";
import type { Coordinate } from "../types/position";

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

	const { a: roadLinesCurve } = getOffsetPath(road.from, road.curve, to, 0);

	const fillPath = combinePaths(offsetCurveA, offsetCurveB);

	bezier(ctx, roadLinesCurve, {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
		dashed: true,
	});
	bezier(ctx, offsetCurveA, {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});
	bezier(ctx, offsetCurveB, {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});
	let fillPath2D = bezier(ctx, fillPath, {
		color: "red",
		action: "fill",
	});
	if (!road.ghost) {
		try {
			editInteractable<"road", "bounds">(road.id, "bounds", fillPath2D);
		} catch (err) {

		}
	}
}

function combinePaths(path1: Coordinate[][], path2: Coordinate[][]) {
	let flatPath2 = path2.flat();
	flatPath2.reverse();
	let flatPath1 = path1.flat();
	let joined = [flatPath1, flatPath1.at(-1), flatPath2[0], flatPath2, flatPath1[0]];
	console.log(joined)
	return joined;
}

export function renderHandle(ctx: CanvasRenderingContext2D, handle: Handle) {
	point(ctx, handle.position, {
		color: handle.affects === "curve" ? "lime" : "green",
		radius: handle.affects === "curve" ? 5 : 10,
	});
}

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
	for (const road of roads) renderRoad(ctx, road);
	for (const handle of get(handles)) renderHandle(ctx, handle);
}
