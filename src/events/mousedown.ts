import { setMouseDown } from "@/events/store";

export function mousedown(e: MouseEvent) {
	if (e.buttons === 1) setMouseDown(true);
}
