import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, URLInputButton, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, SelectControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

export default function Edit({ attributes, setAttributes }) {
	const [menus, setMenus] = useState([]);
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
			</InspectorControls>
			<footer {...blockProps}>
				<div className="site-footer__inner">
					<div className="site-footer__brand">
						{attributes.logoUrl ? <img src={attributes.logoUrl} alt="" /> : <span>{document.title || "Site Logo"}</span>}
						<RichText tagName="p" value={attributes.description} onChange={(description) => setAttributes({ description })} placeholder="Footer description" />
					</div>
					<nav className="site-footer__nav" aria-label="Footer">
						<span>Choose a WordPress menu in the block settings.</span>
					</nav>
				</div>
				<RichText tagName="p" className="site-footer__copyright" value={attributes.copyright} onChange={(copyright) => setAttributes({ copyright })} placeholder="Copyright text" />
			</footer>
		</>
	);
}
