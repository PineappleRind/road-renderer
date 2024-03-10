import { Vector } from "../src/utils/vector";
import { describe, test, expect } from "bun:test";

describe("Vector", () => {
	test("add", () => {
		expect(new Vector(30, 500).add(new Vector(30, 50))).toSatisfy(
			(x) => x.components[0] === 60 && x.components[1] === 550,
		);
	});
	test("angleBetween", () => {
		expect(
			new Vector(30, 500).angleBetween(new Vector(92, 41), true),
		).toBeCloseTo(1.0916357779197934);
	});
	test("distanceToSquared", () => {
		expect(new Vector(97, 19).distanceToSquared(new Vector(81, 88))).toBe(5017);
	});
	test("dot", () => {
		expect(new Vector(81, 18).dotProduct(new Vector(5, 56))).toBe(1413);
	});
	test("getPerpendicular", () => {
		expect(new Vector(773, 49).getPerpendicular()).toSatisfy(
			(x) => x.components[0] === -49 && x.components[1] === 773,
		);
	});
	test("interpolateTo", () => {
		expect(
			new Vector(773, 49).interpolateTo(new Vector(49, 49), 0.6),
		).toSatisfy((x) => x.components[0] === 338.6 && x.components[1] === 49);
	});
	test("normalize", () => {
		expect(new Vector(81, 18).normalize()).toSatisfy(
			(x) =>
				x.components[0].toFixed(3) === "0.976" &&
				x.components[1].toFixed(3) === "0.217",
		);
	});
	test("scale", () => {
		expect(new Vector(36, 49).scaleBy(30)).toSatisfy(
			(x) => x.components[0] === 1080 && x.components[1] === 1470,
		);
	});
	test("sub", () => {
		expect(new Vector(36, 49).subtract(new Vector(65, 64))).toSatisfy(
			(x) => x.components[0] === -29 && x.components[1] === -15,
		);
	});
});
