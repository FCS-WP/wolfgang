import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextControl, ToggleControl } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const asImages = (images) => (Array.isArray(images) ? images : []);

const getOrbitItemStyle = (index, activeIndex, total) => {
	if (!total) {
		return {};
	}

	const angle = ((index - activeIndex) / total) * Math.PI * 2 + Math.PI / 2;
	const baseWidth = Math.max(88, Math.min(220, 980 / Math.max(total, 5)));
	const radiusX = Math.max(220, Math.min(440, 220 + total * 12));
	const radiusY = Math.max(72, Math.min(170, 98 + total * 3));
	const x = Math.cos(angle) * radiusX;
	const y = Math.sin(angle) * radiusY;
	const depth = (y / radiusY + 1) / 2;
	const scale = 0.54 + depth * 0.46;
	const opacity = 0.22 + depth * 0.78;
	const overlayOpacity = index === activeIndex ? 0 : Math.max(0.12, 0.62 - depth * 0.42);
	const zIndex = 10 + Math.round(depth * 40);

	return {
		"--our-culture-item-x": `${x}px`,
		"--our-culture-item-y": `${y}px`,
		"--our-culture-item-scale": scale,
		"--our-culture-item-opacity": opacity,
		"--our-culture-item-z": zIndex,
		"--our-culture-item-overlay-opacity": overlayOpacity,
		"--our-culture-item-base-width": `${baseWidth}px`,
	};
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
					<ToggleControl
						label="Auto run"
						checked={Boolean(attributes.autoRun)}
						onChange={(autoRun) => setAttributes({ autoRun })}
					/>
					<RangeControl
						label="Auto run delay"
						help="Time between rotations."
						value={attributes.autoRunDelay || 3200}
						min={1500}
						max={9000}
						step={100}
						onChange={(autoRunDelay) => setAttributes({ autoRunDelay })}
					/>
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
					<RichText
						tagName="p"
						className="our-culture__description"
						value={attributes.description}
						allowedFormats={["core/bold", "core/italic", "core/link"]}
						onChange={(description) => setAttributes({ description })}
						placeholder="Add description"
					/>
					<div className="our-culture__gallery" aria-label="Culture gallery">
						{images.length ? images.map((image, index) => (
							<button
								className={`our-culture__item${index === activeIndex ? " is-active" : ""}`}
								key={index}
								onClick={() => setActiveIndex(index)}
								style={getOrbitItemStyle(index, activeIndex, images.length)}
								type="button"
							>
								<div className="our-culture__overlay" />
								<img src={image.url} alt="" />
							</button>
						)) : <div className="our-culture__placeholder">Add culture images</div>}
					</div>
				</div>
			</section>
		</>
	);
}
