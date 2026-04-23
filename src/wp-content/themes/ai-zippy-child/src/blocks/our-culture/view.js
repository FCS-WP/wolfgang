const initCultureGallery = (section) => {
	const gallery = section.querySelector(".our-culture__gallery");
	const items = Array.from(section.querySelectorAll(".our-culture__item"));

	if (!gallery || !items.length) {
		return;
	}

	const updateClasses = (activeItem) => {
		const activeIndex = items.indexOf(activeItem);

		items.forEach((item, index) => {
			const rawOffset = (index - activeIndex + items.length) % items.length;

			item.classList.toggle("is-active", item === activeItem);
			item.classList.toggle("is-offset-plus-1", rawOffset === 1);
			item.classList.toggle("is-offset-plus-2", rawOffset === 2);
			item.classList.toggle("is-offset-plus-3", rawOffset === 3);
			item.classList.toggle("is-offset-minus-1", rawOffset === items.length - 1);
			item.classList.toggle("is-offset-minus-2", rawOffset === items.length - 2);
			item.classList.toggle("is-hidden", item !== activeItem && ![1, 2, 3, items.length - 1, items.length - 2].includes(rawOffset));
		});
	};

	items.forEach((item) => {
		item.addEventListener("click", () => updateClasses(item));
	});

	const activeItem = section.querySelector(".our-culture__item.is-active") || items[Math.floor(items.length / 2)];
	updateClasses(activeItem);
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".our-culture").forEach(initCultureGallery);
});
