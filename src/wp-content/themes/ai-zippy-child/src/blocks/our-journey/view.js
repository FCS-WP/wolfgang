const initJourney = (section) => {
	const sticky = section.querySelector(".our-journey__sticky");
	const viewport = section.querySelector(".our-journey__viewport");
	const track = section.querySelector(".our-journey__track");
	const items = Array.from(section.querySelectorAll(".our-journey__item"));

	if (!sticky || !viewport || !track || !items.length) {
		return;
	}

	let maxTranslate = 0;
	let itemOffsets = [];
	let ticking = false;
	let mobileTicking = false;

	const isHorizontalMode = () => window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)").matches;
	const isMobileSlideMode = () => window.matchMedia("(max-width: 900px)").matches;

	const updateMobileActive = () => {
		if (!isMobileSlideMode()) {
			return;
		}

		const viewportRect = viewport.getBoundingClientRect();
		const viewportCenter = viewportRect.left + viewportRect.width / 2;
		let activeIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;

		items.forEach((item, index) => {
			const itemRect = item.getBoundingClientRect();
			const itemCenter = itemRect.left + itemRect.width / 2;
			const distance = Math.abs(viewportCenter - itemCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				activeIndex = index;
			}
		});

		items.forEach((item, index) => item.classList.toggle("is-active", index === activeIndex));
	};

	const measure = () => {
		if (!isHorizontalMode()) {
			section.style.removeProperty("--our-journey-scroll-height");
			section.style.removeProperty("--our-journey-line-width");
			section.style.removeProperty("--our-journey-translate");
			if (isMobileSlideMode()) {
				updateMobileActive();
			} else {
				items.forEach((item) => item.classList.remove("is-active"));
			}
			return;
		}

		itemOffsets = items.map((item) => item.offsetLeft);
		maxTranslate = Math.max(0, itemOffsets[itemOffsets.length - 1] || 0);
		const scrollDistance = Math.max(window.innerHeight, (items.length - 1) * window.innerHeight);
		section.style.setProperty("--our-journey-scroll-height", `${window.innerHeight + scrollDistance}px`);
		section.style.setProperty("--our-journey-line-width", `${track.scrollWidth}px`);
		update();
	};

	const update = () => {
		if (!isHorizontalMode()) {
			return;
		}

		const rect = section.getBoundingClientRect();
		const start = 0;
		const end = section.offsetHeight - window.innerHeight;
		const progress = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, end)));
		const scaledProgress = progress * Math.max(0, items.length - 1);
		const currentIndex = Math.min(items.length - 1, Math.floor(scaledProgress));
		const nextIndex = Math.min(items.length - 1, currentIndex + 1);
		const localProgress = scaledProgress - currentIndex;
		const currentOffset = itemOffsets[currentIndex] || 0;
		const nextOffset = itemOffsets[nextIndex] || currentOffset;
		const translate = currentOffset + (nextOffset - currentOffset) * localProgress;
		const activeIndex = Math.round(scaledProgress);

		section.style.setProperty("--our-journey-translate", `${-Math.min(maxTranslate, translate)}px`);
		items.forEach((item, index) => item.classList.toggle("is-active", index === activeIndex));
	};

	const requestUpdate = () => {
		if (ticking) {
			return;
		}
		ticking = true;
		window.requestAnimationFrame(() => {
			ticking = false;
			update();
		});
	};

	const requestMobileUpdate = () => {
		if (mobileTicking) {
			return;
		}
		mobileTicking = true;
		window.requestAnimationFrame(() => {
			mobileTicking = false;
			updateMobileActive();
		});
	};

	items.forEach((item) => {
		item.addEventListener("click", () => {
			if (!isMobileSlideMode()) {
				return;
			}

			item.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		});
	});

	measure();
	window.addEventListener("scroll", requestUpdate, { passive: true });
	window.addEventListener("resize", measure);
	window.addEventListener("load", measure);
	viewport.addEventListener("scroll", requestMobileUpdate, { passive: true });
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".our-journey").forEach(initJourney);
});
