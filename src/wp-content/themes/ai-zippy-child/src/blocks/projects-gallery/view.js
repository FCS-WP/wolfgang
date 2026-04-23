const createLightbox = () => {
	let lightbox = document.querySelector(".projects-gallery-lightbox");

	if (lightbox) {
		return lightbox;
	}

	lightbox = document.createElement("div");
	lightbox.className = "projects-gallery-lightbox";
	lightbox.innerHTML = '<button class="projects-gallery-lightbox__close" type="button" aria-label="Close">x</button><button class="projects-gallery-lightbox__nav projects-gallery-lightbox__nav--prev" type="button" aria-label="Previous item"></button><div class="projects-gallery-lightbox__media"></div><button class="projects-gallery-lightbox__nav projects-gallery-lightbox__nav--next" type="button" aria-label="Next item"></button>';
	document.body.appendChild(lightbox);
	lightbox._projectsGalleryState = { items: [], index: 0 };

	const close = () => {
		const media = lightbox.querySelector(".projects-gallery-lightbox__media");
		lightbox.classList.remove("is-open");
		lightbox.setAttribute("aria-hidden", "true");
		media.innerHTML = "";
	};
	const showItem = (nextIndex) => {
		const state = lightbox._projectsGalleryState;
		const media = lightbox.querySelector(".projects-gallery-lightbox__media");

		if (!state.items.length) {
			return;
		}

		state.index = (nextIndex + state.items.length) % state.items.length;
		const item = state.items[state.index];
		const type = item.dataset.projectsMediaType;
		const url = item.dataset.projectsMediaUrl;
		const alt = item.dataset.projectsMediaAlt || "";

		media.innerHTML = type === "video"
			? `<video src="${url}" controls autoplay playsinline></video>`
			: `<img src="${url}" alt="${alt}">`;
	};
	const move = (direction) => {
		const state = lightbox._projectsGalleryState;
		showItem(state.index + direction);
	};

	lightbox.addEventListener("click", (event) => {
		if (event.target === lightbox || event.target.closest(".projects-gallery-lightbox__close")) {
			close();
		}
		if (event.target.closest(".projects-gallery-lightbox__nav--prev")) {
			move(-1);
		}
		if (event.target.closest(".projects-gallery-lightbox__nav--next")) {
			move(1);
		}
	});
	document.addEventListener("keydown", (event) => {
		if (!lightbox.classList.contains("is-open")) {
			return;
		}
		if (event.key === "Escape") {
			close();
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			move(-1);
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			move(1);
		}
	});
	lightbox._projectsGalleryShowItem = showItem;

	return lightbox;
};

const initProjectsGallery = (section) => {
	const tabs = Array.from(section.querySelectorAll("[data-projects-tab]"));
	const panels = Array.from(section.querySelectorAll("[data-projects-panel]"));
	const items = Array.from(section.querySelectorAll("[data-projects-media-url]"));

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const index = tab.dataset.projectsTab;
			tabs.forEach((item) => {
				const isActive = item.dataset.projectsTab === index;
				item.classList.toggle("is-active", isActive);
				item.setAttribute("aria-selected", isActive ? "true" : "false");
			});
			panels.forEach((panel) => {
				const isActive = panel.dataset.projectsPanel === index;
				panel.classList.toggle("is-active", isActive);
				panel.hidden = !isActive;
			});
		});
	});

	items.forEach((item) => {
		item.addEventListener("click", () => {
			const lightbox = createLightbox();
			const panel = item.closest("[data-projects-panel]");
			const panelItems = Array.from(panel ? panel.querySelectorAll("[data-projects-media-url]") : items);
			const index = Math.max(0, panelItems.indexOf(item));

			lightbox._projectsGalleryState = { items: panelItems, index };
			lightbox._projectsGalleryShowItem(index);
			lightbox.classList.add("is-open");
			lightbox.setAttribute("aria-hidden", "false");
			lightbox.querySelector(".projects-gallery-lightbox__close").focus();
		});
	});
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".projects-gallery").forEach(initProjectsGallery);
});
