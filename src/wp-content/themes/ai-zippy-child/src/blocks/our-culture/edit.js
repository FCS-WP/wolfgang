import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextControl } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const asImages = (images) => (Array.isArray(images) ? images : []);
const getItemClassName = (index, activeIndex, total) => {
	const rawOffset = (index - activeIndex + total) % total;
	let className = "our-culture__item";

	if (index === activeIndex) {
		className += " is-active";
	} else if (rawOffset === 1) {
		className += " is-offset-plus-1";
	} else if (rawOffset === 2) {
		className += " is-offset-plus-2";
	} else if (rawOffset === 3) {
		className += " is-offset-plus-3";
	} else if (rawOffset === total - 1) {
		className += " is-offset-minus-1";
	} else if (rawOffset === total - 2) {
		className += " is-offset-minus-2";
	} else {
		className += " is-hidden";
	}

	return className;
};

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const images = asImages(attributes.images);
	const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2));
	const blockProps = useBlockProps({
		className: getSectionClassName("our-culture", attributes),
		style: {
			...getSectionStyle(attributes),
			"--our-culture-accent-start": attributes.accentStartColor || "#0167ff",
			"--our-culture-accent-end": attributes.accentEndColor || "#c5fda2",
			"--our-culture-image-height": `${attributes.imageHeight || 360}px`,
		},
	});
	const setImages = (nextImages) => setAttributes({ images: nextImages });
	const updateImage = (index, patch) => setImages(images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...patch } : image)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Carousel" initialOpen={true}>
					<RangeControl label="Image height" value={attributes.imageHeight} min={220} max={520} step={10} onChange={(imageHeight) => setAttributes({ imageHeight })} />
					<BaseControl label="Heading start color">
						<ColorPalette colors={themePalette || []} value={attributes.accentStartColor} onChange={(accentStartColor) => setAttributes({ accentStartColor: accentStartColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Heading end color">
						<ColorPalette colors={themePalette || []} value={attributes.accentEndColor} onChange={(accentEndColor) => setAttributes({ accentEndColor: accentEndColor || "" })} clearable />
					</BaseControl>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={["image"]}
							multiple
							gallery
							onSelect={(media) => {
								const selected = Array.isArray(media) ? media : [media];
								setImages([...images, ...selected.map((item) => ({ id: item.id, url: item.url, alt: item.alt || item.title || "" }))]);
							}}
							render={({ open }) => <Button variant="primary" onClick={open}>Add Images</Button>}
						/>
					</MediaUploadCheck>
					{images.map((image, index) => (
						<div className="our-culture-editor__image" key={index}>
							{image.url ? <img src={image.url} alt="" /> : null}
							<TextControl label="Alt text" value={image.alt} onChange={(alt) => updateImage(index, { alt })} />
							<Button variant="link" isDestructive onClick={() => setImages(images.filter((_, imageIndex) => imageIndex !== index))}>Remove</Button>
						</div>
					))}
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="our-culture__inner az-section__inner">
					<RichText tagName="h2" className="our-culture__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
					<div className="our-culture__gallery" aria-label="Culture gallery">
						{images.length ? images.map((image, index) => (
							<button
								className={getItemClassName(index, activeIndex, images.length)}
								key={index}
								onClick={() => setActiveIndex(index)}
								type="button"
							>
								<img src={image.url} alt="" />
							</button>
						)) : <div className="our-culture__placeholder">Add culture images</div>}
					</div>
				</div>
			</section>
		</>
	);
}
