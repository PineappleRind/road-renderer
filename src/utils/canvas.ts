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

	for (const [i, curve] of bezier.entries()) {
		if (Array.isArray(curve)) {
			if (i === 0) path2d.moveTo(curve[0].x, curve[0].y);
			if (curve[1]) {
				path2d.quadraticCurveTo(curve[1].x, curve[1].y, curve[2].x, curve[2].y);
			} else path2d.lineTo(curve[2].x, curve[2].y);
		} else {
			path2d.lineTo(curve.x, curve.y);
		}
	}
	ctx[action](path2d);
	ctx.closePath();
	if (dashed) ctx.setLineDash([10, 0]);
	return path2d;
}

export function point(
	ctx: CanvasRenderingContext2D,
	coordinate: Coordinate,
	{ color = "black", radius = 5 }: PointOptions,
) {
	const prev = ctx.fillStyle;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = prev;
}
