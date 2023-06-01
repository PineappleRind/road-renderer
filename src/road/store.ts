import { get, writable } from "svelte/store";
import type { Road } from "../types/road";

export const roads = writable<Road[]>([]);

export function addRoad(road: Road) {
	let $roads = get(roads);
	$roads.push(road);
	roads.set($roads);
}

export function editRoad() {}
