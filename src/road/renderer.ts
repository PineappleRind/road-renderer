import { get } from "svelte/store";
import {
	type Interactable,
	type InteractableState,
	type InteractableType,
	editInteractable,
	getInteractable,
} from "../events/interactables";
import { handles } from "../road/handle";
import type { Coordinate } from "../types/position";
import type { Handle, Road } from "../types/road";
import { bezier, point } from "../utils/canvas";
import { offsetPath as getOffsetPath } from "./offsetCurve";
import { getRoad } from "./store";

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
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
		dashed: true,
	});
	bezier(ctx, offsetCurveA, {
		color: "red", // road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});
	bezier(ctx, offsetCurveB, {
		color: "blue", // road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});

	if (!road.ghost) {
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
	// try {
	// 	let parent = getInteractable(handle.parent);
	// 	if (parent && parent.state !== "selected") return;
	// } catch(e) {
	// 	console.error(e)
	// }

	point(ctx, handle.position, {
		color: handle.affects === "curve" ? "lime" : "green",
		radius: handle.affects === "curve" ? 5 : 10,
	});
}
