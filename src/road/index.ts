import type { Coordinate } from "../types/position";
import { render } from "./renderer";
import creationWizard from "./creation";

export default {
	create: (from?: Coordinate, to?: Coordinate) => {
		if (!from || !to) return creationWizard(from, to);
	},
	render,
};
