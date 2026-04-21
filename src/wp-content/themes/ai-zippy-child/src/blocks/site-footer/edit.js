import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, URLInputButton, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, SelectControl, TextControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const asItems = (items) => (Array.isArray(items) ? items : []);

export default function Edit({ attributes, setAttributes }) {
	const [menus, setMenus] = useState([]);
	const fallbackLinks = asItems(attributes.fallbackLinks);
	const blockProps = useBlockProps({ className: "site-footer" });

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
		setAttributes({ fallbackLinks: fallbackLinks.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)) });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Footer" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={["image"]}
							value={attributes.logoId}
							onSelect={(media) => setAttributes({ logoId: media.id, logoUrl: media.url, logoAlt: media.alt || media.title || "" })}
							render={({ open }) => (
								<div className="site-footer-editor__media">
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
				</PanelBody>
				<PanelBody title="Fallback Links" initialOpen={false}>
					{fallbackLinks.map((link, index) => (
						<div className="site-footer-editor__group" key={`${link.label}-${index}`}>
							<TextControl label="Label" value={link.label} onChange={(label) => updateFallbackLink(index, { label })} />
							<p>URL</p>
							<URLInputButton url={link.url} onChange={(url) => updateFallbackLink(index, { url })} />
						</div>
					))}
				</PanelBody>
			</InspectorControls>
			<footer {...blockProps}>
				<div className="site-footer__inner">
					<div className="site-footer__brand">
						{attributes.logoUrl ? <img src={attributes.logoUrl} alt="" /> : (
							<span className="site-footer__logo-text">
								<span>Wolfgang</span>
								<strong>Methos</strong>
							</span>
						)}
						<RichText tagName="p" className="site-footer__description" value={attributes.description} onChange={(description) => setAttributes({ description })} placeholder="Footer description" />
					</div>
					<nav className="site-footer__nav" aria-label="Footer">
						{fallbackLinks.map((link, index) => <span key={`${link.label}-${index}`}>{link.label}</span>)}
					</nav>
					<div className="site-footer__contact">
						<RichText tagName="p" value={attributes.contactText} onChange={(contactText) => setAttributes({ contactText })} placeholder="Contact details" />
						<RichText tagName="p" className="site-footer__copyright" value={attributes.copyright} onChange={(copyright) => setAttributes({ copyright })} placeholder="Copyright text" />
					</div>
				</div>
			</footer>
		</>
	);
}
