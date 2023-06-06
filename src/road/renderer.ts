import { get } from "svelte/store";
import {
	HANDLE_CURVE_COLOR,
	HANDLE_POSITION_COLOR,
	HANDLE_POSITION_RADIUS,
	HANDLE_CURVE_RADIUS,
} from "@/config/handle";
import { ROAD_FILL, ROAD_FILL_HOVER, ROAD_FILL_SELECTED } from "@/config/road";

import {
	editInteractable,
	getInteractable,
	type InteractableState,
} from "@/events/interactables";
import { offsetPath as getOffsetPath } from "@/road/offsetCurve";
import { addHandlePathsToPath, handles } from "@/road/handle";
import { getRoad } from "@/road/store";
import { type Handle, type Road } from "@/types/road";
import type { Coordinate } from "@/types/position";
import { bezier, point } from "@/utils/canvas";

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
	for (const road of roads) renderRoad(ctx, road);
	for (const handle of get(handles)) renderHandle(ctx, handle);
}

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	let interactable;
	try {
		interactable = getInteractable(road.id);
	} catch (e) {}

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
		color: getRoadFillColor(interactable?.state),
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
		const fillPathWithHandles = addHandlePathsToPath(road.id, fillPath2D);
		try {
			editInteractable<"road", "bounds">(
				road.id,
				"bounds",
				new Path2D(fillPathWithHandles),
			);
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

function getRoadFillColor(state: InteractableState) {
	switch (state) {
		case "hover":
			return ROAD_FILL_HOVER;
		case "selected":
			return ROAD_FILL_SELECTED;
		default:
			return ROAD_FILL;
	}
}

export function renderHandle(ctx: CanvasRenderingContext2D, handle: Handle) {
	try {
		let parent = getInteractable(handle.parent);
		if (parent && parent.state !== "selected") return;
	} catch (e) {
		console.error(e);
	}

	point(ctx, handle.position, {
		color:
			handle.affects === "curve" ? HANDLE_CURVE_COLOR : HANDLE_POSITION_COLOR,
		radius:
			handle.affects === "curve" ? HANDLE_CURVE_RADIUS : HANDLE_POSITION_RADIUS,
	});
}
