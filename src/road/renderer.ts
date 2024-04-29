import HANDLE from "@/config/handle";
import ROAD from "@/config/road";
import {
	type Interactable,
	type InteractableState,
	type InteractableType,
	editInteractable,
	getInteractable,
} from "@/events/interactables";
import { draggingPoint, handles } from "@/road/handle";
import { offsetPath as getOffsetPath } from "@/road/offsetCurve";
import { getRoad } from "@/road/store";
import type { Coordinate } from "@/types/position";
import type { Handle, Road } from "@/types/road";
import { bezier, point } from "@/utils/canvas";
import { distance } from "@/utils/position";
import { get } from "svelte/store";

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
	for (const road of roads) renderRoad(ctx, road);
	for (const handle of get(handles)) renderHandle(ctx, handle);
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

	const roadLinesCurve = [[road.from, road.curve, to]];

	const fillPath = combinePaths(offsetCurveA, offsetCurveB);
	const fillPath2D = bezier(ctx, fillPath, {
		color: getRoadFillColor(interactable?.state),
		action: "fill",
	});

	bezier(ctx, roadLinesCurve, {
		color: road.ghost ? ROAD.INNER_STROKE_GHOST : ROAD.INNER_STROKE,
		dashed: true,
	});
	bezier(ctx, offsetCurveA, {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});
	bezier(ctx, offsetCurveB, {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});

	if (!road.ghost) {
		// const fillPathWithHandles = addHandlePathsToPath(road.id, fillPath2D);
		try {
			editInteractable<"road", "bounds">(road.id, "bounds", fillPath2D);
		} catch (err) {}
	}
}

function combinePaths(path1: Coordinate[][], path2: Coordinate[][]) {
	const flatPath1 = path1;
	const flatPath2 = path2.toReversed().map((x) => x.toReversed());
	const joined = [
		...flatPath1,
		flatPath2.at(0)[0],
		...flatPath2,
		flatPath1[0][0],
	];

	return joined;
}

function getRoadFillColor(state: InteractableState) {
	switch (state) {
		case "idle":
			return "white";
		case "hover":
			return "#eeeeee";
		case "selected":
			return "#dddddd";
		default:
			return "white";
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
			handle.affects === "curve" ? HANDLE.COLOR_CURVE : HANDLE.COLOR_POSITION,
		radius:
			handle.affects === "curve" ? HANDLE.RADIUS_CURVE : HANDLE.RADIUS_POSITION,
	});
}
