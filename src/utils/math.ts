import type { Coordinate } from "../types/position";

export const distance = (p1: Coordinate, p2: Coordinate) =>
	Math.hypot(p2.x - p1.x, p2.y - p1.y);

export const lerp = (a: number, b: number, t: number) => a + t * (b - a);

/**
 * ( derived from https://codepen.io/osublake/pen/BowJed )
 *
 * Interpolates a Catmull-Rom Spline through a series of x/y points
 * Converts the CR Spline to Cubic Beziers for use with SVG items
 * Or, in road-renderer's case, to be used to draw to the canvas
 * @param k spline tension
 */
export function catmullRomFitting(data: Coordinate[], k = 1) {
	// later I'll change this to be a little more smart when choosing extra
	// points  –  e.g. choose one along the derivative of the closest point
	if (data.length < 4)
		return catmullRomFitting([data[0], ...data, data.at(-1)], k);

	const last = data.length - 2;

	let path = `M${[data[1].x, data[1].y]}`;

	for (let i = 1; i < last; i++) {
		const { x: x0, y: y0 } = i ? data[i - 1] : data[0];
		const { x: x1, y: y1 } = data[i];
		const { x: x2, y: y2 } = data[i + 1];
		const { x: x3, y: y3 } = i !== last ? data[i + 2] : { x: x2, y: y2 };

		const cp1x = x1 + ((x2 - x0) / 6) * k;
		const cp1y = y1 + ((y2 - y0) / 6) * k;

		const cp2x = x2 - ((x3 - x1) / 6) * k;
		const cp2y = y2 - ((y3 - y1) / 6) * k;

		path += ` C${[
			cp1x.toFixed(2),
			cp1y.toFixed(2),
			cp2x.toFixed(2),
			cp2y.toFixed(2),
			x2,
			y2,
		]}`;
	}
	return path;
}
