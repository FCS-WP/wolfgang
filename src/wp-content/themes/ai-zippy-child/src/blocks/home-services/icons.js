export const iconOptions = [
	{ label: "Megaphone", value: "megaphone" },
	{ label: "Globe", value: "globe" },
	{ label: "Light bulb", value: "bulb" },
];

export function ServiceIcon({ name = "megaphone" }) {
	if (name === "globe") {
		return (
			<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
				<circle cx="22" cy="22" r="17" />
				<path d="M5 22h34M22 5c5 5 8 11 8 17 0 3-.7 6-2 9M22 5c-5 5-8 11-8 17 0 6 3 12 8 17M9 13h26M9 31h21M31 31l11 11M34 41l8-8" />
			</svg>
		);
	}

	if (name === "bulb") {
		return (
			<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
				<path d="M16 32c-4-3-6-7-6-12 0-8 6-14 14-14s14 6 14 14c0 5-2 9-6 12M18 32h12M19 38h10M21 43h6M24 1v5M4 20h5M39 20h5M9 7l4 4M39 7l-4 4" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
			<path d="M5 10h26v16H16l-7 7v-7H5zM31 15l9-5v22l-9-5M18 32l4 10h7l-4-10M12 18h2M19 18h2M26 18h2" />
		</svg>
	);
}
