// It's in a separate file because
// for some reason I can't import
// a component from its own module

import {
	default as MouseFollower,
	mouseFollowerOpen,
} from "@/components/MouseFollower.svelte";
import { createSlots } from "@/utils/slots";

export function createMouseFollower(text) {
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

export function destroyMouseFollower() {
	mouseFollowerOpen.remove();
}
