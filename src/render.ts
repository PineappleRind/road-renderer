import { get, writable } from "svelte/store";
import Road from "./road";
import { roads } from "./road/store";

export let ctx = writable<CanvasRenderingContext2D>();

export function render(ctx: CanvasRenderingContext2D) {
    Road.render(ctx, get(roads));
}

roads.subscribe(() => {
    console.log(get(ctx))
    render(get(ctx));
})