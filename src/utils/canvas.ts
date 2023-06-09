import type { LineOptions, PathOptions, PointOptions } from "@/types/canvas";
import type { Coordinate } from "@/types/position";

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

export function bezier(
	ctx: CanvasRenderingContext2D,
	bezier: (Coordinate | Coordinate[])[],
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
	const path2d = new Path2D();
	ctx.beginPath();
	for (const curve of bezier) {
		if (curve instanceof Array) {
			path2d.moveTo(curve[0].x, curve[0].y);
			path2d.bezierCurveTo(
				curve[0].x,
				curve[0].y,
				curve[1].x,
				curve[1].y,
				curve[2].x,
				curve[2].y,
			);
		} else path2d.lineTo(curve.x, curve.y);
	}
	ctx[action](path2d);
	ctx.closePath();
	if (dashed) ctx.setLineDash([10, 0]);
	return path2d;
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
