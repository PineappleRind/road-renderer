import App from "@/App.svelte";
import "@/app.css";

const app = new App({
	target: document.getElementById("app"),
});
// await creationWizard({ x: 200, y: 200 }, { x: 200, y: 800 });
export default app;
