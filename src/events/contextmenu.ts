import Popover from "../components/Popover.svelte";
import Road from "../road";

export function contextmenu(e: MouseEvent) {
    e.preventDefault();
    const app = document.getElementById("app");
    const popover = new Popover({
        props: {
            coordinates: {
                x: e.clientX,
                y: e.clientY,
            },
            actions: [
                {
                    name: "Create Road",
                    action: () => Road.create({
                        x: e.clientX,
                        y: e.clientY
                    }),
                },
            ],
        },
        target: app,
    });
}
