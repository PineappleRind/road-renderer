import { get } from "svelte/store";
import {
	createMouseFollower,
	destroyMouseFollower,
} from "@/components/MouseFollower";
import { mouseState } from "@/events/store";
import { registerInteractable } from "@/events/interactables";
import { addRoadToStore, editRoad } from "@/road/store";
import type { Coordinate } from "@/types/position";
import { generateID } from "@/utils/road";
import { distance } from "@/utils/distance";
import { ROAD_MIN_LENGTH } from "@/config/road";

export default async function creationWizard(
	from: Coordinate | undefined,
	to: Coordinate | undefined,
) {
	const roadID = `road-${generateID()}`;
	if (!from)
		from = await getUserMouseInput("Choose a start point for your road");

	if (!to) {
		// Create a ghost road that will be edited when mouse position changes
		createRoad(from, get(mouseState), roadID, true);

		async function getRoadEndpoint(message?: string) {
			// Start editing the road position on mouse move
			const unsubscribe = mouseState.subscribe(({ x, y }) => {
				editRoad(roadID, "to", { x, y });
				editRoad(roadID, "curve", halfway(from, { x, y }));
			});
			to = await getUserMouseInput(message || "Choose an end point");
			// Stop editing the road position on mouse move
			unsubscribe();
			if (distance(from, to) < ROAD_MIN_LENGTH)
				return await getRoadEndpoint(
					"Road too short — choose a different end point",
				);
		}
		await getRoadEndpoint();

		// Set the road in stone
		editRoad(roadID, "ghost", false);
	} else {
		// If an endpoint is already specified, create the road then and there
		createRoad(from, to, roadID);
	}

	registerInteractable<"road">({
		bounds: null,
		type: "road",
		id: roadID,
		state: "selected",
	});
}
/**
 * Prompts the user to click somewhere and gets the position
 */
async function getUserMouseInput(prompt: string): Promise<Coordinate> {
	createMouseFollower(prompt);
	let resolveCache: (value: MouseEvent | PromiseLike<MouseEvent>) => void;
	const e: MouseEvent = await new Promise((resolve) => {
		resolveCache = resolve;
		document.addEventListener("click", resolve);
	});
	document.removeEventListener("click", resolveCache);
	destroyMouseFollower();
	return { x: e.clientX, y: e.clientY };
}

function createRoad(
	from: Coordinate,
	to: Coordinate,
	roadID: string,
	ghost = false,
) {
	addRoadToStore({
		from,
		to,
		curve: halfway(from, to),
		id: roadID,
		ghost,
	});
}

function halfway(from: Coordinate, to: Coordinate): Coordinate {
	const lerp = (a: number, b: number, t: number) => a + t * (b - a);
	return { x: lerp(from.x, to.x, 0.5), y: lerp(from.y, to.y, 0.5) };
}
