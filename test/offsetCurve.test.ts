import { describe, expect, test } from "bun:test";
import { testable } from "../src/road/offsetCurve.ts";
import { Vector } from "../src/utils/vector.ts";

describe("MathUtils", () => {
	test("getNearestPoint", () => {
		expect(
			testable.getNearestPoint(
				new Vector(540, 0),
				new Vector(600, 200),
				new Vector(95, 41),
			),
		).toBeCloseTo(0.28284106377918594);
	});
	test("getPointInQuadraticCurve", () => {
		expect(
			testable.getPointInQuadraticCurve(
				0.5,
				new Vector(540, 0),
				new Vector(600, 200),
				new Vector(95, 41),
			),
		).toSatisfy(
			(x) => x.components[0] === 458.75 && x.components[1] === 110.25,
		);
		expect(
			testable.getPointInQuadraticCurve(
				0.8,
				new Vector(540, 10),
				new Vector(600, 200),
				new Vector(95, 44),
			),
		).toSatisfy((x) => x.components[0] === 274.4 && x.components[1] === 92.56);
	});
});

test("linesIntersect", () => {
	expect(
		testable.linesIntersect(
			{ p1: new Vector(0, 100), p2: new Vector(200, 300) },
			{ p1: new Vector(200, 100), p2: new Vector(0, 300) },
		),
	).toMatchObject({
		position: new Vector(100, 200),
		type: testable.Intersection.Intersecting,
	});
});

test("offsetCurve", () => {
	expect(
		testable.offsetPath(
			{ x: 20, y: 40 },
			{ x: 20, y: 60 },
			{ x: 60, y: 20 },
			20,
		),
	).toMatchObject({
		a: [
			[
				{ x: 0, y: 40 },
				{ x: 0, y: 58.5876502576608 },
				{ x: 15.075429924541158, y: 64.83209779101097 },
			],
			[
				{ x: 74.14213562373095, y: 34.14213562373095 },
				{ x: 35.140817703946084, y: 73.14345354351582 },
				{ x: 74.14213562373095, y: 34.14213562373095 },
			],
		],
		b: [
			[
				{ x: 40, y: 40 },
				{ x: 40, y: 31.860504740888857 },
				{ x: 30.38276721914475, y: 27.876916490559488 },
			],
			[
				{ x: 45.85786437626905, y: 5.857864376269051 },
				{ x: 25.75549229315325, y: 25.960236459384852 },
				{ x: 45.85786437626905, y: 5.857864376269051 },
			],
		],
	});
});
