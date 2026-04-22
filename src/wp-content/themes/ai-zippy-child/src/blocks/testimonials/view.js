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
