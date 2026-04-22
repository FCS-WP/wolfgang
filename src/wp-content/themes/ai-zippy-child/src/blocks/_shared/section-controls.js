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
	paddingRight: { type: "number", default: 0 },
	paddingBottom: { type: "number", default: 110 },
	paddingLeft: { type: "number", default: 0 },
	marginTop: { type: "number", default: 0 },
	marginBottom: { type: "number", default: 0 },
	paddingTopTablet: { type: "number" },
	paddingRightTablet: { type: "number" },
	paddingBottomTablet: { type: "number" },
	paddingLeftTablet: { type: "number" },
	marginTopTablet: { type: "number" },
	marginBottomTablet: { type: "number" },
	paddingTopMobile: { type: "number" },
	paddingRightMobile: { type: "number" },
	paddingBottomMobile: { type: "number" },
	paddingLeftMobile: { type: "number" },
	marginTopMobile: { type: "number" },
	marginBottomMobile: { type: "number" },
};

export const getSectionClassName = (baseClass, attributes = {}) => {
	const layout = attributes.layout || "boxed";
	return `${baseClass} az-section az-section--${layout}`;
};

const pxValue = (value) => (value === undefined || value === null || value === "" ? undefined : `${value}px`);

export const getSectionStyle = (attributes = {}) => ({
	"--az-section-bg": attributes.backgroundColor || undefined,
	"--az-section-color": attributes.textColor || undefined,
	"--az-section-padding-top": pxValue(attributes.paddingTop ?? 110),
	"--az-section-padding-right": pxValue(attributes.paddingRight ?? 0),
	"--az-section-padding-bottom": pxValue(attributes.paddingBottom ?? 110),
	"--az-section-padding-left": pxValue(attributes.paddingLeft ?? 0),
	"--az-section-margin-top": pxValue(attributes.marginTop ?? 0),
	"--az-section-margin-bottom": pxValue(attributes.marginBottom ?? 0),
	"--az-section-padding-top-tablet": pxValue(attributes.paddingTopTablet),
	"--az-section-padding-right-tablet": pxValue(attributes.paddingRightTablet),
	"--az-section-padding-bottom-tablet": pxValue(attributes.paddingBottomTablet),
	"--az-section-padding-left-tablet": pxValue(attributes.paddingLeftTablet),
	"--az-section-margin-top-tablet": pxValue(attributes.marginTopTablet),
	"--az-section-margin-bottom-tablet": pxValue(attributes.marginBottomTablet),
	"--az-section-padding-top-mobile": pxValue(attributes.paddingTopMobile),
	"--az-section-padding-right-mobile": pxValue(attributes.paddingRightMobile),
	"--az-section-padding-bottom-mobile": pxValue(attributes.paddingBottomMobile),
	"--az-section-padding-left-mobile": pxValue(attributes.paddingLeftMobile),
	"--az-section-margin-top-mobile": pxValue(attributes.marginTopMobile),
	"--az-section-margin-bottom-mobile": pxValue(attributes.marginBottomMobile),
});

const spacingGroups = [
	{
		title: "Desktop Spacing",
		fields: [
			["paddingTop", "Padding top"],
			["paddingRight", "Padding right"],
			["paddingBottom", "Padding bottom"],
			["paddingLeft", "Padding left"],
			["marginTop", "Margin top"],
			["marginBottom", "Margin bottom"],
		],
	},
	{
		title: "Tablet Spacing",
		fields: [
			["paddingTopTablet", "Padding top"],
			["paddingRightTablet", "Padding right"],
			["paddingBottomTablet", "Padding bottom"],
			["paddingLeftTablet", "Padding left"],
			["marginTopTablet", "Margin top"],
			["marginBottomTablet", "Margin bottom"],
		],
	},
	{
		title: "Mobile Spacing",
		fields: [
			["paddingTopMobile", "Padding top"],
			["paddingRightMobile", "Padding right"],
			["paddingBottomMobile", "Padding bottom"],
			["paddingLeftMobile", "Padding left"],
			["marginTopMobile", "Margin top"],
			["marginBottomMobile", "Margin bottom"],
		],
	},
];

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
				{spacingGroups.map((group) => (
					<div className="az-section-controls__group" key={group.title}>
						<h3>{group.title}</h3>
						{group.fields.map(([key, label]) => (
							<RangeControl
								key={key}
								label={label}
								value={attributes[key]}
								onChange={(value) => setAttributes({ [key]: value })}
								min={0}
								max={240}
								step={2}
								allowReset
							/>
						))}
					</div>
				))}
			</PanelBody>
		</InspectorControls>
	);
}
