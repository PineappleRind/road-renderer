import { get } from "svelte/store";
import Popover from "../components/Popover.svelte";
import Road from "../road";
import { mousePos } from "./store";

export function contextmenu(e: MouseEvent) {
	e.preventDefault();
	const app = document.getElementById("app");
	const popover = new Popover({
		props: {
			coordinates: get(mousePos),
			actions: [
				{
					name: "Create Road",
					action: () =>
						Road.create(get(mousePos)),
				},
			],
		},
		target: app,
	});
}
