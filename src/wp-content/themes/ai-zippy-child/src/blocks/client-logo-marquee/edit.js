import { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, TextControl, ToggleControl } from "@wordpress/components";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";

const asLogos = (logos) => (Array.isArray(logos) ? logos : []);

export default function Edit({ attributes, setAttributes }) {
	const logos = asLogos(attributes.logos);
	const blockProps = useBlockProps({
		className: `${getSectionClassName("client-logo-marquee", attributes)} ${attributes.pauseOnHover ? "client-logo-marquee--pause" : ""} ${attributes.reverse ? "client-logo-marquee--reverse" : ""}`,
		style: {
			...getSectionStyle(attributes),
			"--client-logo-marquee-speed": `${attributes.speed || 36}s`,
			"--client-logo-marquee-size": `${attributes.logoSize || 92}px`,
			"--client-logo-marquee-gap": `${attributes.gap || 48}px`,
		},
	});

	const setLogos = (nextLogos) => setAttributes({ logos: nextLogos });
	const updateLogo = (index, patch) => setLogos(logos.map((logo, logoIndex) => (logoIndex === index ? { ...logo, ...patch } : logo)));
	const addLogo = (media) => setLogos([...logos, { id: media.id, url: media.url, alt: media.alt || media.title || "", name: media.title || "" }]);
	const moveLogo = (index, direction) => {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= logos.length) {
			return;
		}
		const nextLogos = [...logos];
		const [item] = nextLogos.splice(index, 1);
		nextLogos.splice(nextIndex, 0, item);
		setLogos(nextLogos);
	};
	const renderGroup = (hidden = false) => (
		<div className="client-logo-marquee__group" aria-hidden={hidden}>
			{logos.map((logo, index) => (
				<div className="client-logo-marquee__logo" key={`${logo.url}-${index}`}>
					{logo.url ? <img src={logo.url} alt="" /> : <span>{logo.name || "Logo"}</span>}
				</div>
			))}
		</div>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Marquee" initialOpen={true}>
					<RangeControl label="Speed" help="Higher values move more slowly." value={attributes.speed} min={12} max={90} step={1} onChange={(speed) => setAttributes({ speed })} />
					<RangeControl label="Logo size" value={attributes.logoSize} min={54} max={180} step={2} onChange={(logoSize) => setAttributes({ logoSize })} />
					<RangeControl label="Gap" value={attributes.gap} min={16} max={120} step={2} onChange={(gap) => setAttributes({ gap })} />
					<ToggleControl label="Pause on hover" checked={Boolean(attributes.pauseOnHover)} onChange={(pauseOnHover) => setAttributes({ pauseOnHover })} />
					<ToggleControl label="Reverse direction" checked={Boolean(attributes.reverse)} onChange={(reverse) => setAttributes({ reverse })} />
				</PanelBody>
				<PanelBody title="Logos" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={["image"]}
							multiple
							gallery
							onSelect={(media) => {
								const selected = Array.isArray(media) ? media : [media];
								setLogos([
									...logos,
									...selected.map((item) => ({ id: item.id, url: item.url, alt: item.alt || item.title || "", name: item.title || "" })),
								]);
							}}
							render={({ open }) => <Button variant="primary" onClick={open}>Add Logos</Button>}
						/>
					</MediaUploadCheck>
					{logos.map((logo, index) => (
						<div className="client-logo-marquee-editor__logo" key={`${logo.url}-${index}`}>
							{logo.url ? <img src={logo.url} alt="" /> : null}
							<TextControl label="Name" value={logo.name} onChange={(name) => updateLogo(index, { name })} />
							<TextControl label="Alt text" value={logo.alt} onChange={(alt) => updateLogo(index, { alt })} />
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={logo.id}
									onSelect={(media) => updateLogo(index, { id: media.id, url: media.url, alt: media.alt || media.title || "", name: logo.name || media.title || "" })}
									render={({ open }) => <Button variant="secondary" onClick={open}>Replace</Button>}
								/>
							</MediaUploadCheck>
							<div className="client-logo-marquee-editor__actions">
								<Button variant="secondary" disabled={index === 0} onClick={() => moveLogo(index, -1)}>Move Up</Button>
								<Button variant="secondary" disabled={index === logos.length - 1} onClick={() => moveLogo(index, 1)}>Move Down</Button>
								<Button variant="link" isDestructive onClick={() => setLogos(logos.filter((_, logoIndex) => logoIndex !== index))}>Remove</Button>
							</div>
						</div>
					))}
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="client-logo-marquee__inner az-section__inner">
					{logos.length ? (
						<div className="client-logo-marquee__viewport">
							<div className="client-logo-marquee__track">
								{renderGroup()}
								{renderGroup(true)}
							</div>
						</div>
					) : (
						<div className="client-logo-marquee__empty">Add client logos</div>
					)}
				</div>
			</section>
		</>
	);
}
