import { get } from "svelte/store";
import { roads } from "./store";

/** don't use - it doesn't destroy interactables
 * @todo don't even use interactables at all, must be a better solution
 */
export function destroy(id: string) {
	const roadIndex = get(roads).findIndex((x) => x.id === id);
	if (roadIndex === -1) return;
	const newRoads = get(roads).toSpliced(roadIndex, 1);
	roads.set(newRoads);
}
