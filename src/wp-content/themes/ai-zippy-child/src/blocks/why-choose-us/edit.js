import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
	useSettings,
} from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextareaControl, TextControl } from "@wordpress/components";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";
import { WhyIcon } from "./icons.js";

const defaultItem = {
	icon: "solution",
	iconId: 0,
	iconUrl: "",
	iconAlt: "",
	title: "New feature",
	description: "Describe this reason.",
};

const asItems = (items) => (Array.isArray(items) && items.length ? items : []).map((item) => ({ ...defaultItem, ...item }));

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const items = asItems(attributes.items);
	const blockProps = useBlockProps({
		className: getSectionClassName("why-choose-us", attributes),
		style: {
			...getSectionStyle(attributes),
			"--why-choose-heading-start": attributes.headingStartColor || "#1688ff",
			"--why-choose-heading-end": attributes.headingEndColor || "#c8ff9a",
			"--why-choose-icon-color": attributes.iconColor || "#c8ff9a",
			"--why-choose-columns": attributes.columns || 3,
			"--why-choose-gap": `${attributes.gap || 120}px`,
		},
	});
	const setItems = (nextItems) => setAttributes({ items: nextItems });
	const updateItem = (index, patch) => setItems(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Layout" initialOpen={true}>
					<RangeControl label="Columns" value={attributes.columns} min={1} max={4} step={1} onChange={(columns) => setAttributes({ columns })} />
					<RangeControl label="Gap" value={attributes.gap} min={40} max={180} step={2} onChange={(gap) => setAttributes({ gap })} />
					<BaseControl label="Heading start color">
						<ColorPalette colors={themePalette || []} value={attributes.headingStartColor} onChange={(headingStartColor) => setAttributes({ headingStartColor: headingStartColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Heading end color">
						<ColorPalette colors={themePalette || []} value={attributes.headingEndColor} onChange={(headingEndColor) => setAttributes({ headingEndColor: headingEndColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Fallback icon color">
						<ColorPalette colors={themePalette || []} value={attributes.iconColor} onChange={(iconColor) => setAttributes({ iconColor: iconColor || "" })} clearable />
					</BaseControl>
				</PanelBody>
				<PanelBody title="Items" initialOpen={true}>
					{items.map((item, index) => (
						<div className="why-choose-us-editor__item" key={index}>
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={item.iconId}
									onSelect={(media) => updateItem(index, {
										iconId: media.id,
										iconUrl: media.url,
										iconAlt: media.alt || media.title || "",
									})}
									render={({ open }) => (
										<div className="why-choose-us-editor__icon">
											{item.iconUrl ? <img src={item.iconUrl} alt="" /> : <WhyIcon name={item.icon} />}
											<Button variant="secondary" onClick={open}>{item.iconUrl ? "Replace Icon" : "Upload Icon"}</Button>
											{item.iconUrl ? (
												<Button variant="link" isDestructive onClick={() => updateItem(index, { iconId: 0, iconUrl: "", iconAlt: "" })}>Remove</Button>
											) : null}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<TextControl label="Icon alt text" value={item.iconAlt} onChange={(iconAlt) => updateItem(index, { iconAlt })} />
							<TextControl label="Title" value={item.title} onChange={(title) => updateItem(index, { title })} />
							<TextareaControl label="Description" rows={5} value={item.description} onChange={(description) => updateItem(index, { description })} />
							<Button variant="link" isDestructive disabled={items.length <= 1} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setItems([...items, { ...defaultItem }])}>Add Item</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="why-choose-us__inner az-section__inner">
					<RichText tagName="h2" className="why-choose-us__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
					<div className="why-choose-us__grid">
						{items.map((item, index) => (
							<div className="why-choose-us__item" key={index}>
								{item.iconUrl ? <img className="why-choose-us__icon" src={item.iconUrl} alt="" /> : <WhyIcon name={item.icon} />}
								<RichText tagName="h3" className="why-choose-us__title" value={item.title} allowedFormats={[]} onChange={(title) => updateItem(index, { title })} />
								<RichText tagName="p" className="why-choose-us__description" value={item.description} allowedFormats={[]} onChange={(description) => updateItem(index, { description })} />
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
