import { RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, RangeControl, TextControl } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";

const clamp = (value, min, max) => Math.min(Math.max(Number(value) || min, min), max);

const buildItems = (count) => Array.from({ length: clamp(count, 2, 12) });

export default function Edit({ attributes, setAttributes }) {
	const items = buildItems(attributes.repeatCount);
	const blockProps = useBlockProps({
		className: getSectionClassName("accreditation-marquee", attributes),
		style: {
			...getSectionStyle(attributes),
			"--accreditation-marquee-speed": `${attributes.speed || 28}s`,
			"--accreditation-marquee-height": `${attributes.height || 34}px`,
			"--accreditation-marquee-gap": `${attributes.gap || 34}px`,
			"--accreditation-marquee-font-size": `${attributes.fontSize || 18}px`,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Marquee" initialOpen={true}>
					<TextControl
						label="Mark"
						value={attributes.mark}
						onChange={(mark) => setAttributes({ mark })}
					/>
					<RangeControl
						label="Repeat count"
						value={attributes.repeatCount}
						min={2}
						max={12}
						step={1}
						onChange={(repeatCount) => setAttributes({ repeatCount })}
					/>
					<RangeControl
						label="Loop speed"
						help="Higher values move more slowly."
						value={attributes.speed}
						min={10}
						max={80}
						step={1}
						onChange={(speed) => setAttributes({ speed })}
					/>
					<RangeControl
						label="Bar height"
						value={attributes.height}
						min={24}
						max={96}
						step={1}
						onChange={(height) => setAttributes({ height })}
					/>
					<RangeControl
						label="Gap"
						value={attributes.gap}
						min={12}
						max={96}
						step={1}
						onChange={(gap) => setAttributes({ gap })}
					/>
					<RangeControl
						label="Font size"
						value={attributes.fontSize}
						min={12}
						max={42}
						step={1}
						onChange={(fontSize) => setAttributes({ fontSize })}
					/>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="accreditation-marquee__inner az-section__inner">
					<div className="accreditation-marquee__viewport">
						<div className="accreditation-marquee__track">
							<div className="accreditation-marquee__group">
								{items.map((_, index) => (
									<span className="accreditation-marquee__item" key={index}>
										<span className="accreditation-marquee__mark" aria-hidden="true">{attributes.mark}</span>
										<RichText
											tagName="span"
											className="accreditation-marquee__text"
											value={attributes.text}
											allowedFormats={[]}
											onChange={(text) => setAttributes({ text })}
											placeholder="Accreditation text"
										/>
									</span>
								))}
							</div>
							<div className="accreditation-marquee__group" aria-hidden="true">
								{items.map((_, index) => (
									<span className="accreditation-marquee__item" key={index}>
										<span className="accreditation-marquee__mark" aria-hidden="true">{attributes.mark}</span>
										<span className="accreditation-marquee__text">{attributes.text}</span>
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
