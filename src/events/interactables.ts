import { get, writable } from "svelte/store";
import type { BoundingBox } from "../types/position";
import { mouseState } from "./store";
import { ctx } from "../render";

export type InteractableType = "road" | "curveHandle" | "handle"
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
        const newInteractable: Interactable<T> = { bounds, id, state, type, parent };
        items.push(newInteractable);
        index = items.length;
        return items;
    });
    return index;
}

function getInteractableIndex(id: string, loud?: boolean) {
    let found = get(interactables).findIndex((i) => i.id === id);
    if (found === -1 && loud) throw new Error("interactable not found");
    else if (found === -1) return null;
    else return found;
}

export function getInteractable(id: string) {
    return get(interactables)[getInteractableIndex(id, true)];
}

export function editInteractable<T extends InteractableType, K extends keyof Interactable<T>>(id: string, key: K, value: Interactable<T>[K]) {
    const index = getInteractableIndex(id, true);
    const interactable = get(interactables)[index];
    interactable[key] = value;
    interactables.update((items) => {
        items.splice(index, 1, interactable);
        return items;
    })
}

mouseState.subscribe((pos) => {
    if (!pos) return;
    for (const interactable of get(interactables)) {
        console.log(interactable)
        // If bounds is a Path2D...
        if (interactable.bounds?.__proto__.arc) {
            console.log("It's a Path2D!")
            // If we're in it...
            let isInPath = get(ctx).isPointInStroke(interactable.bounds as Path2D, pos.x, pos.y);
            console.log(pos.x, pos.y, interactable.bounds.__proto__, get(ctx), isInPath)
            if (isInPath) {
                console.log("We're in it!")
                let oldState = interactable.state;
                // Sorry, TypeScript ... if anyone wants
                // to help with this please open an issue
                // @ts-ignore
                editInteractable<any, any>(interactable.id, "state", "hover");
                interactableState.set({
                    from: oldState,
                    to: "hover",
                    id: interactable.id
                });
            }
        }
    }
})
interactableState.subscribe(x=>console.log(x))