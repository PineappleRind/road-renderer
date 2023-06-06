import { get, writable } from "svelte/store";
import type { Road } from "@/types/road";

export const roads = writable<Road[]>([]);

export function addRoadToStore(road: Road) {
	roads.update((items) => [...items, road]);
}
/**
 * Removes the road and its associated handles.
 * @param roadID The ID of the road to remove
 */
export function removeRoadFromStore(roadID: string) {
	roads.update((items) => {
		const index = items.findIndex((r) => r.id === roadID);
		items.splice(index, 1);
		return items;
	});
}
/**
 * @param loud Be fussy and throw an error if the road is not found
 */
export function getRoad(roadID: string, loud?: boolean) {
	const index = getRoadIndex(roadID, loud);
	if (index === false) return false;
	return get(roads)[index];
}
export function getRoadIndex(roadID: string, loud?: boolean) {
	const roadIndex = get(roads).findIndex((r) => r.id === roadID);
	if (roadIndex === -1) {
		if (loud) throw new Error("Could not find road");
		else return false;
	}
	return roadIndex;
}
export function editRoad<T extends keyof Road>(
	roadID: string,
	key: T,
	value: Road[T],
) {
	const roadIndex = getRoadIndex(roadID, true);
	if (roadIndex === false) return null;
	roads.update((items) => {
		const newRoad = items[roadIndex];
		newRoad[key] = value;
		items.splice(roadIndex, 1, newRoad);
		return items;
	});
}

export function reverseRoad(id: string) {
	const index = getRoadIndex(id);
	if (index === false) throw new Error("Could not reverse road");
	const road = get(roads)[index];
	const to =
		typeof road.to === "string"
			? get(roads)[getRoadIndex(road.to, true) as number].to
			: road.to;
	if (!to || typeof to === "string")
		throw new Error("Could not resolve `to` handle");
	editRoad(id, "to", road.from);
	editRoad(id, "from", to);
}
