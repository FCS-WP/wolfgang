import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, RangeControl, TextareaControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({
		className: getSectionClassName("service-contact-embed", attributes),
		style: {
			...getSectionStyle(attributes),
			"--service-contact-content-width": `${attributes.contentWidth ?? 760}px`,
			"--service-contact-heading-gap": `${attributes.headingBottomGap ?? 42}px`,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Form Embed" initialOpen={true}>
					<RangeControl label="Content width" value={attributes.contentWidth} min={520} max={1100} step={10} onChange={(contentWidth) => setAttributes({ contentWidth })} />
					<RangeControl label="Heading bottom gap" value={attributes.headingBottomGap} min={20} max={100} step={2} onChange={(headingBottomGap) => setAttributes({ headingBottomGap })} />
					<TextareaControl
						className="service-contact-embed-editor__textarea"
						label="Form HTML or shortcode"
						help="Paste form HTML or a shortcode here. It renders on the frontend so editor preview stays clean."
						value={attributes.embedHtml}
						onChange={(embedHtml) => setAttributes({ embedHtml })}
					/>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="service-contact-embed__inner az-section__inner">
					<RichText tagName="h2" className="service-contact-embed__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
					<div className="service-contact-embed__editor-preview">
						<strong>Form embed preview</strong>
						<span>Your HTML or shortcode will render on the frontend.</span>
						<code>{attributes.embedHtml ? attributes.embedHtml.slice(0, 160) : "No form embed added yet."}</code>
					</div>
				</div>
			</section>
		</>
	);
}
