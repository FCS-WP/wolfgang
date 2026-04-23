import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInputButton,
	useBlockProps,
} from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from "@wordpress/components";
import {
	SectionControls,
	getSectionClassName,
	getSectionStyle,
} from "../_shared/section-controls.js";
import { ServiceIcon, iconOptions } from "./icons.js";

const defaultService = {
	icon: "megaphone",
	iconImageId: 0,
	iconImageUrl: "",
	iconImageAlt: "",
	title: "New service",
	description: "Describe this service.",
};

const asServices = (services) => (Array.isArray(services) && services.length ? services : []).map((service) => ({ ...defaultService, ...service }));

export default function Edit({ attributes, setAttributes }) {
	const services = asServices(attributes.services);
	const blockProps = useBlockProps({
		className: getSectionClassName("home-services", attributes),
		style: {
			...getSectionStyle(attributes),
			"--home-services-image-radius": `${attributes.imageRadius ?? 12}px`,
			"--home-services-image-width": `${attributes.imageWidth ?? 100}%`,
			"--home-services-image-aspect-ratio": attributes.imageAspectRatio || "1 / 1.5",
			"--home-services-image-fit": attributes.imageObjectFit || "cover",
			"--home-services-image-position": attributes.imageObjectPosition || "center center",
			"--home-services-image-align": attributes.imageAlignment || "center",
			"--home-services-content-gap": `${attributes.contentGap ?? 66}px`,
			"--home-services-item-gap": `${attributes.itemGap ?? 48}px`,
		},
	});
	const setServices = (nextServices) => setAttributes({ services: nextServices });
	const updateService = (index, patch) => setServices(services.map((service, serviceIndex) => (serviceIndex === index ? { ...service, ...patch } : service)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Media" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={["image"]}
							value={attributes.imageId}
							onSelect={(media) => setAttributes({ imageId: media.id, imageUrl: media.url, imageAlt: media.alt || media.title || "" })}
							render={({ open }) => (
								<div className="home-services-editor__media">
									{attributes.imageUrl ? <img src={attributes.imageUrl} alt="" /> : <div>No image selected</div>}
									<Button variant="secondary" onClick={open}>{attributes.imageUrl ? "Replace Image" : "Select Image"}</Button>
									{attributes.imageUrl ? <Button variant="link" isDestructive onClick={() => setAttributes({ imageId: 0, imageUrl: "", imageAlt: "" })}>Remove</Button> : null}
								</div>
							)}
						/>
					</MediaUploadCheck>
					<RangeControl label="Image radius" value={attributes.imageRadius} min={0} max={40} step={1} onChange={(imageRadius) => setAttributes({ imageRadius })} />
					<RangeControl label="Image desktop width" value={attributes.imageWidth ?? 100} min={45} max={100} step={1} onChange={(imageWidth) => setAttributes({ imageWidth })} />
					<SelectControl
						label="Image aspect ratio"
						value={attributes.imageAspectRatio || "1 / 1.5"}
						options={[
							{ label: "Tall", value: "1 / 1.5" },
							{ label: "Portrait", value: "4 / 5" },
							{ label: "Square", value: "1 / 1" },
							{ label: "Wide", value: "16 / 11" },
							{ label: "Classic portrait", value: "3 / 4" },
						]}
						onChange={(imageAspectRatio) => setAttributes({ imageAspectRatio })}
					/>
					<SelectControl
						label="Image fit"
						value={attributes.imageObjectFit || "cover"}
						options={[
							{ label: "Cover", value: "cover" },
							{ label: "Contain", value: "contain" },
						]}
						onChange={(imageObjectFit) => setAttributes({ imageObjectFit })}
					/>
					<SelectControl
						label="Image position"
						value={attributes.imageObjectPosition || "center center"}
						options={[
							{ label: "Center", value: "center center" },
							{ label: "Top", value: "center top" },
							{ label: "Bottom", value: "center bottom" },
							{ label: "Left", value: "left center" },
							{ label: "Right", value: "right center" },
						]}
						onChange={(imageObjectPosition) => setAttributes({ imageObjectPosition })}
					/>
					<SelectControl
						label="Image alignment"
						value={attributes.imageAlignment || "center"}
						options={[
							{ label: "Left", value: "start" },
							{ label: "Center", value: "center" },
							{ label: "Right", value: "end" },
						]}
						onChange={(imageAlignment) => setAttributes({ imageAlignment })}
					/>
					<RangeControl label="Column gap" value={attributes.contentGap} min={24} max={140} step={2} onChange={(contentGap) => setAttributes({ contentGap })} />
					<RangeControl label="Item gap" value={attributes.itemGap} min={20} max={90} step={2} onChange={(itemGap) => setAttributes({ itemGap })} />
				</PanelBody>
				<PanelBody title="Services" initialOpen={true}>
					{services.map((service, index) => (
						<div className="home-services-editor__item" key={index}>
							<SelectControl label="Fallback icon" value={service.icon} options={iconOptions} onChange={(icon) => updateService(index, { icon })} />
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={service.iconImageId}
									onSelect={(media) => updateService(index, {
										iconImageId: media.id,
										iconImageUrl: media.url,
										iconImageAlt: media.alt || media.title || "",
									})}
									render={({ open }) => (
										<div className="home-services-editor__icon-media">
											{service.iconImageUrl ? <img src={service.iconImageUrl} alt="" /> : <span>No custom icon selected</span>}
											<Button variant="secondary" onClick={open}>{service.iconImageUrl ? "Replace Icon" : "Select Icon"}</Button>
											{service.iconImageUrl ? (
												<Button
													variant="link"
													isDestructive
													onClick={() => updateService(index, { iconImageId: 0, iconImageUrl: "", iconImageAlt: "" })}
												>
													Remove Icon
												</Button>
											) : null}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<TextControl label="Title" value={service.title} onChange={(title) => updateService(index, { title })} />
							<TextControl label="Description" value={service.description} onChange={(description) => updateService(index, { description })} />
							<Button variant="link" isDestructive disabled={services.length <= 1} onClick={() => setServices(services.filter((_, serviceIndex) => serviceIndex !== index))}>Remove</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setServices([...services, { ...defaultService }])}>Add Service</Button>
				</PanelBody>
				<PanelBody title="Button" initialOpen={false}>
					<TextControl label="Label" value={attributes.buttonLabel} onChange={(buttonLabel) => setAttributes({ buttonLabel })} />
					<p>URL</p>
					<URLInputButton url={attributes.buttonUrl} onChange={(buttonUrl) => setAttributes({ buttonUrl })} />
					<ToggleControl label="Open in new tab" checked={Boolean(attributes.buttonNewTab)} onChange={(buttonNewTab) => setAttributes({ buttonNewTab })} />
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="home-services__inner az-section__inner">
					<div className="home-services__media">
						{attributes.imageUrl ? <img src={attributes.imageUrl} alt="" /> : <div className="home-services__placeholder">Select image</div>}
					</div>
					<div className="home-services__content">
						<RichText tagName="h2" className="home-services__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
						<div className="home-services__list">
							{services.map((service, index) => (
								<div className="home-services__item" key={index}>
									{service.iconImageUrl ? (
										<img className="home-services__icon-image" src={service.iconImageUrl} alt="" />
									) : (
										<ServiceIcon name={service.icon} />
									)}
									<RichText tagName="h3" className="home-services__title" value={service.title} allowedFormats={[]} onChange={(title) => updateService(index, { title })} />
									<RichText tagName="p" className="home-services__description" value={service.description} allowedFormats={[]} onChange={(description) => updateService(index, { description })} />
								</div>
							))}
						</div>
						{attributes.buttonLabel ? <span className="home-services__button az-button az-button--medium">{attributes.buttonLabel}</span> : null}
					</div>
				</div>
			</section>
		</>
	);
}
