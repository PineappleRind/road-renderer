import { get } from "svelte/store";
import type { Coordinate } from "../types/position";
import creationWizard from "./creation";
import { handles } from "./handle";
import { render } from "./renderer";
import { roads } from "./store";

export default {
	create: (from?: Coordinate, to?: Coordinate) => {
		if (!from || !to) return creationWizard(from, to);
	},
	render,
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
};
