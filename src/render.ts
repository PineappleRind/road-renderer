import { get, writable } from "svelte/store";
import Road from "./road";
import { roads } from "./road/store";

export let ctx = writable<CanvasRenderingContext2D>();

export function render(ctx: CanvasRenderingContext2D) {
	if (!ctx) return;
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	Road.render(ctx, get(roads));
}

roads.subscribe(() => {
	render(get(ctx));
});
