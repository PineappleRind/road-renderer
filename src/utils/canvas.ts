import type { Coordinate } from "../types/position";

export function line(
    ctx: CanvasRenderingContext2D,
    from: Coordinate,
    to: Coordinate,
    color: string = "black",
    thickness: number = 1,
) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}
