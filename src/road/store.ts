import { writable } from "svelte/store";
import type { Road } from "../types/road";

export const roads = writable<Road[]>([]);