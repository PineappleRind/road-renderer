import { setMouseDown } from "./store";

export function mousedown(e: MouseEvent) {
    if (e.buttons === 1) setMouseDown(true);
}