import { get } from "svelte/store";
import {
	createMouseFollower,
	destroyMouseFollower,
} from "../components/MouseFollower";
import { registerInteractable } from "../events/interactables";
import { mouseState } from "../events/store";
import type { Coordinate } from "../types/position";
import { generateID } from "../utils/road";
import { Vector } from "../utils/vector";
import { addRoadToStore, editRoad } from "./store";

export default async function creationWizard(
	from?: Coordinate,
	to?: Coordinate,
) {
	const roadID = `road-${generateID()}`;
	if (!from)
		from = await getUserMouseInput("Choose a start point for your road");

	if (!to) {
		createRoad(from, get(mouseState), roadID, true);
		const unsubscribe = mouseState.subscribe(({ x, y }) => {
			editRoad(roadID, "to", { x, y });
			editRoad(roadID, "curve", halfway(from, { x, y }));
		});
		to = await getUserMouseInput("Choose an end point");

		unsubscribe();
		editRoad(roadID, "ghost", false);
	} else createRoad(from, to, roadID);

	registerInteractable<"road">({
		bounds: null,
		type: "road",
		id: roadID,
		state: "selected",
	});

	destroyMouseFollower();
}
/**
 * Prompts the user to click somewhere and gets the position
 */
async function getUserMouseInput(prompt: string): Promise<Coordinate> {
	createMouseFollower(prompt);
	let resolveCache: (m: MouseEvent) => void;
	const e: MouseEvent = await new Promise((resolve) => {
		resolveCache = resolve;
		document.addEventListener("click", resolve);
	});
	document.removeEventListener("click", resolveCache);
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

const halfway = (from: Coordinate, to: Coordinate) =>
	new Vector(from.x, from.y).lerp(new Vector(to.x, to.y), 0.5).asCoordinate();
