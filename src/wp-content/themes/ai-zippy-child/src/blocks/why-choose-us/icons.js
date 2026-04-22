export const iconOptions = [
	{ label: "Solution", value: "solution" },
	{ label: "AI chip", value: "ai" },
	{ label: "Local", value: "local" },
];

export function WhyIcon({ name = "solution" }) {
	if (name === "ai") {
		return (
			<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
				<rect x="21" y="21" width="22" height="22" rx="4" />
				<rect x="27" y="27" width="10" height="10" rx="2" />
				<path d="M12 20h9M12 32h9M12 44h9M43 20h9M43 32h9M43 44h9M20 12v9M32 12v9M44 12v9M20 43v9M32 43v9M44 43v9M27 32h10M32 27v10" />
				<circle cx="12" cy="20" r="2" />
				<circle cx="12" cy="32" r="2" />
				<circle cx="12" cy="44" r="2" />
				<circle cx="52" cy="20" r="2" />
				<circle cx="52" cy="32" r="2" />
				<circle cx="52" cy="44" r="2" />
			</svg>
		);
	}

	if (name === "local") {
		return (
			<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
				<path d="M17 26c2-5 4-11 5-17 1-4 5-6 9-5h8c4 0 7 3 8 7l3 13M15 27l10 2 3 10 7 2 6-5 8 2M18 29c-2 4-2 10 2 15 3 5 9 9 16 9 11 0 20-9 20-20 0-4-1-7-3-10M29 41l-4 4M41 36l3 7M34 21h8M29 29h8M27 15l-4 9" />
				<path d="M8 28c5-1 10-2 16 1M50 24c4 1 6 2 8 5" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
			<path d="M11 47l17-8h10c5 0 10-4 10-9V17c0-7-6-12-13-12s-13 5-13 12v7" />
			<path d="M25 45l-10 8H6v-9h9M26 39v-8h12v8M29 31V17M35 31V17M24 17h16M32 5v7M19 13l-5-5M45 13l5-5M14 25H6M58 25h-8" />
		</svg>
	);
}
