// It's in a separate file because
// for some reason I can't import
// a component from its own module

import { createSlots } from "../utils/slots";
import {
	mouseFollowerOpen,
	default as MouseFollower,
} from "./MouseFollower.svelte";

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
