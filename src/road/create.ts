import { get } from "svelte/store";

import { mouseFollower } from "@/components/MouseFollower";
import ROAD from "@/config/road";
import { registerInteractable } from "@/events/interactables";
import { mouseState } from "@/events/store";
import { addRoadToStore, editRoad } from "@/road/store";
import { distance, halfway } from "@/utils/position";
import { generateID } from "@/utils/road";

import type { Coordinate } from "@/types/position";
import type { Road } from "@/types/road";

/**
 * Creates a road from `from` to `to`. If either is undefined,
 * prompts the user to click somewhere, obtaining a Coordinate.
 * @param from Start point of the road.
 * @param to Endpoint of the road.
 */
export async function createRoad(from?: Coordinate, to?: Coordinate) {
	const newRoad: Road = {
		id: `road-${generateID()}`,
		from,
		to,
	} as Road;
	if (!newRoad.from)
		newRoad.from = await getUserMouseInput(
			"Choose a start point for your road",
		);

	if (!newRoad.to) {
		// Create a ghost road that will be edited when mouse position changes
		// Yes, I'm using Object.assign because it's a const.
		// "Then why not make it a `let`?!?!!" you ask too many questions.
		Object.assign(newRoad, {
			to: get(mouseState),
			ghost: true,
		});
		addRoadToStore(newRoad);

		// Functionality wrapped in a function so we can recurse
		async function getRoadEndpoint(message?: string) {
			// Start editing the road position on mouse move
			const unsubscribe = mouseState.subscribe(({ x, y }) => {
				editRoad(newRoad.id, "to", { x, y });
				editRoad(newRoad.id, "curve", halfway(from, { x, y }));
			});
			newRoad.to = await getUserMouseInput(message || "Choose an end point");
			// Stop editing the road position on mouse move
			unsubscribe();
			if (distance(newRoad.from, newRoad.to) < ROAD.MIN_LENGTH)
				return await getRoadEndpoint(
					"Road too short — choose a different end point",
				);
		}
		await getRoadEndpoint();
		// Set the road in stone
		editRoad(newRoad.id, "ghost", false);
	} else {
		// If an endpoint is already specified, create the road then and there
		addRoadToStore(newRoad);
	}

	registerInteractable<"road">({
		bounds: null,
		type: "road",
		id: newRoad.id,
		state: "selected",
	});
}
/**
 * Prompts the user to click somewhere and gets the position
 */
async function getUserMouseInput(prompt: string): Promise<Coordinate> {
	mouseFollower.create(prompt);
	let resolveCache: (value: MouseEvent | PromiseLike<MouseEvent>) => void;
	const e: MouseEvent = await new Promise((resolve) => {
		resolveCache = resolve;
		// This automatically passes the MouseEvent to `resolve`
		document.addEventListener("click", resolve);
	});
	document.removeEventListener("click", resolveCache);
	mouseFollower.destroy();
	return { x: e.clientX, y: e.clientY };
}
