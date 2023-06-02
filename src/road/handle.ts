import { derived, get, writable } from "svelte/store";
import { mouseState as mouseState } from "../events/store";
import { editRoad, roads } from "./store";
import type { Coordinate } from "../types/position";
import { HandleState, type Handle, type Road } from "../types/road";
import { distance } from "../utils/math";

export const handles = derived(roads, (roads) => getAllHandlesFromRoads(roads));

const RADIUS = 10;
let draggingPoint = writable<Handle | null>(null);
function getHandleCollisions(mousePos: Coordinate): Handle | null {
	let candidateHandles: Handle[] = [];
	// already dragging a point?
	// don't stop until mouseup
	if (get(draggingPoint) !== null) return get(draggingPoint);
	for (const handle of getAllHandlesFromRoads(get(roads))) {
		// if this handle doesn't intersect with the mouse, get rid of it
		if (!mouseIntersectsWith(mousePos, handle.position, RADIUS)) continue;
		// now put it as a candidate
		candidateHandles.push(handle);
	}
	// the handle's center is the one that the mouse is closest to
	candidateHandles.sort((a, b) =>
		distance(a.position, mousePos) > distance(b.position, mousePos) ? 1 : -1,
	);
	// we have a point!
	draggingPoint.set(candidateHandles[0]);
	return candidateHandles[0];
}

function mouseIntersectsWith(
	mousePos: Coordinate,
	point: Coordinate,
	radius: number,
): boolean {
	return (
		mousePos.x > point.x - radius &&
		mousePos.y > point.y - radius &&
		mousePos.x < point.x + radius &&
		mousePos.y < point.y + radius
	);
}

export function getAllHandlesFromRoads(aea: Road[]) {
	let handles: Handle[] = [];
	for (const road of aea) {
		handles.push(
			{
				position: road.from,
				affects: "from",
				parent: road.id,
			},
			{
				position: road.to,
				affects: "to",
				parent: road.id,
			},
			{
				position: road.curve,
				affects: "curve",
				parent: road.id,
			},
		);
	}
	return handles;
}

function handleMovement(handle: Handle, coordinate: Coordinate) {
	let parent = get(roads).find((x) => x.id === handle.parent);
	if (!parent) throw new Error("No parent");
	editRoad(parent.id, handle.affects, coordinate);
}

function findHandleIndexInStore(handle: Handle) {
	let found = get(handles).findIndex(
		(h) => h.affects === handle.affects && h.parent === handle.parent,
	);
	if (found === -1) return null;
	return found;
}

mouseState.subscribe((pos) => {
	if (pos.down) {
		const activeHandle = getHandleCollisions(pos);
		if (!activeHandle) return draggingPoint.set(null);
		handleMovement(activeHandle, pos);
	}
	// if the user *just* released the mouse button
	else if (get(draggingPoint)) draggingPoint.set(null);
});

let lastPoint: Handle | null = null;
draggingPoint.subscribe((newPoint) => {
	if (lastPoint) lastPoint.state = HandleState.Inactive;
	if (newPoint) {
		newPoint.state = HandleState.Dragging;
		lastPoint = null;
	}
});
