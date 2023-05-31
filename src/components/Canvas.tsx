import RoadCreator from "../roadCreator/roadCreator";

export default function Canvas() {
    let canvas!: HTMLCanvasElement;
    let ctx!: CanvasRenderingContext2D;

    scaleCanvasToWindow(canvas, ctx);

    const roadCreator = new RoadCreator({
        canvas, ctx
    });
    roadCreator.init();

    return (
        <canvas
            ref={el => {
                canvas = el;
                let tryCtx = el.getContext("2d");
                if (!tryCtx) throw new Error("could not get canvas context");
                ctx = tryCtx;
            }}
            onmousedown={roadCreator.events.onmousedown}
            onmouseup={roadCreator.events.onmouseup}
            onmousemove={roadCreator.events.onmousemove}
            onclick={roadCreator.events.onclick}
        ></canvas>
    )
}

/**
 * Scale the provided canvas to the window.
 * This also makes the resolution correct for high-dpi displays. 
 * https://www.kirupa.com/canvas/canvas_high_dpi_retina.htm
 */
function scaleCanvasToWindow(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const size = { width: window.innerWidth, height: window.innerHeight };

    canvas.width = size.width * devicePixelRatio;
    canvas.height = size.height * devicePixelRatio;

    // ensure all drawing operations are scaled
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // scale everything down using CSS
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
}