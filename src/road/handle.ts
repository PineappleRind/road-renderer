import { derived, get, writable, type Writable } from "svelte/store";
import { mouseState } from "../events/store";
import { editRoad, getRoad, reverseRoad, roads } from "./store";
import type { Coordinate } from "../types/position";
import { HandleState, type Handle, type Road as RoadType } from "../types/road";
import { distance } from "../utils/math";
import {
	createMouseFollower,
	destroyMouseFollower,
} from "../components/MouseFollower";
import Road from ".";

export const handles = derived(roads, (roads) => getAllHandlesFromRoads(roads));

const RADIUS = 10;
const draggingPoint = writable<Handle | null>(null);
/** A road ID that we may connect to on mouseup */
let potentialRoadConnectionHandle: Handle | null = null;
function getHandleCollisions(mousePos: Coordinate): Handle | null {
	const candidateHandles: Handle[] = [];
	// If we're dragging a point, we're still going to loop through and find
	// candidates, because we'll use them to determine potential connections
	for (const handle of get(handles)) {
		// if this handle doesn't intersect with the mouse, get rid of it
		if (!mouseIntersectsWith(mousePos, handle.position, RADIUS)) continue;
		// now put it as a candidate
		candidateHandles.push(handle);
	}
	// the handle's center is the one that the mouse is closest to
	candidateHandles.sort((a, b) =>
		distance(a.position, mousePos) > distance(b.position, mousePos) ? 1 : -1,
	);
	// already dragging a point?
	if (get(draggingPoint) !== null) {
		// update its position
		draggingPoint.set({
			...get(draggingPoint),
			position: mousePos,
		});
		console.log(candidateHandles);
		// if we're dragging a point on top of another point..
		if (validConnection(candidateHandles)) {
			createMouseFollower("Let go to connect with this road");
			potentialRoadConnectionHandle = candidateHandles[1];
		} else destroyMouseFollower();
		return get(draggingPoint);
	}
	// we have a point!
	draggingPoint.set(candidateHandles[0]);
	return candidateHandles[0];
}

function validConnection(candidateHandles: Handle[]) {
	return (
		candidateHandles.length === 2 &&
		!candidateHandles.find((handle) => handle.affects === "curve") &&
		candidateHandles[0].parent !== candidateHandles[1].parent
	);
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
/**
 * If a handle has already been generated from these roads' from property,
 * skip adding the `from` handle for that road, since we already have one.
 * This means that there's a road connection. We don't want a duplicate...
 */
const resolvedRoads: string[] = [];
export function getAllHandlesFromRoads(roads: RoadType[]) {
	const roadHandles: Handle[] = [];
	for (const road of roads) {
		roadHandles.push({
			position: road.curve,
			affects: "curve",
			parent: road.id,
		});
		if (!resolvedRoads.includes(road.id))
			roadHandles.push({
				position: road.from,
				affects: "from",
				parent: road.id,
			});
		if (typeof road.to !== "string")
			roadHandles.push({
				position: road.to,
				affects: "to",
				parent: road.id,
			});
		// at this point road.to must be an unresolved road ID
		else
			roadHandles.push({
				position: resolveRoadHandle(road.to).from,
				affects: "to",
				parent: road.id,
			});
	}
	return roadHandles;
}

function resolveRoadHandle(mysteriousRoadID: string): RoadType {
	const found = Road.find(mysteriousRoadID);
	resolvedRoads.push(found.id);
	return found;
}

function handleMovement(handle: Handle, coordinate: Coordinate) {
	const parent = get(roads).find((x) => x.id === handle.parent);
	if (!parent) throw new Error("No parent");
	// Limit curve movement to a bounding box
	// if (handle.affects === "curve") {
	// 	let to = parent.to;
	// 	if (typeof parent.to === "string") to = Road.find(parent.to).to;
	// 	const boundingBox = {
	// 		minX: Math.min(parent.from.x, (to as Coordinate).x),
	// 		minY: Math.min(parent.from.y, (to as Coordinate).y),
	// 		maxX: Math.max(parent.from.x, (to as Coordinate).x),
	// 		maxY: Math.max(parent.from.y, (to as Coordinate).y),
	// 	};
	// 	if (coordinate.x < boundingBox.minX) coordinate.x = boundingBox.minX;
	// 	if (coordinate.y < boundingBox.minY) coordinate.y = boundingBox.minY;
	// 	if (coordinate.x > boundingBox.maxX) coordinate.x = boundingBox.maxX;
	// 	if (coordinate.y > boundingBox.maxY) coordinate.y = boundingBox.maxY;
	// }
	if (typeof parent.to !== "string")
		editRoad(parent.id, handle.affects, coordinate);
	else editRoad(parent.to, "from", coordinate);
}

mouseState.subscribe((pos) => {
	if (pos.down) {
		const activeHandle = getHandleCollisions(pos);

		// if we are not dragging a handle anymore
		if (!activeHandle) return draggingPoint.set(null);
		// if the road is a ghost
		if (get(roads)[getRoad(activeHandle.parent, true) as number].ghost) return;
		handleMovement(activeHandle, pos);
	} else if (potentialRoadConnectionHandle && !pos.down && get(draggingPoint)) {
		// if we are connecting with a road
		connect(get(draggingPoint), potentialRoadConnectionHandle);
		destroyMouseFollower();
	} else draggingPoint.set(null);
});

function connect(beingDragged: Handle, target: Handle) {
	const [beingDraggedRoad, targetRoad] = [beingDragged, target].map((handle) =>
		Road.find(handle?.parent),
	);
	// If they are already connected, don't connect them
	if (
		typeof beingDraggedRoad.to === "string" ||
		typeof targetRoad.to === "string"
	)
		return draggingPoint.set(null);
	// If they are part of the same road, don't connect them
	if (beingDragged.affects === "from") reverseRoad(beingDraggedRoad.id);
	if (target.affects === "to") reverseRoad(targetRoad.id);
	console.log(target.position, beingDragged.position);
	editRoad(beingDraggedRoad.id, "to", targetRoad.id);
	draggingPoint.set(null);
}

let lastPoint: Handle | null = null;
draggingPoint.subscribe((newPoint) => {
	if (lastPoint) lastPoint.state = HandleState.Inactive;
	if (newPoint) {
		newPoint.state = HandleState.Dragging;
		lastPoint = null;
	}
});
