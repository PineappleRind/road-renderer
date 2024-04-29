// It's in a separate file because
// for some reason I can't import
// a component from its own module

import {
	default as MouseFollower,
	mouseFollowerOpen,
} from "@/components/MouseFollower.svelte";
import { createSlots } from "@/utils/slots";
import { get } from "svelte/store";

/** Displays text that follows the user's mouse */
export const mouseFollower = {
	create(text: string) {
		if (get(mouseFollowerOpen)?.innerText === text) return;
		if (get(mouseFollowerOpen)) mouseFollower.destroy();
		return new MouseFollower({
			props: {
				// @ts-ignore
				$$slots: createSlots({
					default: document.createTextNode(text),
				}),
				// @ts-ignore
				$$scope: {},
			},
			target: document.body,
		});
	},
	async destroy() {
		// Make sure that mouseFollowerOpen doesn't
		// change after our setTimeout resolves
		const mouseFollowerOpen$ = get(mouseFollowerOpen);
		if (!mouseFollowerOpen$) return;
		mouseFollowerOpen$.classList.add("hidden");
		mouseFollowerOpen.set(null);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		mouseFollowerOpen$.remove();
	},
};
