import { get } from "svelte/store";
import { createMouseFollower } from "../components/MouseFollower";
import MouseFollower from "../components/MouseFollower.svelte";
import type { Coordinate } from "../types/position";
import { createSlots } from "../utils/slots";
import { roads } from "./store";

export default async function creationWizard(from: Coordinate | undefined, to: Coordinate | undefined) {
    if (!from) from = await getUserMouseInput("Choose a start point for your road");
    if (!to) to = await getUserMouseInput("Choose an end point");
    roads.set([...get(roads), {
        from, to
    }]);
}
/**
 * Prompts the user to click somewhere and gets the position
 */
async function getUserMouseInput(prompt: string): Promise<Coordinate> {
    createMouseFollower(prompt);
    let resolveCache;
    const e: MouseEvent = await new Promise(resolve => {
        resolveCache = resolve;
        document.addEventListener("click", resolve);
    })
    document.removeEventListener("click", resolveCache);
    return { x: e.clientX, y: e.clientY };
}