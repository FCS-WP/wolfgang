import { InspectorControls, MediaUpload, MediaUploadCheck, URLInputButton, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, SelectControl, TextControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const asItems = (items) => (Array.isArray(items) ? items : []);

export default function Edit({ attributes, setAttributes }) {
	const [menus, setMenus] = useState([]);
	const fallbackLinks = asItems(attributes.fallbackLinks);
	const blockProps = useBlockProps({ className: "site-header" });

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
					<SelectControl label="Menu" value={attributes.menuId} options={menuOptions} onChange={(menuId) => setAttributes({ menuId: Number(menuId) })} />
					<TextControl label="CTA Text" value={attributes.ctaText} onChange={(ctaText) => setAttributes({ ctaText })} />
					<p>CTA URL</p>
					<URLInputButton url={attributes.ctaUrl} onChange={(ctaUrl) => setAttributes({ ctaUrl })} />
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
						{attributes.logoUrl ? <img src={attributes.logoUrl} alt="" /> : (
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
				</div>
			</header>
		</>
	);
}
