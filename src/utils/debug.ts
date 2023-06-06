let currentGroup = getTime();

export const debug = (...data) => {
	const now = getTime();

	if (currentGroup !== now) {
		console.groupEnd();
		console.groupCollapsed("%cDebug", "font-weight: bold; color: blue");
		currentGroup = getTime();
	}

	Function.prototype.apply.call(console.log, window.console, data);
};

function getTime() {
	return new Date().toISOString().split("T")[1].slice(0, -4);
}
