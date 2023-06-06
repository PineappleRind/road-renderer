import { get } from "svelte/store";

import {
	createMouseFollower,
	destroyMouseFollower,
} from "@/components/MouseFollower";
import { ROAD_MIN_LENGTH } from "@/config/road";
import { registerInteractable } from "@/events/interactables";
import { mouseState } from "@/events/store";
import { addRoadToStore, editRoad } from "@/road/store";
import { distance, halfway } from "@/utils/position";
import { generateID } from "@/utils/road";

import type { Coordinate } from "@/types/position";

export default async function creationWizard(
	from: Coordinate | undefined,
	to: Coordinate | undefined,
) {
	const roadID = `road-${generateID()}`;
	if (!from)
		from = await getUserMouseInput("Choose a start point for your road");

	if (!to) {
		// Create a ghost road that will be edited when mouse position changes
		addRoadToStore({
			from,
			to: get(mouseState),
			id: roadID,
			ghost: true,
		});

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
		addRoadToStore({ from, to, id: roadID });
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
