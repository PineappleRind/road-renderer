import { writable } from "svelte/store";

/**
 * A list of road IDs that are currently selected.
 */
export const selection = writable<string[]>([]);
