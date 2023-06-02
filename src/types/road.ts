import type { Coordinate } from "./position";

export interface Road {
	id: string;
	from: Coordinate;
	to: Coordinate; // | Road;
	curve?: Coordinate;
	ghost?: boolean;
}

type KeysWithValsOfType<T,V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P };

export interface Handle {
	parent: string;
	affects: KeysWithValsOfType<Road, Coordinate>;
	position: Coordinate;
	state?: HandleState
}

export enum HandleState {
	Inactive,
	Dragging,
}