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
	projectOn(other: Vector) {
		const normalized = other.normalize();
		return normalized.scaleBy(this.dotProduct(normalized));
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
}
