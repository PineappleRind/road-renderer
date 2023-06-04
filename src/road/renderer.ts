import { get } from "svelte/store";
import { type Handle, type Road } from "../types/road";
import { bezier, point } from "../utils/canvas";
import { handles } from "../road/handle";
import { offsetPath as getOffsetPath } from "./offsetCurve";
import { getRoad } from "./store";
import { editInteractable, getInteractable } from "../events/interactables";
import type { Coordinate } from "../types/position";

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	let interactable;
	try {
		interactable = getInteractable(road.id);
	} catch (e) {}
	console.log(interactable);

	const to =
		typeof road.to === "string"
			? (getRoad(road.to, true) as Road).from
			: road.to;

	const { a: offsetCurveA, b: offsetCurveB } = getOffsetPath(
		road.from,
		road.curve,
		to,
		30,
	);

	const { a: roadLinesCurve } = getOffsetPath(road.from, road.curve, to, 0);

	const fillPath = combinePaths(offsetCurveA, offsetCurveB);
	const fillPath2D = bezier(ctx, fillPath, {
		color: interactable?.state === "hover" ? "#eeeeee" : "white",
		action: "fill",
	});
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

	if (!road.ghost) {
		try {
			editInteractable<"road", "bounds">(road.id, "bounds", fillPath2D);
		} catch (err) {}
	}
	// console.log(fillPath);
}

function combinePaths(path1: Coordinate[][], path2: Coordinate[][]) {
	const flatPath2 = path2.flat();
	flatPath2.reverse();
	const flatPath1 = path1.flat();
	const joined = [
		flatPath1,
		flatPath1.at(-1),
		flatPath2[0],
		flatPath2,
		flatPath1[0],
	];
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
