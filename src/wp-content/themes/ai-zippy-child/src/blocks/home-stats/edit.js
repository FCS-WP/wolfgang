import { InspectorControls, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextControl } from "@wordpress/components";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";

const defaultItem = { value: "1000+", label: "client served" };
const asItems = (items) => (Array.isArray(items) && items.length ? items : [
	{ value: "1000+", label: "client served" },
	{ value: "100%", label: "claim rate" },
	{ value: "5", label: "years of expertise" },
]).map((item) => ({ ...defaultItem, ...item }));

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const items = asItems(attributes.items);
	const blockProps = useBlockProps({
		className: getSectionClassName("home-stats", attributes),
		style: {
			...getSectionStyle(attributes),
			"--home-stats-start": attributes.startColor || "#b8ff9b",
			"--home-stats-end": attributes.endColor || "#1688ff",
			"--home-stats-columns": attributes.columns || 3,
			"--home-stats-gap": `${attributes.gap || 72}px`,
		},
	});

	const setItems = (nextItems) => setAttributes({ items: nextItems });
	const updateItem = (index, patch) => setItems(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Stats" initialOpen={true}>
					<RangeControl label="Columns" value={attributes.columns} min={1} max={4} step={1} onChange={(columns) => setAttributes({ columns })} />
					<RangeControl label="Gap" value={attributes.gap} min={20} max={160} step={2} onChange={(gap) => setAttributes({ gap })} />
					<BaseControl label="Number start color">
						<ColorPalette colors={themePalette || []} value={attributes.startColor} onChange={(startColor) => setAttributes({ startColor: startColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Number end color">
						<ColorPalette colors={themePalette || []} value={attributes.endColor} onChange={(endColor) => setAttributes({ endColor: endColor || "" })} clearable />
					</BaseControl>
				</PanelBody>
				<PanelBody title="Items" initialOpen={true}>
					{items.map((item, index) => (
						<div className="home-stats-editor__item" key={index}>
							<TextControl label={`Value ${index + 1}`} value={item.value} onChange={(value) => updateItem(index, { value })} />
							<TextControl label="Label" value={item.label} onChange={(label) => updateItem(index, { label })} />
							<Button variant="link" isDestructive disabled={items.length <= 1} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setItems([...items, { ...defaultItem, value: "10+" }])}>Add Item</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="home-stats__inner az-section__inner">
					<div className="home-stats__grid">
						{items.map((item, index) => (
							<div className="home-stats__item" key={index}>
								<div className="home-stats__value">{item.value}</div>
								<div className="home-stats__label">{item.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
