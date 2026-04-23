const initSiteHeaders = () => {
	const headers = document.querySelectorAll('.wp-block-ai-zippy-child-site-header');

	headers.forEach((header) => {
		const toggle = header.querySelector('.site-header__toggle');
		const drawer = header.querySelector('.site-header__drawer');
		const closeTriggers = header.querySelectorAll('[data-site-header-close], .site-header__drawer a');

		if (!toggle || !drawer) {
			return;
		}

		const setOpen = (isOpen) => {
			header.classList.toggle('is-drawer-open', isOpen);
			toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
			drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
			document.documentElement.classList.toggle('site-header-drawer-open', isOpen);
		};

		toggle.addEventListener('click', () => {
			setOpen(!header.classList.contains('is-drawer-open'));
		});

		closeTriggers.forEach((trigger) => {
			trigger.addEventListener('click', () => setOpen(false));
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				setOpen(false);
			}
		});
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initSiteHeaders);
} else {
	initSiteHeaders();
}
