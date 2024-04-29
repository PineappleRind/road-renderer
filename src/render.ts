import { get, writable } from "svelte/store";
import { mouseState } from "./events/store";
import Road from "./road";
import { roads } from "./road/store";

export const ctx = writable<CanvasRenderingContext2D>();

export async function render() {
	const $ctx = get(ctx);
	if (!$ctx) return;
	$ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	Road.render($ctx, get(roads));
}

mouseState.subscribe(async () => {
	// Make sure other subscribers' functions
	// happen first by skipping an event loop.
	// We want to be rendering the latest stuff!
	await new Promise((resolve) => setTimeout(resolve));
	render();
});
