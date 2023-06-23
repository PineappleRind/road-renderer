// It's in a separate file because
// for some reason I can't import
// a component from its own module

import {
	default as MouseFollower,
	mouseFollowerOpen,
} from "@/components/MouseFollower.svelte";
import { createSlots } from "@/utils/slots";

/** Displays text that follows the user's mouse */
export function createMouseFollower(text: string) {
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
}

export async function destroyMouseFollower() {
	// Make sure that mouseFollowerOpen doesn't
	// change after our setTimeout resolves
	const mouseFollowerOpen$ = mouseFollowerOpen;
	mouseFollowerOpen$.classList.add("hidden");
	await new Promise((resolve) => setTimeout(resolve, 2000));
	mouseFollowerOpen$.remove();
}
