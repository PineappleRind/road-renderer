import { setMouseDown } from "./store";

export function mouseup(e: MouseEvent) {
    if (e.buttons === 0) setMouseDown(false);
}