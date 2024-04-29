<script lang="ts">
import { onMount } from "svelte";
import events from "../events/index";
import { ctx as ctxStore, render as render$ } from "../render";
let canvas: HTMLCanvasElement;
onMount(() => {
	const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
	if (!ctx) throw new Error("NO CTX??!?");
	scaleCanvasToWindow(canvas, ctx);
	window.addEventListener("resize", () => {
		scaleCanvasToWindow(canvas, ctx);
		render$(ctx);
	});
	ctxStore.set(ctx);

	for (const event in events) {
		document[`on${event}`] = (e) => {
			if (
				e.target instanceof HTMLElement &&
				e.target.tagName.toLowerCase() !== "canvas"
			)
				return;
			events[event](e);
		};
	}
});

/**
 * Scale the provided canvas to the window.
 * This also makes the resolution correct for high-dpi displays.
 * https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
 */
function scaleCanvasToWindow(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
) {
	const size = { width: window.innerWidth, height: window.innerHeight };

	canvas.width = size.width * devicePixelRatio;
	canvas.height = size.height * devicePixelRatio;

	// ensure all drawing operations are scaled
	ctx.scale(devicePixelRatio, devicePixelRatio);

	// scale everything down using CSS
	canvas.style.width = `${size.width}px`;
	canvas.style.height = `${size.height}px`;
}
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: fixed;
    z-index: -1;
  }
</style>