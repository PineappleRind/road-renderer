import { derived, get, writable } from "svelte/store";
import { mouseState } from "@/events/store";
import { ctx } from "@/render";
import type { BoundingBox, Coordinate } from "@/types/position";

export type InteractableType = "road" | "curveHandle" | "handle";
export type InteractableState = "idle" | "hover" | "selected";

export type Interactable<T extends InteractableType> = {
	bounds: Path2D | BoundingBox;
	id: string;
	type: T;
	state: InteractableState;
} & (T extends "road" ? {} : { parent: string });

type InteractEvent = {
	id: string;
	from: InteractableState;
	to: InteractableState;
};

const interactables = writable<Interactable<InteractableType>[]>([]);
export const interactableState = writable<InteractEvent>(null);

export const currentSelection = derived(interactableState, (event) => {
	if (!event) return null;
	if (event.id === get(currentSelection) && event.to === "selected")
		return get(currentSelection);
	if (event.id !== get(currentSelection) && event.to === "selected")
		return event.id;
	if (event.id === get(currentSelection) && event.to !== "selected")
		return null;
	if (event.id !== get(currentSelection) && event.to !== "selected")
		return get(currentSelection);
});
/**
 * Registers an interactable
 * @param object The interactable to register.
 * @returns The index of the newly registered interactable.
 */
export function registerInteractable<T extends InteractableType>({
	bounds,
	id,
	type,
	parent,
	state = "idle",
}: Interactable<T>): number {
	let index: number;
	interactables.update((items) => {
		const newInteractable: Interactable<T> = {
			bounds,
			id,
			state,
			type,
			parent,
		};
		items.push(newInteractable);
		index = items.length;
		return items;
	});
	return index;
}

export function getInteractableIndex(id: string, loud?: boolean) {
	const found = get(interactables).findIndex((i) => i.id === id);
	if (found === -1 && loud) throw new Error("interactable not found");
	else if (found === -1) return null;
	else return found;
}

export function getInteractable(id: string, loud?: boolean) {
	return get(interactables)[getInteractableIndex(id, loud)];
}

export function editInteractable<
	T extends InteractableType,
	K extends keyof Interactable<T>,
>(id: string, key: K, value: Interactable<T>[K]) {
	const index = getInteractableIndex(id, true);
	const interactable = get(interactables)[index];
	interactable[key] = value;
	interactables.update((items) => {
		items.splice(index, 1, interactable);
		return items;
	});
}

export function deleteInteractable(index: number) {
	interactables.update((interactables) => {
		interactables.splice(index, 1);
		return interactables;
	});
}

mouseState.subscribe((pos) => {
	if (!pos) return;
	for (const interactable of get(interactables)) {
		if (!interactable.bounds) continue;

		const isInPath = ({ x, y }: Coordinate) =>
			get(ctx).isPointInPath(
				interactable.bounds as Path2D,
				// Multiply by devicePixelRatio because the way we scale the
				// canvas in Canvas.svelte affects what ctx.isPointInPath does
				x * devicePixelRatio,
				y * devicePixelRatio,
			);

		let newState: InteractableState;
		let mouseUp = !pos.down && pos.previous.down;
		let isNowInPath = isInPath(pos);
		let clickInPath = mouseUp && isInPath(pos.previous);
		// Click inside
		if (clickInPath || (!mouseUp && interactable.state === "selected"))
			newState = "selected";
		// Click outside
		else if (!isNowInPath && mouseUp) newState = "idle";
		// Hover inside
		else if (isNowInPath && !pos.down && newState !== "selected")
			newState = "hover";
		// Hover outside
		else if (!isNowInPath && !pos.down && newState !== "selected")
			newState = "idle";

		// if this isn't news, don't bother telling
		// everyone again. they don't want to hear it
		if (newState === interactable.state) continue;

		editInteractable(interactable.id, "state", newState);
		interactableState.set({
			from: interactable.state,
			to: newState,
			id: interactable.id,
		});
	}
});
