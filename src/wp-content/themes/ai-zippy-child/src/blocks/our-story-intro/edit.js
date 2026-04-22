import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
	useSettings,
} from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, SelectControl, TextareaControl, TextControl } from "@wordpress/components";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";

const iconOptions = [
	{ label: "Vision", value: "vision" },
	{ label: "Mission", value: "mission" },
];

const defaultCard = {
	icon: "vision",
	iconId: 0,
	iconUrl: "",
	iconAlt: "",
	title: "New Card",
	description: "",
};

const asCards = (cards) => (Array.isArray(cards) && cards.length ? cards : []).map((card) => ({ ...defaultCard, ...card }));

function StoryIcon({ name = "vision" }) {
	if (name === "mission") {
		return (
			<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
				<circle cx="29" cy="34" r="18" />
				<circle cx="29" cy="34" r="10" />
				<circle cx="29" cy="34" r="3" />
				<path d="M42 21l10-10M45 11h7v7M38 25l14-14M10 34c0-11 8-20 19-20M29 54c-11 0-19-9-19-20" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
			<path d="M5 32s10-15 27-15 27 15 27 15-10 15-27 15S5 32 5 32z" />
			<circle cx="32" cy="32" r="8" />
			<path d="M32 7v6M32 51v6M17 11l3 5M47 11l-3 5M8 21l6 3M56 21l-6 3" />
		</svg>
	);
}

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const cards = asCards(attributes.cards);
	const blockProps = useBlockProps({
		className: getSectionClassName("our-story-intro", attributes),
		style: {
			...getSectionStyle(attributes),
			"--our-story-card-radius": `${attributes.cardRadius ?? 8}px`,
			"--our-story-card-min-height": `${attributes.cardMinHeight ?? 290}px`,
			"--our-story-card-bg": attributes.cardBackgroundColor || "#000000",
			"--our-story-card-color": attributes.cardTextColor || "#ffffff",
			"--our-story-card-accent-start": attributes.cardAccentStartColor || "#1688ff",
			"--our-story-card-accent-end": attributes.cardAccentEndColor || "#c8ff9a",
		},
	});

	const setCards = (nextCards) => setAttributes({ cards: nextCards });
	const updateCard = (index, patch) => setCards(cards.map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card)));
	const moveCard = (index, direction) => {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= cards.length) {
			return;
		}
		const nextCards = [...cards];
		const [card] = nextCards.splice(index, 1);
		nextCards.splice(nextIndex, 0, card);
		setCards(nextCards);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Cards" initialOpen={true}>
					<RangeControl label="Card radius" value={attributes.cardRadius} min={0} max={32} step={1} onChange={(cardRadius) => setAttributes({ cardRadius })} />
					<RangeControl label="Card min height" value={attributes.cardMinHeight} min={220} max={520} step={10} onChange={(cardMinHeight) => setAttributes({ cardMinHeight })} />
					<BaseControl label="Card background">
						<ColorPalette colors={themePalette || []} value={attributes.cardBackgroundColor} onChange={(cardBackgroundColor) => setAttributes({ cardBackgroundColor: cardBackgroundColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Card text">
						<ColorPalette colors={themePalette || []} value={attributes.cardTextColor} onChange={(cardTextColor) => setAttributes({ cardTextColor: cardTextColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Title start color">
						<ColorPalette colors={themePalette || []} value={attributes.cardAccentStartColor} onChange={(cardAccentStartColor) => setAttributes({ cardAccentStartColor: cardAccentStartColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Title end color">
						<ColorPalette colors={themePalette || []} value={attributes.cardAccentEndColor} onChange={(cardAccentEndColor) => setAttributes({ cardAccentEndColor: cardAccentEndColor || "" })} clearable />
					</BaseControl>
				</PanelBody>
				<PanelBody title="Card Items" initialOpen={true}>
					{cards.map((card, index) => (
						<div className="our-story-intro-editor__card" key={index}>
							<SelectControl label="Fallback icon" value={card.icon} options={iconOptions} onChange={(icon) => updateCard(index, { icon })} />
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={card.iconId}
									onSelect={(media) => updateCard(index, {
										iconId: media.id,
										iconUrl: media.url,
										iconAlt: media.alt || media.title || "",
									})}
									render={({ open }) => (
										<div className="our-story-intro-editor__icon">
											{card.iconUrl ? <img src={card.iconUrl} alt="" /> : <StoryIcon name={card.icon} />}
											<Button variant="secondary" onClick={open}>{card.iconUrl ? "Replace Icon" : "Upload Icon"}</Button>
											{card.iconUrl ? (
												<Button variant="link" isDestructive onClick={() => updateCard(index, { iconId: 0, iconUrl: "", iconAlt: "" })}>Remove</Button>
											) : null}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<TextControl label="Icon alt text" value={card.iconAlt} onChange={(iconAlt) => updateCard(index, { iconAlt })} />
							<TextControl label="Title" value={card.title} onChange={(title) => updateCard(index, { title })} />
							<TextareaControl label="Description" rows={3} value={card.description} onChange={(description) => updateCard(index, { description })} />
							<div className="our-story-intro-editor__actions">
								<Button variant="secondary" disabled={index === 0} onClick={() => moveCard(index, -1)}>Move Up</Button>
								<Button variant="secondary" disabled={index === cards.length - 1} onClick={() => moveCard(index, 1)}>Move Down</Button>
								<Button variant="link" isDestructive disabled={cards.length <= 1} onClick={() => setCards(cards.filter((_, cardIndex) => cardIndex !== index))}>Remove</Button>
							</div>
						</div>
					))}
					<Button variant="primary" onClick={() => setCards([...cards, { ...defaultCard }])}>Add Card</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="our-story-intro__inner az-section__inner">
					<div className="our-story-intro__copy">
						<RichText tagName="h2" className="our-story-intro__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
						<RichText tagName="div" multiline="p" className="our-story-intro__body" value={attributes.body} allowedFormats={["core/bold", "core/italic", "core/link"]} onChange={(body) => setAttributes({ body })} />
					</div>
					<div className="our-story-intro__cards">
						{cards.map((card, index) => (
							<article className="our-story-intro__card" key={index}>
								{card.iconUrl ? <img className="our-story-intro__icon" src={card.iconUrl} alt="" /> : <StoryIcon name={card.icon} />}
								<RichText tagName="h3" className="our-story-intro__card-title" value={card.title} allowedFormats={[]} onChange={(title) => updateCard(index, { title })} />
								<RichText tagName="p" className="our-story-intro__card-description" value={card.description} allowedFormats={["core/bold", "core/italic"]} onChange={(description) => updateCard(index, { description })} />
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
