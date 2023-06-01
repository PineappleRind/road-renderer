import type { Coordinate } from "./position";

export interface Road {
	from: Coordinate;
	to: Coordinate// | Road;
	curve?: Coordinate;
}
