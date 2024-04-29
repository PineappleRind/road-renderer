import type { Coordinate } from "@/types/position";

export const distance = (p1: Coordinate, p2: Coordinate) =>
	Math.hypot(p2.x - p1.x, p2.y - p1.y);

export const halfway = (from: Coordinate, to: Coordinate): Coordinate => {
	const lerp = (a: number, b: number, t: number) => a + t * (b - a);
	return { x: lerp(from.x, to.x, 0.5), y: lerp(from.y, to.y, 0.5) };
};
