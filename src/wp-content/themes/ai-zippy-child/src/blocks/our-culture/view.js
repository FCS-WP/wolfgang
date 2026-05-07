const getOrbitValues = (gallery, total, index, activeIndex) => {
	const galleryWidth = gallery.clientWidth || 1180;
	const isMobile = window.matchMedia("(max-width: 767px)").matches;
	const baseWidth = isMobile
		? Math.max(72, Math.min(150, galleryWidth / Math.max(total * 0.95, 3.8)))
		: Math.max(96, Math.min(260, galleryWidth / Math.max(total * 0.58, 4.2)));
	const radiusX = isMobile
		? Math.max(90, galleryWidth * 0.36)
		: Math.max(220, Math.min(galleryWidth * 0.4, 420 + Math.max(total - 6, 0) * 10));
	const radiusY = isMobile
		? Math.max(28, Math.min(60, baseWidth * 0.26))
		: Math.max(72, Math.min(180, 96 + total * 4));
	const angle = ((index - activeIndex) / total) * Math.PI * 2 + Math.PI / 2;
	const x = Math.cos(angle) * radiusX;
	const y = Math.sin(angle) * radiusY;
	const depth = (y / radiusY + 1) / 2;
	const scale = (isMobile ? 0.44 : 0.54) + depth * (isMobile ? 0.56 : 0.46);
	const opacity = 0.18 + depth * 0.82;
	const overlayOpacity = index === activeIndex ? 0 : Math.max(0.12, 0.62 - depth * 0.42);
	const zIndex = 10 + Math.round(depth * 40);

	return { baseWidth, x, y, scale, opacity, overlayOpacity, zIndex };
};

const initCultureGallery = (section) => {
	const gallery = section.querySelector(".our-culture__gallery");
	const items = Array.from(section.querySelectorAll(".our-culture__item"));

	if (!gallery || items.length < 1) {
		return;
	}

	const autoRun = section.dataset.autoRun === "true";
	const autoRunDelay = Number(section.dataset.autoRunDelay) || 3200;
	let activeIndex = Math.max(0, items.findIndex((item) => item.classList.contains("is-active")));
	let timer = null;

	const applyLayout = () => {
		items.forEach((item, index) => {
			const { baseWidth, x, y, scale, opacity, overlayOpacity, zIndex } = getOrbitValues(gallery, items.length, index, activeIndex);

			item.classList.toggle("is-active", index === activeIndex);
			item.style.setProperty("--our-culture-item-x", `${x.toFixed(2)}px`);
			item.style.setProperty("--our-culture-item-y", `${y.toFixed(2)}px`);
			item.style.setProperty("--our-culture-item-scale", scale.toFixed(4));
			item.style.setProperty("--our-culture-item-opacity", opacity.toFixed(4));
			item.style.setProperty("--our-culture-item-z", String(zIndex));
			item.style.setProperty("--our-culture-item-overlay-opacity", overlayOpacity.toFixed(4));
			item.style.setProperty("--our-culture-item-base-width", `${baseWidth.toFixed(2)}px`);
		});
	};

	const stopAutoRun = () => {
		if (timer) {
			window.clearInterval(timer);
			timer = null;
		}
	};

	const startAutoRun = () => {
		stopAutoRun();
		if (!autoRun || items.length <= 1) {
			return;
		}

		timer = window.setInterval(() => {
			activeIndex = (activeIndex + 1) % items.length;
			applyLayout();
		}, autoRunDelay);
	};

	items.forEach((item, index) => {
		item.addEventListener("click", () => {
			activeIndex = index;
			applyLayout();
			startAutoRun();
		});
	});

	window.addEventListener("resize", applyLayout, { passive: true });
	section.addEventListener("mouseenter", stopAutoRun);
	section.addEventListener("mouseleave", startAutoRun);
	section.addEventListener("focusin", stopAutoRun);
	section.addEventListener("focusout", startAutoRun);

	applyLayout();
	startAutoRun();
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".our-culture").forEach(initCultureGallery);
});
