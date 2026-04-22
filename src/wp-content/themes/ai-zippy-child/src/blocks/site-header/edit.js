import { InspectorControls, MediaUpload, MediaUploadCheck, URLInputButton, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, SelectControl, TextControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const asItems = (items) => (Array.isArray(items) ? items : []);

export default function Edit({ attributes, setAttributes }) {
	const [menus, setMenus] = useState([]);
	const fallbackLinks = asItems(attributes.fallbackLinks);
	const logoStyle = {
		"--site-header-logo-width": `${attributes.logoWidth || 190}px`,
		"--site-header-logo-height": `${attributes.logoHeight || 52}px`,
	};
	const blockProps = useBlockProps({
		className: "site-header",
		style: {
			"--site-header-padding-top": `${attributes.paddingTop ?? 26}px`,
			"--site-header-padding-right": attributes.paddingRight === undefined ? undefined : `${attributes.paddingRight}px`,
			"--site-header-padding-bottom": `${attributes.paddingBottom ?? 26}px`,
			"--site-header-padding-left": attributes.paddingLeft === undefined ? undefined : `${attributes.paddingLeft}px`,
			"--site-header-margin-top": `${attributes.marginTop ?? 0}px`,
			"--site-header-margin-bottom": `${attributes.marginBottom ?? 0}px`,
		},
	});

	useEffect(() => {
		apiFetch({ path: "/ai-zippy-child/v1/menus" })
			.then((items) => setMenus(Array.isArray(items) ? items : []))
			.catch(() => setMenus([]));
	}, []);

	const menuOptions = [
		{ label: "No menu selected", value: 0 },
		...menus.map((menu) => ({ label: menu.name, value: menu.id })),
	];
	const updateFallbackLink = (index, patch) => {
		setAttributes({
			fallbackLinks: fallbackLinks.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)),
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Header" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={["image"]}
							value={attributes.logoId}
							onSelect={(media) => setAttributes({ logoId: media.id, logoUrl: media.url, logoAlt: media.alt || media.title || "" })}
							render={({ open }) => (
								<div className="site-header-editor__media">
									{attributes.logoUrl ? <img src={attributes.logoUrl} alt="" /> : <div>No logo selected</div>}
									<Button variant="secondary" onClick={open}>{attributes.logoUrl ? "Replace Logo" : "Select Logo"}</Button>
									{attributes.logoUrl ? (
										<Button variant="link" isDestructive onClick={() => setAttributes({ logoId: 0, logoUrl: "", logoAlt: "" })}>Remove</Button>
									) : null}
								</div>
							)}
						/>
					</MediaUploadCheck>
					<RangeControl
						label="Logo width"
						value={attributes.logoWidth}
						min={60}
						max={360}
						onChange={(logoWidth) => setAttributes({ logoWidth })}
					/>
					<RangeControl
						label="Logo height"
						value={attributes.logoHeight}
						min={24}
						max={180}
						onChange={(logoHeight) => setAttributes({ logoHeight })}
					/>
					<SelectControl label="Menu" value={attributes.menuId} options={menuOptions} onChange={(menuId) => setAttributes({ menuId: Number(menuId) })} />
					<TextControl label="CTA Text" value={attributes.ctaText} onChange={(ctaText) => setAttributes({ ctaText })} />
					<p>CTA URL</p>
					<URLInputButton url={attributes.ctaUrl} onChange={(ctaUrl) => setAttributes({ ctaUrl })} />
				</PanelBody>
				<PanelBody title="Spacing" initialOpen={false}>
					{[
						["paddingTop", "Padding top"],
						["paddingRight", "Padding right"],
						["paddingBottom", "Padding bottom"],
						["paddingLeft", "Padding left"],
						["marginTop", "Margin top"],
						["marginBottom", "Margin bottom"],
					].map(([key, label]) => (
						<RangeControl
							key={key}
							label={label}
							value={attributes[key]}
							min={0}
							max={160}
							step={2}
							onChange={(value) => setAttributes({ [key]: value })}
						/>
					))}
				</PanelBody>
				<PanelBody title="Fallback Links" initialOpen={false}>
					{fallbackLinks.map((link, index) => (
						<div className="site-header-editor__group" key={`${link.label}-${index}`}>
							<TextControl label="Label" value={link.label} onChange={(label) => updateFallbackLink(index, { label })} />
							<p>URL</p>
							<URLInputButton url={link.url} onChange={(url) => updateFallbackLink(index, { url })} />
						</div>
					))}
				</PanelBody>
			</InspectorControls>
			<header {...blockProps}>
				<div className="site-header__inner">
					<div className="site-header__brand">
						{attributes.logoUrl ? <img src={attributes.logoUrl} alt="" style={logoStyle} /> : (
							<span className="site-header__logo-text">
								<span>Wolfgang</span>
								<strong>Methos</strong>
							</span>
						)}
					</div>
					<nav className="site-header__nav" aria-label="Primary">
						{fallbackLinks.map((link, index) => <span key={`${link.label}-${index}`}>{link.label}</span>)}
					</nav>
					{attributes.ctaText ? <span className="site-header__cta">{attributes.ctaText}</span> : null}
					<button className="site-header__toggle" type="button" aria-label="Open menu">
						<span className="site-header__toggle-line"></span>
						<span className="site-header__toggle-line"></span>
						<span className="site-header__toggle-line"></span>
					</button>
				</div>
				<div className="site-header__drawer">
					<div className="site-header__drawer-top">
						<span className="site-header__drawer-title">Menu</span>
						<button className="site-header__drawer-close" type="button" aria-label="Close menu">×</button>
					</div>
					<nav className="site-header__drawer-nav" aria-label="Mobile">
						{fallbackLinks.map((link, index) => <span key={`${link.label}-${index}`}>{link.label}</span>)}
					</nav>
					{attributes.ctaText ? <span className="site-header__drawer-cta">{attributes.ctaText}</span> : null}
				</div>
			</header>
		</>
	);
}
