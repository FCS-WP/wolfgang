const initHomeBanner = (banner) => {
	const slides = Array.from(banner.querySelectorAll(".home-banner__slide"));
	const dots = Array.from(banner.querySelectorAll(".home-banner__dot"));
	const prev = banner.querySelector(".home-banner__arrow--prev");
	const next = banner.querySelector(".home-banner__arrow--next");

	if (slides.length <= 1) {
		return;
	}

	let active = slides.findIndex((slide) => slide.classList.contains("is-active"));
	let timer = null;
	active = active >= 0 ? active : 0;

	const show = (index) => {
		active = (index + slides.length) % slides.length;
		slides.forEach((slide, slideIndex) => {
			slide.classList.toggle("is-active", slideIndex === active);
		});
		dots.forEach((dot, dotIndex) => {
			const isActive = dotIndex === active;
			dot.classList.toggle("is-active", isActive);
			dot.setAttribute("aria-current", isActive ? "true" : "false");
		});
	};

	const stop = () => {
		if (timer) {
			window.clearInterval(timer);
			timer = null;
		}
	};

	const start = () => {
		stop();
		if (banner.dataset.autoplay !== "true") {
			return;
		}

		const delay = Number(banner.dataset.autoplayDelay) || 6000;
		timer = window.setInterval(() => show(active + 1), delay);
	};

	prev?.addEventListener("click", () => {
		show(active - 1);
		start();
	});
	next?.addEventListener("click", () => {
		show(active + 1);
		start();
	});
	dots.forEach((dot, index) => {
		dot.addEventListener("click", () => {
			show(index);
			start();
		});
	});

	banner.addEventListener("mouseenter", stop);
	banner.addEventListener("mouseleave", start);
	banner.addEventListener("focusin", stop);
	banner.addEventListener("focusout", start);

	show(active);
	start();
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".wp-block-ai-zippy-child-home-banner").forEach(initHomeBanner);
});
