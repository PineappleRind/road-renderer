import { setMouseState } from "./store";

export function mousemove(e: MouseEvent) {
    setMouseState({ x: e.clientX, y: e.clientY, down: e.buttons === 1 });
}