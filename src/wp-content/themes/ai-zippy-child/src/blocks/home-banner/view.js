const SWIPER_CSS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
const SWIPER_JS = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";

let swiperLoader = null;

const injectSwiperStyles = () => {
	if (document.querySelector(`link[href="${SWIPER_CSS}"]`)) {
		return;
	}

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = SWIPER_CSS;
	document.head.appendChild(link);
};

const loadSwiper = () => {
	if (window.Swiper) {
		return Promise.resolve(window.Swiper);
	}

	if (swiperLoader) {
		return swiperLoader;
	}

	swiperLoader = new Promise((resolve, reject) => {
		const existingScript = document.querySelector(`script[src="${SWIPER_JS}"]`);

		if (existingScript) {
			existingScript.addEventListener("load", () => resolve(window.Swiper));
			existingScript.addEventListener("error", reject);
			return;
		}

		const script = document.createElement("script");
		script.src = SWIPER_JS;
		script.async = true;
		script.onload = () => resolve(window.Swiper);
		script.onerror = reject;
		document.head.appendChild(script);
	});

	return swiperLoader;
};

const initBanner = (banner, Swiper) => {
	const slider = banner.querySelector(".home-banner__slider");
	const slides = banner.querySelectorAll(".home-banner__slide");

	if (!slider || slides.length <= 1 || slider.swiper) {
		return;
	}

	const showArrows = banner.dataset.showArrows === "true";
	const showDots = banner.dataset.showDots === "true";
	const autoplayEnabled = banner.dataset.autoplay === "true";
	const autoplayDelay = Number(banner.dataset.autoplayDelay) || 6000;

	const options = {
		a11y: true,
		loop: true,
		speed: 650,
		slidesPerView: 1,
		spaceBetween: 0,
		watchOverflow: true,
		on: {
			slideChange(swiper) {
				slides.forEach((slide, index) => {
					slide.classList.toggle("is-active", index === swiper.realIndex);
				});
			},
		},
	};

	if (showArrows) {
		options.navigation = {
			prevEl: banner.querySelector(".home-banner__arrow--prev"),
			nextEl: banner.querySelector(".home-banner__arrow--next"),
		};
	}

	if (showDots) {
		options.pagination = {
			el: banner.querySelector(".home-banner__pagination"),
			bulletActiveClass: "is-active",
			bulletClass: "home-banner__dot",
			bulletElement: "button",
			clickable: true,
			renderBullet(index, className) {
				return `<button class="${className}" type="button" aria-label="Go to slide ${index + 1}"></button>`;
			},
		};
	}

	if (autoplayEnabled) {
		options.autoplay = {
			delay: autoplayDelay,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		};
	}

	new Swiper(slider, options);
};

const initHomeBanners = () => {
	const banners = Array.from(document.querySelectorAll(".wp-block-ai-zippy-child-home-banner"));

	if (!banners.length) {
		return;
	}

	injectSwiperStyles();
	loadSwiper()
		.then((Swiper) => {
			if (!Swiper) {
				return;
			}

			banners.forEach((banner) => initBanner(banner, Swiper));
		})
		.catch(() => {
			// Leave the first slide visible if the CDN script cannot load.
		});
};

document.addEventListener("DOMContentLoaded", initHomeBanners);
