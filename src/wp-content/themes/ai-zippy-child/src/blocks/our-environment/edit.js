import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, URLInput, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const blockProps = useBlockProps({
		className: getSectionClassName("our-environment", attributes),
		style: {
			...getSectionStyle(attributes),
			"--our-environment-overlay-opacity": `${(attributes.overlayOpacity ?? 20) / 100}`,
			"--our-environment-accent-start": attributes.accentStartColor || "#0167ff",
			"--our-environment-accent-end": attributes.accentEndColor || "#c5fda2",
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Media" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={["image"]}
							onSelect={(media) => setAttributes({ posterUrl: media.url, posterAlt: media.alt || media.title || "" })}
							render={({ open }) => (
								<div className="our-environment-editor__media">
									{attributes.posterUrl ? <img src={attributes.posterUrl} alt="" /> : null}
									<Button variant="secondary" onClick={open}>{attributes.posterUrl ? "Replace Poster" : "Select Poster"}</Button>
								</div>
							)}
						/>
					</MediaUploadCheck>
					<TextControl label="Poster alt text" value={attributes.posterAlt} onChange={(posterAlt) => setAttributes({ posterAlt })} />
					<BaseControl label="Video URL">
						<URLInput value={attributes.videoUrl} onChange={(videoUrl) => setAttributes({ videoUrl })} />
					</BaseControl>
					<RangeControl label="Overlay opacity" value={attributes.overlayOpacity} min={0} max={80} step={5} onChange={(overlayOpacity) => setAttributes({ overlayOpacity })} />
					<BaseControl label="Heading start color">
						<ColorPalette colors={themePalette || []} value={attributes.accentStartColor} onChange={(accentStartColor) => setAttributes({ accentStartColor: accentStartColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Heading end color">
						<ColorPalette colors={themePalette || []} value={attributes.accentEndColor} onChange={(accentEndColor) => setAttributes({ accentEndColor: accentEndColor || "" })} clearable />
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				{attributes.videoUrl ? <video className="our-environment__video" src={attributes.videoUrl} poster={attributes.posterUrl} muted loop playsInline autoPlay /> : null}
				{!attributes.videoUrl && attributes.posterUrl ? <img className="our-environment__poster" src={attributes.posterUrl} alt="" /> : null}
				<div className="our-environment__overlay" />
				<div className="our-environment__inner az-section__inner">
					<RichText tagName="h2" className="our-environment__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
				</div>
			</section>
		</>
	);
}
