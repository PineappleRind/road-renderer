import type { Road } from "../types/road";
import { line } from "../utils/canvas";
import { roads } from "./store";

export function renderRoad(ctx: CanvasRenderingContext2D, road: Road) {
    line(ctx, road.from, road.to);
}

export function render(ctx: CanvasRenderingContext2D, roads: Road[]) {
    for (const road of roads) {
        renderRoad(ctx, road);
    }
}