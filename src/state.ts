import { writable, type Writable } from "svelte/store";

/**
 *
 */
export const selected = writable<string | null>(null);
