import { InspectorControls, useSettings } from "@wordpress/block-editor";
import { BaseControl, ColorPalette, PanelBody, RangeControl, SelectControl } from "@wordpress/components";

export const sectionLayoutOptions = [
	{ label: "Boxed", value: "boxed" },
	{ label: "Wide", value: "wide" },
	{ label: "Full Width", value: "full" },
];

export const sectionAttributes = {
	layout: { type: "string", default: "boxed" },
	backgroundColor: { type: "string", default: "" },
	textColor: { type: "string", default: "" },
	paddingTop: { type: "number", default: 110 },
	paddingBottom: { type: "number", default: 110 },
	marginTop: { type: "number", default: 0 },
	marginBottom: { type: "number", default: 0 },
};

export const getSectionClassName = (baseClass, attributes = {}) => {
	const layout = attributes.layout || "boxed";
	return `${baseClass} az-section az-section--${layout}`;
};

export const getSectionStyle = (attributes = {}) => ({
	"--az-section-bg": attributes.backgroundColor || undefined,
	"--az-section-color": attributes.textColor || undefined,
	"--az-section-padding-top": `${attributes.paddingTop ?? 110}px`,
	"--az-section-padding-bottom": `${attributes.paddingBottom ?? 110}px`,
	"--az-section-margin-top": `${attributes.marginTop ?? 0}px`,
	"--az-section-margin-bottom": `${attributes.marginBottom ?? 0}px`,
});

export function SectionControls({ attributes, setAttributes, title = "Section" }) {
	const [themePalette] = useSettings("color.palette");

	return (
		<InspectorControls>
			<PanelBody title={title} initialOpen={false}>
				<SelectControl
					label="Layout"
					value={attributes.layout || "boxed"}
					options={sectionLayoutOptions}
					onChange={(layout) => setAttributes({ layout })}
				/>
				<BaseControl label="Background">
					<ColorPalette
						colors={themePalette || []}
						value={attributes.backgroundColor}
						onChange={(backgroundColor) => setAttributes({ backgroundColor: backgroundColor || "" })}
						clearable
					/>
				</BaseControl>
				<BaseControl label="Text Color">
					<ColorPalette
						colors={themePalette || []}
						value={attributes.textColor}
						onChange={(textColor) => setAttributes({ textColor: textColor || "" })}
						clearable
					/>
				</BaseControl>
				{["paddingTop", "paddingBottom", "marginTop", "marginBottom"].map((key) => (
					<RangeControl
						key={key}
						label={key}
						value={attributes[key]}
						onChange={(value) => setAttributes({ [key]: value })}
						min={0}
						max={240}
						step={2}
					/>
				))}
			</PanelBody>
		</InspectorControls>
	);
}
