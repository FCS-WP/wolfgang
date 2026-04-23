import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, TextControl } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const defaultTab = { label: "New Tab", items: [] };

const asTabs = (tabs) => (Array.isArray(tabs) && tabs.length ? tabs : [{ ...defaultTab }]).map((tab) => ({
	...defaultTab,
	...tab,
	items: Array.isArray(tab.items) ? tab.items : [],
}));

const mediaToItem = (media) => {
	const mime = media.mime || media.mime_type || "";
	const type = media.type === "video" || mime.indexOf("video/") === 0 ? "video" : "image";

	return {
		id: media.id || 0,
		type,
		url: media.url || "",
		alt: media.alt || media.title || "",
		title: media.title || "",
	};
};

export default function Edit({ attributes, setAttributes }) {
	const tabs = asTabs(attributes.tabs);
	const [activeTab, setActiveTab] = useState(0);
	const activeIndex = Math.min(activeTab, tabs.length - 1);
	const blockProps = useBlockProps({
		className: getSectionClassName("projects-gallery", attributes),
		style: {
			...getSectionStyle(attributes),
			"--projects-gallery-columns": attributes.columns || 4,
			"--projects-gallery-gap": `${attributes.gap ?? 20}px`,
			"--projects-gallery-radius": `${attributes.itemRadius ?? 0}px`,
		},
	});
	const setTabs = (nextTabs) => setAttributes({ tabs: nextTabs });
	const updateTab = (index, patch) => setTabs(tabs.map((tab, tabIndex) => (tabIndex === index ? { ...tab, ...patch } : tab)));
	const addItems = (index, media) => {
		const selected = Array.isArray(media) ? media : [media];
		updateTab(index, { items: [...tabs[index].items, ...selected.map(mediaToItem)] });
	};
	const removeItem = (tabIndex, itemIndex) => {
		updateTab(tabIndex, { items: tabs[tabIndex].items.filter((_, index) => index !== itemIndex) });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Gallery" initialOpen={true}>
					<RangeControl label="Columns" value={attributes.columns} min={2} max={5} step={1} onChange={(columns) => setAttributes({ columns })} />
					<RangeControl label="Gap" value={attributes.gap} min={8} max={44} step={2} onChange={(gap) => setAttributes({ gap })} />
					<RangeControl label="Item radius" value={attributes.itemRadius} min={0} max={28} step={1} onChange={(itemRadius) => setAttributes({ itemRadius })} />
					{tabs.map((tab, tabIndex) => (
						<div className="projects-gallery-editor__tab" key={tabIndex}>
							<TextControl label={`Tab ${tabIndex + 1} label`} value={tab.label} onChange={(label) => updateTab(tabIndex, { label })} />
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image", "video"]}
									multiple
									value={tab.items.map((item) => item.id).filter(Boolean)}
									onSelect={(media) => addItems(tabIndex, media)}
									render={({ open }) => <Button variant="secondary" onClick={open}>Add Images / Videos</Button>}
								/>
							</MediaUploadCheck>
							<div className="projects-gallery-editor__items">
								{tab.items.map((item, itemIndex) => (
									<div className="projects-gallery-editor__item" key={itemIndex}>
										{item.type === "video" ? <video src={item.url} muted playsInline /> : <img src={item.url} alt="" />}
										<Button variant="link" isDestructive onClick={() => removeItem(tabIndex, itemIndex)}>Remove</Button>
									</div>
								))}
							</div>
							<Button variant="link" isDestructive disabled={tabs.length <= 1} onClick={() => {
								setTabs(tabs.filter((_, index) => index !== tabIndex));
								setActiveTab(0);
							}}>Remove Tab</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setTabs([...tabs, { ...defaultTab }])}>Add Tab</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="projects-gallery__inner az-section__inner">
					<RichText tagName="h2" className="projects-gallery__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
					<div className="projects-gallery__tabs" role="tablist" aria-label="Project categories">
						{tabs.map((tab, tabIndex) => (
							<button className={`projects-gallery__tab${tabIndex === activeIndex ? " is-active" : ""}`} type="button" key={tabIndex} onClick={() => setActiveTab(tabIndex)}>
								{tab.label}
							</button>
						))}
					</div>
					<div className="projects-gallery__grid">
						{tabs[activeIndex].items.length ? tabs[activeIndex].items.map((item, itemIndex) => (
							<div className={`projects-gallery__item projects-gallery__item--${item.type}`} key={itemIndex}>
								{item.type === "video" ? <video src={item.url} muted playsInline preload="metadata" /> : <img src={item.url} alt="" />}
								{item.type === "video" ? <span className="projects-gallery__play" aria-hidden="true" /> : null}
							</div>
						)) : <div className="projects-gallery__empty">Add project media to this tab.</div>}
					</div>
				</div>
			</section>
		</>
	);
}
