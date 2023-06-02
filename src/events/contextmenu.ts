import { get } from "svelte/store";
import Popover from "../components/Popover.svelte";
import Road from "../road";
import { mouseState } from "./store";

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
					action: () => Road.create(menuPosition),
				},
			],
		},
		target: app,
	});
}
