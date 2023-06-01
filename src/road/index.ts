import { get } from "svelte/store";
import type { Coordinate } from "../types/position";
import { render } from "./renderer";
import { roads } from "./store";
export default {
    create: (from: Coordinate, to: Coordinate) => {
        roads.set([...get(roads), {
            from,
            to
        }])
    },
    render
}