import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, TextareaControl, TextControl, ToggleControl } from "@wordpress/components";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";

const defaultItem = {
	quote: "\"Add a testimonial and showcase positive feedback from a happy client or customer.\"",
	name: "Client 01",
	company: "Company's Name",
};

const asItems = (items) => (Array.isArray(items) && items.length ? items : [defaultItem]).map((item) => ({ ...defaultItem, ...item }));

export default function Edit({ attributes, setAttributes }) {
	const items = asItems(attributes.items);
	const blockProps = useBlockProps({
		className: getSectionClassName("testimonials", attributes),
		style: {
			...getSectionStyle(attributes),
			"--testimonials-quote-width": `${attributes.quoteMaxWidth || 820}px`,
		},
	});

	const setItems = (nextItems) => setAttributes({ items: nextItems });
	const updateItem = (index, patch) => setItems(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
	const duplicateItem = (index) => {
		const nextItems = [...items];
		nextItems.splice(index + 1, 0, { ...items[index] });
		setItems(nextItems);
	};
	const moveItem = (index, direction) => {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= items.length) {
			return;
		}
		const nextItems = [...items];
		const [item] = nextItems.splice(index, 1);
		nextItems.splice(nextIndex, 0, item);
		setItems(nextItems);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Slider" initialOpen={true}>
					<RangeControl label="Quote max width" value={attributes.quoteMaxWidth} min={520} max={1100} step={10} onChange={(quoteMaxWidth) => setAttributes({ quoteMaxWidth })} />
					<ToggleControl label="Show arrows" checked={Boolean(attributes.showArrows)} onChange={(showArrows) => setAttributes({ showArrows })} />
					<ToggleControl label="Show dots" checked={Boolean(attributes.showDots)} onChange={(showDots) => setAttributes({ showDots })} />
					<ToggleControl label="Autoplay" checked={Boolean(attributes.autoplay)} onChange={(autoplay) => setAttributes({ autoplay })} />
					{attributes.autoplay ? (
						<RangeControl label="Autoplay delay" value={attributes.autoplayDelay} min={2500} max={12000} step={500} onChange={(autoplayDelay) => setAttributes({ autoplayDelay })} />
					) : null}
				</PanelBody>
				<PanelBody title="Testimonials" initialOpen={true}>
					{items.map((item, index) => (
						<div className="testimonials-editor__item" key={index}>
							<TextareaControl label={`Quote ${index + 1}`} rows={4} value={item.quote} onChange={(quote) => updateItem(index, { quote })} />
							<TextControl label={`Client ${index + 1}`} value={item.name} onChange={(name) => updateItem(index, { name })} />
							<TextControl label="Company" value={item.company} onChange={(company) => updateItem(index, { company })} />
							<div className="testimonials-editor__actions">
								<Button variant="secondary" disabled={index === 0} onClick={() => moveItem(index, -1)}>Move Up</Button>
								<Button variant="secondary" disabled={index === items.length - 1} onClick={() => moveItem(index, 1)}>Move Down</Button>
								<Button variant="secondary" onClick={() => duplicateItem(index)}>Duplicate</Button>
								<Button variant="link" isDestructive disabled={items.length <= 1} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
							</div>
						</div>
					))}
					<Button variant="primary" onClick={() => setItems([...items, { ...defaultItem, name: `Client ${String(items.length + 1).padStart(2, "0")}` }])}>Add Testimonial</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="testimonials__inner az-section__inner">
					<RichText tagName="p" className="testimonials__eyebrow" value={attributes.eyebrow} allowedFormats={[]} onChange={(eyebrow) => setAttributes({ eyebrow })} />
					<div className="testimonials__viewport">
						<div className="testimonials__track">
							{items.map((item, index) => (
								<article className={`testimonials__slide${index === 0 ? " is-active" : ""}`} key={index}>
									<RichText tagName="blockquote" className="testimonials__quote" value={item.quote} allowedFormats={["core/bold", "core/italic"]} onChange={(quote) => updateItem(index, { quote })} />
									<div className="testimonials__meta">
										<RichText tagName="div" className="testimonials__name" value={item.name} allowedFormats={[]} onChange={(name) => updateItem(index, { name })} />
										<RichText tagName="div" className="testimonials__company" value={item.company} allowedFormats={[]} onChange={(company) => updateItem(index, { company })} />
									</div>
								</article>
							))}
						</div>
					</div>
					{attributes.showArrows ? (
						<div className="testimonials__arrows" aria-hidden="true">
							<span className="testimonials__arrow testimonials__arrow--prev" />
							<span className="testimonials__arrow testimonials__arrow--next" />
						</div>
					) : null}
					{attributes.showDots ? (
						<div className="testimonials__dots" aria-hidden="true">
							{items.map((_, index) => <span className={`testimonials__dot${index === 0 ? " is-active" : ""}`} key={index} />)}
						</div>
					) : null}
				</div>
			</section>
		</>
	);
}
