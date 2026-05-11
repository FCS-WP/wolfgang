const initTestimonials = (section) => {
	const track = section.querySelector(".testimonials__track");
	const slides = Array.from(section.querySelectorAll(".testimonials__slide"));
	const dots = Array.from(section.querySelectorAll(".testimonials__dot"));
	const prev = section.querySelector(".testimonials__arrow--prev");
	const next = section.querySelector(".testimonials__arrow--next");

	if (!track || slides.length <= 1) {
		return;
	}

	let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
	let timer = null;
	let touchStartX = 0;
	let touchStartY = 0;
	const autoplay = section.dataset.autoplay === "true";
	const delay = Number(section.dataset.autoplayDelay) || 6000;

	const goTo = (nextIndex) => {
		activeIndex = (nextIndex + slides.length) % slides.length;
		track.style.transform = `translateX(-${activeIndex * 100}%)`;
		slides.forEach((slide, index) => {
			const isActive = index === activeIndex;
			slide.classList.toggle("is-active", isActive);
			slide.setAttribute("aria-hidden", isActive ? "false" : "true");
		});
		dots.forEach((dot, index) => {
			const isActive = index === activeIndex;
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
		if (!autoplay) {
			return;
		}
		stop();
		timer = window.setInterval(() => goTo(activeIndex + 1), delay);
	};

	prev?.addEventListener("click", () => {
		goTo(activeIndex - 1);
		start();
	});
	next?.addEventListener("click", () => {
		goTo(activeIndex + 1);
		start();
	});
	dots.forEach((dot, index) => {
		dot.addEventListener("click", () => {
			goTo(index);
			start();
		});
	});
	track.addEventListener("touchstart", (event) => {
		const touch = event.changedTouches?.[0];
		if (!touch) {
			return;
		}

		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
		stop();
	}, { passive: true });
	track.addEventListener("touchend", (event) => {
		const touch = event.changedTouches?.[0];
		if (!touch) {
			start();
			return;
		}

		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		const absX = Math.abs(deltaX);
		const absY = Math.abs(deltaY);

		if (absX > 36 && absX > absY) {
			goTo(activeIndex + (deltaX < 0 ? 1 : -1));
		}

		start();
	}, { passive: true });
	section.addEventListener("mouseenter", stop);
	section.addEventListener("mouseleave", start);
	section.addEventListener("focusin", stop);
	section.addEventListener("focusout", start);

	goTo(activeIndex);
	start();
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".testimonials").forEach(initTestimonials);
});
