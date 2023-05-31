<script lang="ts">
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  if (!ctx) throw new Error("NO CTX??!?");
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
