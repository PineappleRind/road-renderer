import type { Coordinate } from "./position";

export interface Road {
	id: string;
	from: Coordinate;
	to: Coordinate | string;
	curve?: Coordinate;
	ghost?: boolean;
}

type KeysWithValsOfType<T, V> = keyof {
	[P in keyof T as T[P] extends V ? P : never]: P;
};

export interface Handle {
	parent: string;
	affects:
		| KeysWithValsOfType<Road, Coordinate>
		| KeysWithValsOfType<Road, string | Coordinate>;
	position: Coordinate;
	state?: HandleState;
}

export enum HandleState {
	Inactive = 0,
	Dragging = 1,
	AwaitingConnection = 2,
}
