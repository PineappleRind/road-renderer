import { get } from "svelte/store";
import Popover from "../components/Popover.svelte";
import Road from "../road";
import { type MouseStateWithPrevious, mouseState } from "./store";

export function contextmenu(e: MouseEvent) {
	e.preventDefault();
	const app = document.getElementById("app");
	const menuPosition = get(mouseState);
	new Popover({
		props: {
			coordinates: menuPosition,
			actions: [getPopoverActions(menuPosition)],
		},
		target: app,
	});
}

function getPopoverActions(menuPosition: MouseStateWithPrevious) {
	// if (
	// 	isPointInInteractable(
	// 		getInteractable(get(interactableState)?.id),
	// 		menuPosition,
	// 	)
	// )
	// 	return {
	// 		name: "Delete Road",
	// 		action: () => Road.destroy(get(interactableState).id),
	// 	};
	return {
		name: "Create Road",
		action: () => Road.create({ x: menuPosition.x, y: menuPosition.y }),
	};
}
