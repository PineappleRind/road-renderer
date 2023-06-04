import { get, writable } from "svelte/store";
import type { BoundingBox } from "../types/position";
import { mouseState } from "./store";
import { ctx } from "../render";

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

function getInteractableIndex(id: string, loud?: boolean) {
	const found = get(interactables).findIndex((i) => i.id === id);
	if (found === -1 && loud) throw new Error("interactable not found");
	else if (found === -1) return null;
	else return found;
}

export function getInteractable(id: string) {
	return get(interactables)[getInteractableIndex(id, true)];
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

mouseState.subscribe((pos) => {
	if (!pos) return;
	for (const interactable of get(interactables)) {
		if (!interactable.bounds) continue;
		// If bounds is a Path2D...
		if ((interactable.bounds as Path2D).rect) {
			const isInPath = get(ctx).isPointInPath(
				interactable.bounds as Path2D,
				// Multiply by devicePixelRatio because the way we scale the
				// canvas in Canvas.svelte affects what ctx.isPointInPath does
				pos.x * devicePixelRatio,
				pos.y * devicePixelRatio,
			);
			if (isInPath) {
				editInteractable(interactable.id, "state", "hover");
				interactableState.set({
					from: interactable.state,
					to: "hover",
					id: interactable.id,
				});
			} else {
				editInteractable(interactable.id, "state", "idle");
				interactableState.set({
					from: interactable.state,
					to: "idle",
					id: interactable.id,
				});
			}
		}
	}
});
