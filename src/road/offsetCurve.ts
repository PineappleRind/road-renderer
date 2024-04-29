import type { Coordinate } from "@/types/position";
import { Vector } from "@/utils/vector";

/**
 *
 * @param p1 First control point of the curve.
 * @param c Second control point. For road-renderer it's the "curve point".
 * @param p2 Final control point of the curve.
 * @param thickness How much to offset the curve by.
 * @returns An array of
 */
export function offsetPath(
	p1: Coordinate,
	c: Coordinate,
	p2: Coordinate,
	thickness: number,
): { a: Coordinate[][]; b: Coordinate[][] } {
	let qa: Vector;
	let qb: Vector;
	let q1a: Coordinate;
	let q2a: Coordinate;
	let q1b: Coordinate;
	let q2b: Coordinate;
	let ca: Coordinate;
	let cb: Coordinate;
	const p1v = new Vector(p1.x, p1.y).round();
	const cv = new Vector(c.x, c.y).round();
	const p2v = new Vector(p2.x, p2.y).round();

	const v1 = cv.subtract(p1v);
	const v2 = p2v.subtract(cv);

	const normal1 = v1.normalize().withLength(thickness).getPerpendicular();
	const normal2 = v2.normalize().withLength(thickness).getPerpendicular();

	const p1a = p1v.add(normal1).round();
	const p1b = p1v.subtract(normal1).round();
	const p2a = p2v.add(normal2).round();
	const p2b = p2v.subtract(normal2).round();

	const c1a = cv.add(normal1);
	const c1b = cv.subtract(normal1);
	const c2a = cv.add(normal2);
	const c2b = cv.subtract(normal2);

	const line1a = { p1: p1a, p2: c1a };
	const line1b = { p1: p1b, p2: c1b };
	const line2a = { p1: p2a, p2: c2a };
	const line2b = { p1: p2b, p2: c2b };

	const split = v1.angleBetween(v2, true) > Math.PI / 2;

	if (split) {
		const t = getNearestPoint(p1v, cv, p2v);
		const pt = getPointInQuadraticCurve(t, p1v, cv, p2v);
		const t1 = p1v.scaleBy(1 - t).add(cv.scaleBy(t));
		const t2 = cv.scaleBy(1 - t).add(p2v.scaleBy(t));

		const vt = t2
			.subtract(t1)
			.normalize()
			.withLength(thickness)
			.getPerpendicular();

		qa = pt.add(vt);
		qb = pt.subtract(vt);

		const lineqa = { p1: qa, p2: qa.add(vt.getPerpendicular()) };
		const lineqb = { p1: qb, p2: qb.add(vt.getPerpendicular()) };

		q1a = linesIntersect(line1a, lineqa).position?.asCoordinate();
		q2a = linesIntersect(line2a, lineqa).position?.asCoordinate();
		q1b = linesIntersect(line1b, lineqb).position?.asCoordinate();
		q2b = linesIntersect(line2b, lineqb).position?.asCoordinate();
	} else {
		ca = linesIntersect(line1a, line2a).position?.asCoordinate();
		cb = linesIntersect(line1b, line2b).position?.asCoordinate();
	}

	return {
		a: split
			? [
					[p1a.asCoordinate(), q1a, qa.asCoordinate()],
					[qa.asCoordinate(), q2a, p2a.asCoordinate()],
				]
			: [[p1a.asCoordinate(), ca, p2a.asCoordinate()]],
		b: split
			? [
					[p1b.asCoordinate(), q1b, qb.asCoordinate()],
					[qb.asCoordinate(), q2b, p2b.asCoordinate()],
				]
			: [[p1b.asCoordinate(), cb, p2b.asCoordinate()]],
	};
}

const getPointInQuadraticCurve = (
	t: number,
	p1: Vector,
	pc: Vector,
	p2: Vector,
) => {
	const [p1x, p1y] = p1.components;
	const [pcx, pcy] = pc.components;
	const [p2x, p2y] = p2.components;
	const x = (1 - t) * (1 - t) * p1x + 2 * (1 - t) * t * pcx + t * t * p2x;
	const y = (1 - t) * (1 - t) * p1y + 2 * (1 - t) * t * pcy + t * t * p2y;

	return new Vector(x, y);
};

// http://microbians.com/math/Gabriel_Suchowolski_Quadratic_bezier_offsetting_with_selective_subdivision.pdf
// http://www.math.vanderbilt.edu/~schectex/courses/cubic/
const getNearestPoint = (p1: Vector, pc: Vector, p2: Vector) => {
	const d1 = Math.sqrt(pc.distanceToSquared(p1));
	const d2 = Math.sqrt(pc.distanceToSquared(p2));
	const t = d1 / (d1 + d2);

	return t;
};

enum Intersection {
	Intersecting = 0,
	NonIntersecting = 1,
	Coincident = 2,
}

function linesIntersect(
	line1: { p1: Vector; p2: Vector },
	line2: { p1: Vector; p2: Vector },
): { type: Intersection; position: Vector } {
	const intersection = { type: Intersection.Coincident, position: undefined };
	const { x: l1p1x, y: l1p1y } = line1.p1.round().asCoordinate();
	const { x: l1p2x, y: l1p2y } = line1.p2.round().asCoordinate();
	const { x: l2p1x, y: l2p1y } = line2.p1.round().asCoordinate();
	const { x: l2p2x, y: l2p2y } = line2.p2.round().asCoordinate();
	const denominator =
		(l2p2y - l2p1y) * (l1p2x - l1p1x) - (l2p2x - l2p1x) * (l1p2y - l1p1y);
	const na =
		(l2p2x - l2p1x) * (l1p1y - l2p1y) - (l2p2y - l2p1y) * (l1p1x - l2p1x);
	const nb =
		(l1p2x - l1p1x) * (l1p1y - l2p1y) - (l1p2y - l1p1y) * (l1p1x - l2p1x);

	if (denominator === 0 || (na === 0 && nb === 0)) return intersection;
	const ua = na / denominator;
	const ub = nb / denominator;

	intersection.position = line1.p1.interpolateTo(line1.p2, ua).round();
	if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
		intersection.type = Intersection.Intersecting;
	} else {
		intersection.type = Intersection.NonIntersecting;
	}
	return intersection;
}

export const testable = {
	linesIntersect,
	Intersection,
	getNearestPoint,
	getPointInQuadraticCurve,
	offsetPath,
};
