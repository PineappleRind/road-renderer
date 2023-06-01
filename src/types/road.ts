import type { Coordinate } from "./position";

export interface Road {
	id: string;
	from: Coordinate;
	to: Coordinate; // | Road;
	curve?: Coordinate;
	ghost?: boolean;
}
