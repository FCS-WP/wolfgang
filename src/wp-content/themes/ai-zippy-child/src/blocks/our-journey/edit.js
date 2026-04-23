import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextareaControl, TextControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const defaultItem = {
	imageId: 0,
	imageUrl: "",
	imageAlt: "",
	year: "2025",
	title: "Milestone",
	description: "Describe this part of the journey.",
};
const asItems = (items) => (Array.isArray(items) && items.length ? items : [defaultItem]).map((item) => ({ ...defaultItem, ...item }));

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const items = asItems(attributes.items);
	const blockProps = useBlockProps({
		className: getSectionClassName("our-journey", attributes),
		style: {
			...getSectionStyle(attributes),
			"--our-journey-accent-start": attributes.accentStartColor || "#0167ff",
			"--our-journey-accent-end": attributes.accentEndColor || "#c5fda2",
			"--our-journey-card-width": `${attributes.cardWidth || 820}px`,
			"--our-journey-card-gap": `${attributes.cardGap || 380}px`,
		},
	});
	const setItems = (nextItems) => setAttributes({ items: nextItems });
	const updateItem = (index, patch) => setItems(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Colors" initialOpen={true}>
					<RangeControl label="Card width" value={attributes.cardWidth} min={420} max={980} step={10} onChange={(cardWidth) => setAttributes({ cardWidth })} />
					<RangeControl label="Card gap" value={attributes.cardGap} min={80} max={520} step={10} onChange={(cardGap) => setAttributes({ cardGap })} />
					<BaseControl label="Heading start color">
						<ColorPalette colors={themePalette || []} value={attributes.accentStartColor} onChange={(accentStartColor) => setAttributes({ accentStartColor: accentStartColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Heading end color">
						<ColorPalette colors={themePalette || []} value={attributes.accentEndColor} onChange={(accentEndColor) => setAttributes({ accentEndColor: accentEndColor || "" })} clearable />
					</BaseControl>
				</PanelBody>
				<PanelBody title="Timeline" initialOpen={true}>
					{items.map((item, index) => (
						<div className="our-journey-editor__item" key={index}>
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={item.imageId}
									onSelect={(media) => updateItem(index, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || media.title || "" })}
									render={({ open }) => (
										<div className="our-journey-editor__media">
											{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div>No image</div>}
											<Button variant="secondary" onClick={open}>{item.imageUrl ? "Replace Image" : "Upload Image"}</Button>
											{item.imageUrl ? <Button variant="link" isDestructive onClick={() => updateItem(index, { imageId: 0, imageUrl: "", imageAlt: "" })}>Remove</Button> : null}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<TextControl label="Image alt text" value={item.imageAlt} onChange={(imageAlt) => updateItem(index, { imageAlt })} />
							<TextControl label="Year / Label" value={item.year} onChange={(year) => updateItem(index, { year })} />
							<TextControl label="Title" value={item.title} onChange={(title) => updateItem(index, { title })} />
							<TextareaControl label="Description" rows={4} value={item.description} onChange={(description) => updateItem(index, { description })} />
							<Button variant="link" isDestructive disabled={items.length <= 1} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setItems([...items, { ...defaultItem }])}>Add Item</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="our-journey__sticky">
					<div className="our-journey__inner az-section__inner">
						<RichText tagName="h2" className="our-journey__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
						<div className="our-journey__viewport">
							<div className="our-journey__track">
								{items.map((item, index) => (
									<article className="our-journey__item" key={index}>
										<div className="our-journey__media">
											{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div className="our-journey__placeholder">Upload image</div>}
										</div>
										<div className="our-journey__content">
											<h3 className="our-journey__title">
												{item.year ? <span>{item.year} | </span> : null}
												<RichText tagName="span" value={item.title} allowedFormats={[]} onChange={(title) => updateItem(index, { title })} />
											</h3>
											<RichText tagName="p" className="our-journey__description" value={item.description} allowedFormats={["core/bold", "core/italic"]} onChange={(description) => updateItem(index, { description })} />
										</div>
									</article>
								))}
							</div>
							<div className="our-journey__line" aria-hidden="true" />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
