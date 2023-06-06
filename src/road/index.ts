import { get } from "svelte/store";

import {
	deleteInteractable,
	getInteractableIndex,
} from "@/events/interactables";
import { interactableState } from "@/events/interactables";
import { render as renderScene } from "@/render";
import creationWizard from "@/road/creation";
import { handles } from "@/road/handle";
import { render as renderRoads } from "@/road/renderer";
import { getRoadIndex, roads } from "@/road/store";

import type { Coordinate } from "@/types/position";

export default {
	create: (from?: Coordinate, to?: Coordinate) => {
		if (!from || !to) return creationWizard(from, to);
	},
	render: renderRoads,
	find: (id: string) => {
		const found = get(roads).find((road) => id === road.id);
		if (!found) throw new Error("Oops! No road with that ID!");
		return found;
	},
	findHandle: (affects: string, parent: string) => {
		const found = get(handles).find(
			(handle) => affects === handle.affects && parent === handle.parent,
		);
		if (!found) return false;
		return found;
	},
	delete: (id: string) => {
		const roadIndex = getRoadIndex(id);
		if (roadIndex === false) return false;
		const interactableIndex = getInteractableIndex(id);
		deleteInteractable(interactableIndex);
		interactableState.update(() => ({ from: "selected", to: "idle", id }));
		roads.update((rds) => {
			rds.splice(roadIndex, 1);
			return rds;
		});
		renderScene();
	},
};
