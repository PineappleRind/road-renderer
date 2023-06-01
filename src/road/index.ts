import { get } from "svelte/store";
import type { Coordinate } from "../types/position";
import { render } from "./renderer";
import { roads } from "./store";
import creationWizard from "./creationWizard";
export default {
    create: (from?: Coordinate, to?: Coordinate) => {
        if (!from || !to) return creationWizard(from, to);
        roads.set([...get(roads), {
            from,
            to
        }])
    },
    render
}