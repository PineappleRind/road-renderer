import { get } from "svelte/store";

import Popover from "@/components/Popover.svelte";
import { mouseState } from "@/events/store";
import Road from "@/road";

export function contextmenu(e: MouseEvent) {
	e.preventDefault();
	const app = document.getElementById("app");
	const menuPosition = get(mouseState);
	new Popover({
		props: {
			coordinates: menuPosition,
			actions: [
				{
					name: "Create Road",
					action: () => Road.create({ x: menuPosition.x, y: menuPosition.y }),
				},
			],
		},
		target: app,
	});
}
