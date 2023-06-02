export function generateID() {
	return Math.round(Math.random() * 2 ** 32)
		.toString(16)
		.padStart(8, "0");
}
