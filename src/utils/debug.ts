let lastCreatedGroup = getTime();

export const debug = (...data) => {
	let now = getTime();
	if (lastCreatedGroup !== now) {
		console.groupEnd();
		console.groupCollapsed(
			`%cDebug %c${lastCreatedGroup}`,
			"font-weight: bold; color: dodgerblue",
			"font-weight: normal; color: cornflowerblue",
		);
		lastCreatedGroup = getTime();
	}

	Function.prototype.apply.call(console.log, window.console, data);
	if (lastCreatedGroup !== now) {
		
	}
};

function getTime() {
	return new Date().toISOString().split("T")[1].slice(0, -5);
}
