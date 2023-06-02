import { get } from "svelte/store";
import {
	createMouseFollower,
	destroyMouseFollower,
} from "../components/MouseFollower";
import type { Coordinate } from "../types/position";
import { addRoadToStore, editRoad, removeRoadFromStore, roads } from "./store";
import { mouseState } from "../events/store";
import { lerp } from "../utils/math";

export default async function creationWizard(
	from: Coordinate | undefined,
	to: Coordinate | undefined,
) {
	if (!from)
		from = await getUserMouseInput("Choose a start point for your road");

	if (!to) {
		createRoad(from, get(mouseState), "road-GHOST", true);
		const unsubscribe = mouseState.subscribe((pos) => {
			editRoad("road-GHOST", "to", pos);
			editRoad("road-GHOST", "curve", halfway(from, pos));
		});
		to = await getUserMouseInput("Choose an end point");
		removeRoadFromStore("road-GHOST");
		unsubscribe();
	}
	const roadID = `road-${generateRoadID()}`;
	createRoad(from, to, roadID);

	destroyMouseFollower();
}
/**
 * Prompts the user to click somewhere and gets the position
 */
async function getUserMouseInput(prompt: string): Promise<Coordinate> {
	createMouseFollower(prompt);
	let resolveCache;
	const e: MouseEvent = await new Promise((resolve) => {
		resolveCache = resolve;
		document.addEventListener("click", resolve);
	});
	document.removeEventListener("click", resolveCache);
	return { x: e.clientX, y: e.clientY };
}

function generateRoadID() {
	return Math.round(Math.random() * 2 ** 32)
		.toString(16)
		.padStart(8, "0");
}

function createRoad(
	from: Coordinate,
	to: Coordinate,
	roadID: string,
	ghost: boolean = false,
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
	return { x: lerp(from.x, to.x, 0.5), y: lerp(from.y, to.y, 0.5) };
}
