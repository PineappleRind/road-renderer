import { get } from "svelte/store";
import { HandleState, type Handle, type Road } from "../types/road";
import { path, point } from "../utils/canvas";
import { handles } from "../road/handle";
import { catmullRomFitting } from "../utils/math";
import { offsetPath as getOffsetPath } from "./offsetCurve";
import { getRoad } from "./store";
import { editInteractable } from "../events/interactables";

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

	const { a: roadLinesCurve } = getOffsetPath(road.from, road.curve, to, 0);
	const roadLinesPath = offsetPathToSVGPath(roadLinesCurve);

	const fillPath = combinePaths(offsetPathA, offsetPathB);

	path(ctx, new Path2D(roadLinesPath), {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
		dashed: true,
	});
	path(ctx, new Path2D(offsetPathA), {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});
	path(ctx, new Path2D(offsetPathB), {
		color: road.ghost ? "hsla(0,0%,0%,0.2)" : "black",
	});
	let fillPath2D =  new Path2D(fillPath);
	path(ctx, fillPath2D, {
		color: "red",
		action: "stroke",
	});
	if (!road.ghost) {
		try {
			editInteractable<"road", "bounds">(road.id, "bounds", fillPath2D);
		} catch(err) {

		}
	}
}

function offsetPathToSVGPath(offsetPath: number[][][]) {
	return `M${offsetPath[0][0].flat().map(Math.floor)} ${offsetPath.map(
		(n) => `C${n.map((m) => m.map(Math.floor)).join(" ")}`,
	)}`;
}

function combinePaths(path1: string, path2: string) {
	// A bunch of string shenanigans, manipulates it to shreds!!!!!!!!!!!!!!!!!!!
	// not exactly the most dynamic but hey it works with what offsetPath outputs

	// assumes path1 and path2 are `M0,0 C0,0 0,0 0,0`
	let path1Split = path1.split(" ");
	let path2Split = path2.split(" ");

	const reversedPath2CurvePoints = path2.split("C")[1].split(" ");
	reversedPath2CurvePoints.reverse();
	// console.log(reversedPath2CurvePoints, path2);
	const joinedPaths = `${path2Split[0]} L${path1Split[0].slice(
		1,
	)} ${path1.slice(1)} L${path2Split.at(-1)} C${reversedPath2CurvePoints}`;
	// console.log(joinedPaths);
	return joinedPaths;
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
