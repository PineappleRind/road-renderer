export class Vector {
	components: number[];
	constructor(...components: number[]) {
		this.components = components;
	}
	add({ components }: Vector) {
		return new Vector(
			...components.map(
				(component, index) => this.components[index] + component,
			),
		);
	}
	subtract({ components }: Vector) {
		return new Vector(
			...components.map(
				(component, index) => this.components[index] - component,
			),
		);
	}
	scaleBy(number: number) {
		return new Vector(
			...this.components.map((component) => component * number),
		);
	}
	length() {
		return Math.hypot(...this.components);
	}
	dotProduct({ components }: Vector): number {
		return components.reduce(
			(acc: number, component: number, index: number) =>
				acc + component * this.components[index],
			0,
		);
	}
	normalize() {
		return this.scaleBy(1 / this.length());
	}
	angleBetween(other: Vector, faceNormalize?: boolean) {
		if (faceNormalize === undefined) {
			const dot = this.dotProduct(other);
			return Math.acos(this.dotProduct(other));
		}
		const theta = faceNormalize
			? this.normalize().dotProduct(other.normalize())
			: this.dotProduct(other);
		return Math.acos(theta);
	}
	negate() {
		return this.scaleBy(-1);
	}
	withLength(newLength: number) {
		return this.normalize().scaleBy(newLength);
	}
	getPerpendicular() {
		return new Vector(-this.components[1], this.components[0]);
	}
	interpolateTo(v: Vector, f: number) {
		const [x, y] = this.components;
		const [vx, vy] = v.components;
		return new Vector(x + (vx - x) * f, y + (vy - y) * f);
	}
	asCoordinate() {
		return { x: this.components[0], y: this.components[1] };
	}
	round() {
		return new Vector(...this.components.map((c) => Math.round(c)));
	}
	distanceToSquared(v: Vector) {
		const dx = this.components[0] - v.components[0];
		const dy = this.components[1] - v.components[1];
		return dx * dx + dy * dy;
	}
	/**
	 * @brief Reflect point p along line through points p0 and p1
	 * @author Balint Morvai <balint@morvai.de>
	 * @license http://en.wikipedia.org/wiki/MIT_License MIT License
	 */
	reflect(origin: Vector) {
		const self = this.asCoordinate();
		const oc = origin.asCoordinate();
		const dx = -self.x + oc.x;
		const dy = -self.y + oc.y;
		const a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
		const b = (2 * dx * dy) / (dx * dx + dy * dy);
		const x = Math.round(a * (self.x - oc.x) + b * (self.y - oc.y) + oc.x);
		const y = Math.round(b * (self.x - oc.x) - a * (self.y - oc.y) + oc.y);

		return new Vector(x, y);
	}

	lerp(b: Vector, t: number) {
		return new Vector(
			lerp(this.components[0], b.components[0], t),
			lerp(this.components[1], b.components[1], t),
		);
	}
}

export const lerp = (a: number, b: number, t: number) => a + t * (b - a);
