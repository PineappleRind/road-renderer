import { get, writable } from "svelte/store";
import { mouseState } from "./events/store";
import Road from "./road";
import { roads } from "./road/store";

export const ctx = writable<CanvasRenderingContext2D>();

export async function render(ctx: CanvasRenderingContext2D) {
	if (!ctx) return;
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	Road.render(ctx, get(roads));
}

mouseState.subscribe(() => {
	render(get(ctx));
});
