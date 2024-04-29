import { setMouseDown } from "@/events/store";

export function mouseup(e: MouseEvent) {
	if (e.buttons === 0) setMouseDown(false);
}
