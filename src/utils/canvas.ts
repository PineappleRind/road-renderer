import type { Coordinate } from "../types/position";

export function line(
	ctx: CanvasRenderingContext2D,
	from: Coordinate,
	to: Coordinate,
	color: string = "black",
	thickness: number = 1,
) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}

export function point(
	ctx: CanvasRenderingContext2D,
	coordinate: Coordinate,
	color: string = "black",
	radius: number = 2
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
	ctx.fill();
}