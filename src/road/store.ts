import { get, writable } from "svelte/store";
import type { Road } from "../types/road";
export const roads = writable<Road[]>([]);

export function addRoadToStore(road: Road) {
	roads.update(items => ([...items, road]));
}
/**
 * Removes the road and its associated handles.
 * @param roadID The ID of the road to remove
 */
export function removeRoadFromStore(roadID: string) {
	roads.update(items => {
		let index = items.findIndex(r => r.id === roadID);
		items.splice(index, 1);
		return items;
	})
}

export function editRoad<T extends keyof Road>(roadID: string, key: T, value: Road[T]) {
	const roadIndex = get(roads).findIndex(r => r.id === roadID);
	if (roadIndex === -1) throw new Error(`Road ${roadID} not found`);
	roads.update(items => {
		let newRoad = items[roadIndex];
		newRoad[key] = value;
		items.splice(roadIndex, 1, newRoad);
		return items;
	})
}
