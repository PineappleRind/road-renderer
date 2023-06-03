import type { LineOptions, PathOptions, PointOptions } from "../types/canvas";
import type { Coordinate } from "../types/position";

export function line(
	ctx: CanvasRenderingContext2D,
	from: Coordinate,
	to: Coordinate,
	{ color = "black", thickness = 1 }: LineOptions,
) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}

export function path(
	ctx: CanvasRenderingContext2D,
	path: Path2D,
	{
		color = "black",
		thickness = 1,
		dashed = false,
		action = "stroke",
	}: PathOptions,
) {
	if (dashed) ctx.setLineDash([10, 15]);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = thickness;
	ctx[action](path);
	ctx.setLineDash([10, 0]);
}

export function point(
	ctx: CanvasRenderingContext2D,
	coordinate: Coordinate,
	{ color = "black", radius = 2 }: PointOptions,
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}
