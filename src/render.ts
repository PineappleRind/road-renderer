import { get, writable } from "svelte/store";

import { mouseState } from "@/events/store";
import { render } from "@/road/renderer";

export const ctx = writable<CanvasRenderingContext2D>();

export function renderToCanvas() {
	const ctx$ = get(ctx);
	if (!ctx$) return;
	ctx$.clearRect(0, 0, window.innerWidth, window.innerHeight);
	render();
}

mouseState.subscribe(async () => {
	// Make sure other subscribers' functions
	// happen first by skipping an event loop.
	// We want to be rendering the latest stuff!
	await new Promise((resolve) => setTimeout(resolve));
	render();
});
