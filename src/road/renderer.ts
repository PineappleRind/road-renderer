import { get } from "svelte/store";

import {
	HANDLE_COLOR_CURVE,
	HANDLE_COLOR_POSITION,
	HANDLE_RADIUS_CURVE,
	HANDLE_RADIUS_POSITION,
} from "@/config/handle";
import {
	ROAD_FILL,
	ROAD_FILL_HOVER,
	ROAD_FILL_SELECTED,
	ROAD_INNER_STROKE,
	ROAD_INNER_STROKE_GHOST,
	ROAD_OUTER_STROKE,
	ROAD_OUTER_STROKE_GHOST,
} from "@/config/road";
import {
	type Interactable,
	type InteractableState,
	type InteractableType,
	editInteractable,
	getInteractable,
} from "@/events/interactables";
import { addHandlePathsToPath, draggingPoint, handles } from "@/road/handle";
import { offsetPath as getOffsetPath } from "@/road/offsetCurve";
import { getRoad, roads } from "@/road/store";
import { bezier, point } from "@/utils/canvas";

import type { Coordinate } from "@/types/position";
import { type Handle, type Road } from "@/types/road";
import { distance } from "@/utils/position";
import { ctx } from "@/render";

export function render() {
	const ctx$ = get(ctx);
	for (const road of get(roads)) renderRoad(ctx$, road);
	for (const handle of get(handles)) renderHandle(ctx$, handle);
}

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	let interactable: Interactable<InteractableType>;
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
		color: road.ghost ? ROAD_INNER_STROKE_GHOST : ROAD_INNER_STROKE,
		dashed: true,
	});
	bezier(ctx, offsetCurveA, {
		color: road.ghost ? ROAD_OUTER_STROKE_GHOST : ROAD_OUTER_STROKE,
	});
	bezier(ctx, offsetCurveB, {
		color: road.ghost ? ROAD_INNER_STROKE_GHOST : ROAD_INNER_STROKE,
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
		const parent = getInteractable(handle.parent);
		const isDraggingPoint = get(draggingPoint);
		// If the road is selected or it's in the process of being created
		const parentIsSelected = !parent || (parent && parent.state === "selected");
		// Only render if:
		// — the handle is part of a road that is selected.
		// — the user is dragging a point relatively close to another
		// 	  position point, and this handle is a position handle. that
		// 	  will hopefully show the user that they can drop the currently
		// 	  selected handle onto the handle we're currently rendering
		const potentialRoadConnection =
			isDraggingPoint &&
			isDraggingPoint.affects !== "curve" &&
			handle.affects !== "curve" &&
			distance(isDraggingPoint.position, handle.position) < 200;
		const shouldRender = parentIsSelected || potentialRoadConnection;
		if (!shouldRender) return;
	} catch (e) {
		console.error(e);
	}

	point(ctx, handle.position, {
		color:
			handle.affects === "curve" ? HANDLE_COLOR_CURVE : HANDLE_COLOR_POSITION,
		radius:
			handle.affects === "curve" ? HANDLE_RADIUS_CURVE : HANDLE_RADIUS_POSITION,
	});
}
