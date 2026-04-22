import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	URLInputButton,
	useBlockProps,
	useSettings,
} from "@wordpress/block-editor";
import {
	BaseControl,
	Button,
	ColorPalette,
	PanelBody,
	RangeControl,
	TextControl,
	TextareaControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";

const defaultSlide = {
	imageId: 0,
	imageUrl: "",
	imageAlt: "",
	eyebrow: "",
	title: "We're the Best<br>SME Agency",
	subtitle: "500 happy clients served",
	contentHtml: "<h1>We're the Best<br>SME Agency</h1><p>500 happy clients served</p>",
	buttonLabel: "Contact us",
	buttonUrl: "/contact-us",
	buttonNewTab: false,
	buttonBackgroundColor: "#c8ff9a",
	buttonTextColor: "#000000",
};

const asSlides = (slides) => {
	const items = Array.isArray(slides) && slides.length ? slides : [defaultSlide];
	return items.map((slide) => {
		const nextSlide = { ...defaultSlide, ...slide };
		if (!nextSlide.contentHtml && (nextSlide.title || nextSlide.subtitle)) {
			nextSlide.contentHtml = `${nextSlide.title ? `<h1>${nextSlide.title}</h1>` : ""}${nextSlide.subtitle ? `<p>${nextSlide.subtitle}</p>` : ""}`;
		}
		return nextSlide;
	});
};

const moveItem = (items, from, to) => {
	const next = [...items];
	const [item] = next.splice(from, 1);
	next.splice(to, 0, item);
	return next;
};

export default function Edit({ attributes, setAttributes }) {
	const slides = asSlides(attributes.slides);
	const [activeIndex, setActiveIndex] = useState(0);
	const [themePalette] = useSettings("color.palette");
	const activeSlide = slides[Math.min(activeIndex, slides.length - 1)] || defaultSlide;

	useEffect(() => {
		if (activeIndex > slides.length - 1) {
			setActiveIndex(Math.max(slides.length - 1, 0));
		}
	}, [activeIndex, slides.length]);

	const setSlides = (nextSlides) => setAttributes({ slides: nextSlides });
	const updateSlide = (index, patch) => {
		setSlides(slides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)));
	};
	const addSlide = () => {
		const nextSlides = [...slides, { ...defaultSlide, title: "New banner slide" }];
		setSlides(nextSlides);
		setActiveIndex(nextSlides.length - 1);
	};
	const duplicateSlide = (index) => {
		const nextSlides = [...slides.slice(0, index + 1), { ...slides[index] }, ...slides.slice(index + 1)];
		setSlides(nextSlides);
		setActiveIndex(index + 1);
	};
	const removeSlide = (index) => {
		if (slides.length <= 1) {
			return;
		}

		setSlides(slides.filter((_, slideIndex) => slideIndex !== index));
		setActiveIndex(Math.max(index - 1, 0));
	};

	const blockProps = useBlockProps({
		className: `${getSectionClassName("home-banner", attributes)} ${attributes.showOverlay ? "home-banner--has-overlay" : "home-banner--no-overlay"}`,
		style: {
			...getSectionStyle(attributes),
			"--home-banner-height": `${attributes.height || 650}px`,
			"--home-banner-container-width": `${attributes.containerWidth || 1180}px`,
			"--home-banner-content-width": `${attributes.contentWidth || 980}px`,
			"--home-banner-content-padding-top": `${attributes.contentPaddingTop ?? 90}px`,
			"--home-banner-content-padding-right": `${attributes.contentPaddingRight ?? 96}px`,
			"--home-banner-content-padding-bottom": `${attributes.contentPaddingBottom ?? 90}px`,
			"--home-banner-content-padding-left": `${attributes.contentPaddingLeft ?? 96}px`,
			"--home-banner-content-padding-top-tablet": attributes.contentPaddingTopTablet !== undefined ? `${attributes.contentPaddingTopTablet}px` : undefined,
			"--home-banner-content-padding-right-tablet": attributes.contentPaddingRightTablet !== undefined ? `${attributes.contentPaddingRightTablet}px` : undefined,
			"--home-banner-content-padding-bottom-tablet": attributes.contentPaddingBottomTablet !== undefined ? `${attributes.contentPaddingBottomTablet}px` : undefined,
			"--home-banner-content-padding-left-tablet": attributes.contentPaddingLeftTablet !== undefined ? `${attributes.contentPaddingLeftTablet}px` : undefined,
			"--home-banner-content-padding-top-mobile": attributes.contentPaddingTopMobile !== undefined ? `${attributes.contentPaddingTopMobile}px` : undefined,
			"--home-banner-content-padding-right-mobile": attributes.contentPaddingRightMobile !== undefined ? `${attributes.contentPaddingRightMobile}px` : undefined,
			"--home-banner-content-padding-bottom-mobile": attributes.contentPaddingBottomMobile !== undefined ? `${attributes.contentPaddingBottomMobile}px` : undefined,
			"--home-banner-content-padding-left-mobile": attributes.contentPaddingLeftMobile !== undefined ? `${attributes.contentPaddingLeftMobile}px` : undefined,
			"--home-banner-overlay-opacity": attributes.showOverlay === false ? "0" : `${(attributes.overlayOpacity ?? 44) / 100}`,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Banner Settings" initialOpen={true}>
					<RangeControl
						label="Banner height"
						value={attributes.height}
						min={420}
						max={900}
						step={10}
						onChange={(height) => setAttributes({ height })}
					/>
					<RangeControl
						label="Container width"
						value={attributes.containerWidth}
						min={960}
						max={1800}
						step={10}
						onChange={(containerWidth) => setAttributes({ containerWidth })}
					/>
					<RangeControl
						label="Text width"
						value={attributes.contentWidth}
						min={520}
						max={1320}
						step={10}
						onChange={(contentWidth) => setAttributes({ contentWidth })}
					/>
					<RangeControl
						label="Overlay opacity"
						value={attributes.overlayOpacity}
						min={0}
						max={80}
						step={1}
						onChange={(overlayOpacity) => setAttributes({ overlayOpacity })}
					/>
					<ToggleControl
						label="Show overlay"
						checked={Boolean(attributes.showOverlay)}
						onChange={(showOverlay) => setAttributes({ showOverlay })}
					/>
					<ToggleControl
						label="Autoplay"
						checked={Boolean(attributes.autoplay)}
						onChange={(autoplay) => setAttributes({ autoplay })}
					/>
					<RangeControl
						label="Autoplay delay"
						value={attributes.autoplayDelay}
						min={2500}
						max={12000}
						step={500}
						onChange={(autoplayDelay) => setAttributes({ autoplayDelay })}
					/>
					<ToggleControl
						label="Show arrows"
						checked={Boolean(attributes.showArrows)}
						onChange={(showArrows) => setAttributes({ showArrows })}
					/>
					<ToggleControl
						label="Show dots"
						checked={Boolean(attributes.showDots)}
						onChange={(showDots) => setAttributes({ showDots })}
					/>
				</PanelBody>
				<PanelBody title="Content Padding" initialOpen={false}>
					{[
						["contentPaddingTop", "Desktop top"],
						["contentPaddingRight", "Desktop right"],
						["contentPaddingBottom", "Desktop bottom"],
						["contentPaddingLeft", "Desktop left"],
						["contentPaddingTopTablet", "Tablet top"],
						["contentPaddingRightTablet", "Tablet right"],
						["contentPaddingBottomTablet", "Tablet bottom"],
						["contentPaddingLeftTablet", "Tablet left"],
						["contentPaddingTopMobile", "Mobile top"],
						["contentPaddingRightMobile", "Mobile right"],
						["contentPaddingBottomMobile", "Mobile bottom"],
						["contentPaddingLeftMobile", "Mobile left"],
					].map(([key, label]) => (
						<RangeControl
							key={key}
							label={label}
							value={attributes[key]}
							min={0}
							max={240}
							step={2}
							allowReset
							onChange={(value) => setAttributes({ [key]: value })}
						/>
					))}
				</PanelBody>
				<PanelBody title="Slides" initialOpen={true}>
					<div className="home-banner-editor__slide-tabs">
						{slides.map((slide, index) => (
							<Button
								key={index}
								variant={index === activeIndex ? "primary" : "secondary"}
								onClick={() => setActiveIndex(index)}
							>
								{`Slide ${index + 1}`}
							</Button>
						))}
					</div>
					<Button variant="primary" onClick={addSlide}>Add Slide</Button>
					<div className="home-banner-editor__slide-panel">
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={["image"]}
								value={activeSlide.imageId}
								onSelect={(media) => updateSlide(activeIndex, {
									imageId: media.id,
									imageUrl: media.url,
									imageAlt: media.alt || media.title || "",
								})}
								render={({ open }) => (
									<div className="home-banner-editor__media">
										{activeSlide.imageUrl ? <img src={activeSlide.imageUrl} alt="" /> : <div>No image selected</div>}
										<Button variant="secondary" onClick={open}>{activeSlide.imageUrl ? "Replace Image" : "Select Image"}</Button>
										{activeSlide.imageUrl ? (
											<Button
												variant="link"
												isDestructive
												onClick={() => updateSlide(activeIndex, { imageId: 0, imageUrl: "", imageAlt: "" })}
											>
												Remove Image
											</Button>
										) : null}
									</div>
								)}
							/>
						</MediaUploadCheck>
						<TextControl
							label="Eyebrow"
							value={activeSlide.eyebrow}
							onChange={(eyebrow) => updateSlide(activeIndex, { eyebrow })}
						/>
						<TextareaControl
							label="Content HTML"
							help="Allowed frontend HTML is sanitized by WordPress."
							value={activeSlide.contentHtml}
							rows={7}
							onChange={(contentHtml) => updateSlide(activeIndex, { contentHtml })}
						/>
						<TextControl
							label="Button label"
							value={activeSlide.buttonLabel}
							onChange={(buttonLabel) => updateSlide(activeIndex, { buttonLabel })}
						/>
						<p>Button URL</p>
						<URLInputButton
							url={activeSlide.buttonUrl}
							onChange={(buttonUrl) => updateSlide(activeIndex, { buttonUrl })}
						/>
						<ToggleControl
							label="Open button in new tab"
							checked={Boolean(activeSlide.buttonNewTab)}
							onChange={(buttonNewTab) => updateSlide(activeIndex, { buttonNewTab })}
						/>
						<BaseControl label="Button background">
							<ColorPalette
								colors={themePalette || []}
								value={activeSlide.buttonBackgroundColor}
								onChange={(buttonBackgroundColor) => updateSlide(activeIndex, { buttonBackgroundColor: buttonBackgroundColor || "" })}
								clearable
							/>
						</BaseControl>
						<BaseControl label="Button text color">
							<ColorPalette
								colors={themePalette || []}
								value={activeSlide.buttonTextColor}
								onChange={(buttonTextColor) => updateSlide(activeIndex, { buttonTextColor: buttonTextColor || "" })}
								clearable
							/>
						</BaseControl>
						<div className="home-banner-editor__actions">
							<Button
								variant="secondary"
								disabled={activeIndex === 0}
								onClick={() => {
									setSlides(moveItem(slides, activeIndex, activeIndex - 1));
									setActiveIndex(activeIndex - 1);
								}}
							>
								Move Up
							</Button>
							<Button
								variant="secondary"
								disabled={activeIndex === slides.length - 1}
								onClick={() => {
									setSlides(moveItem(slides, activeIndex, activeIndex + 1));
									setActiveIndex(activeIndex + 1);
								}}
							>
								Move Down
							</Button>
							<Button variant="secondary" onClick={() => duplicateSlide(activeIndex)}>Duplicate</Button>
							<Button variant="link" isDestructive disabled={slides.length <= 1} onClick={() => removeSlide(activeIndex)}>Remove</Button>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="home-banner__slides">
					{slides.map((slide, index) => (
						<div
							className={`home-banner__slide${index === activeIndex ? " is-active" : ""}`}
							key={index}
							style={{ backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined }}
						>
							<div className="home-banner__overlay" />
							<div className="home-banner__inner az-section__inner">
								<div className="home-banner__content">
									{slide.eyebrow ? <p className="home-banner__eyebrow">{slide.eyebrow}</p> : null}
									<div className="home-banner__copy" dangerouslySetInnerHTML={{ __html: slide.contentHtml }} />
									{slide.buttonLabel ? (
										<span
											className="home-banner__button az-button az-button--medium"
											style={{
												"--home-banner-button-bg": slide.buttonBackgroundColor || undefined,
												"--home-banner-button-color": slide.buttonTextColor || undefined,
											}}
										>
											{slide.buttonLabel}
										</span>
									) : null}
								</div>
							</div>
						</div>
					))}
				</div>
				{attributes.showArrows && slides.length > 1 ? (
					<div className="home-banner__arrows" aria-hidden="true">
						<Button className="home-banner__arrow home-banner__arrow--prev" icon="arrow-left-alt2" label="Previous slide" onClick={() => setActiveIndex(activeIndex === 0 ? slides.length - 1 : activeIndex - 1)} />
						<Button className="home-banner__arrow home-banner__arrow--next" icon="arrow-right-alt2" label="Next slide" onClick={() => setActiveIndex(activeIndex === slides.length - 1 ? 0 : activeIndex + 1)} />
					</div>
				) : null}
				{attributes.showDots && slides.length > 1 ? (
					<div className="home-banner__dots" aria-hidden="true">
						{slides.map((_, index) => (
							<Button key={index} className={`home-banner__dot${index === activeIndex ? " is-active" : ""}`} label={`Go to slide ${index + 1}`} onClick={() => setActiveIndex(index)} />
						))}
					</div>
				) : null}
			</section>
		</>
	);
}
