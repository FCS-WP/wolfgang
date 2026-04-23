import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, TextControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const defaultStats = [
	{ value: "8+ years", label: "of experience as PSG pre-approved vendor" },
	{ value: "30M", label: "Amount of grants applied and approved" },
];

const asStats = (stats) => (Array.isArray(stats) && stats.length ? stats : defaultStats).map((stat) => ({ value: "", label: "", ...stat }));

const MediaControl = ({ title, imageUrl, imageId, onSelect, onRemove }) => (
	<MediaUploadCheck>
		<MediaUpload
			allowedTypes={["image"]}
			value={imageId}
			onSelect={onSelect}
			render={({ open }) => (
				<div className="service-psg-support-editor__media">
					<strong>{title}</strong>
					{imageUrl ? <img src={imageUrl} alt="" /> : <div>No image selected</div>}
					<Button variant="secondary" onClick={open}>{imageUrl ? "Replace Image" : "Select Image"}</Button>
					{imageUrl ? <Button variant="link" isDestructive onClick={onRemove}>Remove</Button> : null}
				</div>
			)}
		/>
	</MediaUploadCheck>
);

export default function Edit({ attributes, setAttributes }) {
	const stats = asStats(attributes.stats);
	const blockProps = useBlockProps({
		className: getSectionClassName("service-psg-support", attributes),
		style: {
			...getSectionStyle(attributes),
			"--service-psg-image-radius": `${attributes.imageRadius ?? 8}px`,
			"--service-psg-content-gap": `${attributes.contentGap ?? 56}px`,
		},
	});
	const setStats = (nextStats) => setAttributes({ stats: nextStats });
	const updateStat = (index, patch) => setStats(stats.map((stat, statIndex) => (statIndex === index ? { ...stat, ...patch } : stat)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Media" initialOpen={true}>
					<MediaControl
						title="Main image"
						imageId={attributes.imageId}
						imageUrl={attributes.imageUrl}
						onSelect={(media) => setAttributes({ imageId: media.id, imageUrl: media.url, imageAlt: media.alt || media.title || "" })}
						onRemove={() => setAttributes({ imageId: 0, imageUrl: "", imageAlt: "" })}
					/>
					<MediaControl
						title="Badge image"
						imageId={attributes.badgeImageId}
						imageUrl={attributes.badgeImageUrl}
						onSelect={(media) => setAttributes({ badgeImageId: media.id, badgeImageUrl: media.url, badgeImageAlt: media.alt || media.title || "" })}
						onRemove={() => setAttributes({ badgeImageId: 0, badgeImageUrl: "", badgeImageAlt: "" })}
					/>
					<RangeControl label="Image radius" value={attributes.imageRadius} min={0} max={32} step={1} onChange={(imageRadius) => setAttributes({ imageRadius })} />
					<RangeControl label="Content gap" value={attributes.contentGap} min={28} max={110} step={2} onChange={(contentGap) => setAttributes({ contentGap })} />
				</PanelBody>
				<PanelBody title="Stats" initialOpen={true}>
					{stats.map((stat, index) => (
						<div className="service-psg-support-editor__stat" key={index}>
							<TextControl label="Value" value={stat.value} onChange={(value) => updateStat(index, { value })} />
							<TextControl label="Label" value={stat.label} onChange={(label) => updateStat(index, { label })} />
							<Button variant="link" isDestructive disabled={stats.length <= 1} onClick={() => setStats(stats.filter((_, statIndex) => statIndex !== index))}>Remove</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setStats([...stats, { value: "New stat", label: "Describe stat" }])}>Add Stat</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="service-psg-support__inner az-section__inner">
					<div className="service-psg-support__header">
						<RichText tagName="h2" className="service-psg-support__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
						<RichText tagName="p" className="service-psg-support__description" value={attributes.description} allowedFormats={[]} onChange={(description) => setAttributes({ description })} />
					</div>
					<div className="service-psg-support__content">
						<div className="service-psg-support__media">
							{attributes.imageUrl ? <img src={attributes.imageUrl} alt="" /> : <div className="service-psg-support__placeholder">Select image</div>}
						</div>
						<div className="service-psg-support__copy">
							<RichText tagName="h3" className="service-psg-support__feature-heading" value={attributes.featureHeading} allowedFormats={[]} onChange={(featureHeading) => setAttributes({ featureHeading })} />
							<div className="service-psg-support__stats">
								{stats.map((stat, index) => (
									<div className="service-psg-support__stat" key={index}>
										<RichText tagName="strong" className="service-psg-support__stat-value" value={stat.value} allowedFormats={[]} onChange={(value) => updateStat(index, { value })} />
										<RichText tagName="span" className="service-psg-support__stat-label" value={stat.label} allowedFormats={[]} onChange={(label) => updateStat(index, { label })} />
									</div>
								))}
							</div>
							{attributes.badgeImageUrl ? <img className="service-psg-support__badge" src={attributes.badgeImageUrl} alt="" /> : <div className="service-psg-support__badge-placeholder">Select badge image</div>}
							<RichText tagName="p" className="service-psg-support__body" value={attributes.body} allowedFormats={[]} onChange={(body) => setAttributes({ body })} />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
