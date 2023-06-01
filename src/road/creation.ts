import { get } from "svelte/store";
import {
	createMouseFollower,
	destroyMouseFollower,
} from "../components/MouseFollower";
import type { Coordinate } from "../types/position";
import { addRoad } from "./store";

export default async function creationWizard(
	from: Coordinate | undefined,
	to: Coordinate | undefined,
) {
	if (!from)
		from = await getUserMouseInput("Choose a start point for your road");

	if (!to) to = await getUserMouseInput("Choose an end point");
	addRoad({
		from,
		to,
		id: `road-${generateRoadID()}`,
	});

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
