<script lang="ts">
  import { onMount } from "svelte";
  import events from "../events/index";
  import { ctx as ctxStore } from "../render";
  let canvas: HTMLCanvasElement;
  onMount(() => {
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    if (!ctx) throw new Error("NO CTX??!?");
    scaleCanvasToWindow(canvas, ctx);
    onresize = () => scaleCanvasToWindow(canvas, ctx);
    ctxStore.set(ctx);

    for (const event in events) {
      canvas[`on${event}`] = events[event];
    }
  });

  /**
   * Scale the provided canvas to the window.
   * This also makes the resolution correct for high-dpi displays.
   * https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
   */
  function scaleCanvasToWindow(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
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