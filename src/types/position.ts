export type Coordinate = {
	x: number;
	y: number;
};

export type BoundingBox = Coordinate & { width: number; height: number };
