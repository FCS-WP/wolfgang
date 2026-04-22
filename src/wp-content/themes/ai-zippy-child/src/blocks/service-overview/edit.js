import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, SelectControl, TextControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";
import { ServiceIcon, iconOptions } from "../home-services/icons.js";

const defaultCard = {
	icon: "megaphone",
	iconImageId: 0,
	iconImageUrl: "",
	iconImageAlt: "",
	title: "New Service",
	items: ["Service item"],
};

const asCards = (cards) => (Array.isArray(cards) && cards.length ? cards : []).map((card) => ({
	...defaultCard,
	...card,
	items: Array.isArray(card.items) ? card.items : [],
}));

export default function Edit({ attributes, setAttributes }) {
	const cards = asCards(attributes.cards);
	const blockProps = useBlockProps({
		className: getSectionClassName("service-overview", attributes),
		style: {
			...getSectionStyle(attributes),
			"--service-overview-card-radius": `${attributes.cardRadius ?? 8}px`,
			"--service-overview-card-gap": `${attributes.cardGap ?? 28}px`,
		},
	});
	const setCards = (nextCards) => setAttributes({ cards: nextCards });
	const updateCard = (index, patch) => setCards(cards.map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card)));
	const updateItem = (cardIndex, itemIndex, value) => {
		const items = [...cards[cardIndex].items];
		items[itemIndex] = value;
		updateCard(cardIndex, { items });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Cards" initialOpen={true}>
					<RangeControl label="Card radius" value={attributes.cardRadius} min={0} max={32} step={1} onChange={(cardRadius) => setAttributes({ cardRadius })} />
					<RangeControl label="Card gap" value={attributes.cardGap} min={14} max={70} step={2} onChange={(cardGap) => setAttributes({ cardGap })} />
					{cards.map((card, cardIndex) => (
						<div className="service-overview-editor__card" key={cardIndex}>
							<SelectControl label="Icon" value={card.icon} options={iconOptions} onChange={(icon) => updateCard(cardIndex, { icon })} />
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={card.iconImageId}
									onSelect={(media) => updateCard(cardIndex, { iconImageId: media.id, iconImageUrl: media.url, iconImageAlt: media.alt || media.title || "" })}
									render={({ open }) => (
										<div className="service-overview-editor__icon-media">
											{card.iconImageUrl ? <img src={card.iconImageUrl} alt="" /> : <span>Using built-in icon</span>}
											<Button variant="secondary" onClick={open}>{card.iconImageUrl ? "Replace Icon Image" : "Upload Icon Image"}</Button>
											{card.iconImageUrl ? <Button variant="link" isDestructive onClick={() => updateCard(cardIndex, { iconImageId: 0, iconImageUrl: "", iconImageAlt: "" })}>Remove Icon Image</Button> : null}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<TextControl label="Title" value={card.title} onChange={(title) => updateCard(cardIndex, { title })} />
							{card.items.map((item, itemIndex) => (
								<TextControl key={itemIndex} label={`Item ${itemIndex + 1}`} value={item} onChange={(value) => updateItem(cardIndex, itemIndex, value)} />
							))}
							<Button variant="secondary" onClick={() => updateCard(cardIndex, { items: [...card.items, "New item"] })}>Add Item</Button>
							<Button variant="link" isDestructive disabled={cards.length <= 1} onClick={() => setCards(cards.filter((_, index) => index !== cardIndex))}>Remove Card</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setCards([...cards, { ...defaultCard }])}>Add Card</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="service-overview__inner az-section__inner">
					<RichText tagName="p" className="service-overview__intro" value={attributes.intro} allowedFormats={[]} onChange={(intro) => setAttributes({ intro })} />
					<div className="service-overview__cards">
						{cards.map((card, cardIndex) => (
							<article className="service-overview__card" key={cardIndex}>
								{card.iconImageUrl ? <img className="service-overview__icon" src={card.iconImageUrl} alt="" /> : <ServiceIcon name={card.icon} />}
								<RichText tagName="h3" className="service-overview__title" value={card.title} allowedFormats={[]} onChange={(title) => updateCard(cardIndex, { title })} />
								<ul className="service-overview__list">
									{card.items.map((item, itemIndex) => (
										<li key={itemIndex}>
											<RichText tagName="span" value={item} allowedFormats={[]} onChange={(value) => updateItem(cardIndex, itemIndex, value)} />
										</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
