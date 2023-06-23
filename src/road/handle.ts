import { derived, get, writable } from "svelte/store";

import {
	createMouseFollower,
	destroyMouseFollower,
} from "@/components/MouseFollower";
import { HANDLE_RADIUS_CURVE, HANDLE_RADIUS_POSITION } from "@/config/handle";
import { getInteractable } from "@/events/interactables";
import { mouseState } from "@/events/store";
import {
	editRoad,
	getRoad,
	getRoadIndex,
	reverseRoad,
	roads,
} from "@/road/store";

import type { Coordinate } from "@/types/position";
import { type Handle, type Road as RoadType } from "@/types/road";
import { mouseFollowerOpen } from "@/components/MouseFollower.svelte";

export const handles = derived(roads, (roads) => getAllHandlesFromRoads(roads));

const distance = (p1: Coordinate, p2: Coordinate) =>
	Math.hypot(p2.x - p1.x, p2.y - p1.y);
/** The point that the user is currently dragging */
export const draggingPoint = writable<Handle | null>(null);
/** A road ID that we may connect to on mouseup */
let potentialRoadConnectionHandle: Handle | null = null;
function getHandleCollisions(mousePos: Coordinate): Handle | null {
	const candidateHandles: Handle[] = [];
	// If we're dragging a point, we're still going to loop through and find
	// candidates, because we'll use them to determine potential connections
	for (const handle of get(handles)) {
		const parentInteractable = getInteractable(handle.parent);
		const $draggingPoint = get(draggingPoint);
		// if this handle doesn't intersect with the mouse, get rid of it
		if (
			!mouseIntersectsWith(
				mousePos,
				handle.position,
				handle.affects === "curve"
					? HANDLE_RADIUS_CURVE
					: HANDLE_RADIUS_POSITION,
			)
		)
			continue;
		// ignore this handle if the parent isn't selected
		// console.log(parentInteractable?.state);
		if (parentInteractable && parentInteractable.state !== "selected") continue;

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
		// if we're dragging a point on top of another point..
		if (validConnection(candidateHandles)) {
			if (!mouseFollowerOpen)
				createMouseFollower("Let go to connect with this road");
			potentialRoadConnectionHandle = candidateHandles[1];
		} else {
			destroyMouseFollower();
			potentialRoadConnectionHandle = null;
		}
		return get(draggingPoint);
	}
	// we have a point!
	draggingPoint.set(candidateHandles[0]);
	return candidateHandles[0];
}

function validConnection(candidateHandles: Handle[]) {
	const [drageeRoad, targetRoad] = candidateHandles.map(
		(handle) => getRoad(handle.parent, true) as RoadType,
	);

	return (
		candidateHandles.length === 2 &&
		!candidateHandles.find((handle) => handle.affects === "curve") &&
		candidateHandles[0].parent !== candidateHandles[1].parent &&
		typeof drageeRoad.to !== "string" &&
		typeof targetRoad.to !== "string"
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
				position: (getRoad(road.to, true) as RoadType).from,
				affects: "to",
				parent: road.id,
			});
	}
	return roadHandles;
}

function handleMovement(handle: Handle, coordinate: Coordinate) {
	const parent = getRoad(handle.parent, true) as RoadType;

	if (typeof parent.to !== "string")
		editRoad(parent.id, handle.affects, coordinate);
	else editRoad(parent.to, "from", coordinate);
}

function connect(beingDragged: Handle, target: Handle) {
	const [beingDraggedRoad, targetRoad] = [beingDragged, target].map(
		(handle) => getRoad(handle?.parent, true) as RoadType,
	);
	if (beingDragged.affects === "from") reverseRoad(beingDraggedRoad.id);
	if (target.affects === "to") reverseRoad(targetRoad.id);
	editRoad(beingDraggedRoad.id, "to", targetRoad.id);
	draggingPoint.set(null);
}

export function addHandlePathsToPath(roadID: string, path: Path2D) {
	const roadHandles = get(handles).filter((handle) => handle.parent === roadID);
	for (const handle of roadHandles) {
		path.arc(
			handle.position.x,
			handle.position.y,
			handle.affects === "curve" ? HANDLE_RADIUS_CURVE : HANDLE_RADIUS_POSITION,
			0,
			2 * Math.PI,
		);
	}
	return path;
}

mouseState.subscribe((pos) => {
	if (potentialRoadConnectionHandle && !pos.down && get(draggingPoint)) {
		// if we are connecting with a road
		connect(get(draggingPoint), potentialRoadConnectionHandle);
		destroyMouseFollower();
	}
	if (!pos.down) {
		draggingPoint.set(null);
	} else if (pos.down) {
		const activeHandle = getHandleCollisions(pos);

		// if we are not dragging a handle anymore
		if (!activeHandle) return draggingPoint.set(null);
		// if the road is a ghost
		if (get(roads)[getRoadIndex(activeHandle.parent, true) as number].ghost)
			return;
		handleMovement(activeHandle, pos);
	}
});
