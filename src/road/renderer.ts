import type { Road } from "../types/road";
import { line } from "../utils/canvas";

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
	line(ctx, road.from, road.to, road.ghost ? `hsla(0,0%,0%,0.2)` : "black");
}

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
	for (const road of roads) {
		renderRoad(ctx, road);
	}
}
