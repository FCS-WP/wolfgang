import { InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, useSettings } from "@wordpress/block-editor";
import { BaseControl, Button, ColorPalette, PanelBody, RangeControl, TextControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const defaultPerson = { imageId: 0, imageUrl: "", imageAlt: "", name: "Name", role: "Role" };
const asPeople = (people) => (Array.isArray(people) && people.length ? people : [defaultPerson]).map((person) => ({ ...defaultPerson, ...person }));

export default function Edit({ attributes, setAttributes }) {
	const [themePalette] = useSettings("color.palette");
	const people = asPeople(attributes.people);
	const blockProps = useBlockProps({
		className: getSectionClassName("our-people", attributes),
		style: {
			...getSectionStyle(attributes),
			"--our-people-columns": attributes.columns || 4,
			"--our-people-accent-start": attributes.accentStartColor || "#0167ff",
			"--our-people-accent-end": attributes.accentEndColor || "#c5fda2",
		},
	});
	const setPeople = (nextPeople) => setAttributes({ people: nextPeople });
	const updatePerson = (index, patch) => setPeople(people.map((person, personIndex) => (personIndex === index ? { ...person, ...patch } : person)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Layout" initialOpen={true}>
					<RangeControl label="Columns" value={attributes.columns} min={2} max={5} step={1} onChange={(columns) => setAttributes({ columns })} />
					<BaseControl label="Heading start color">
						<ColorPalette colors={themePalette || []} value={attributes.accentStartColor} onChange={(accentStartColor) => setAttributes({ accentStartColor: accentStartColor || "" })} clearable />
					</BaseControl>
					<BaseControl label="Heading end color">
						<ColorPalette colors={themePalette || []} value={attributes.accentEndColor} onChange={(accentEndColor) => setAttributes({ accentEndColor: accentEndColor || "" })} clearable />
					</BaseControl>
				</PanelBody>
				<PanelBody title="People" initialOpen={true}>
					{people.map((person, index) => (
						<div className="our-people-editor__person" key={index}>
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={["image"]}
									value={person.imageId}
									onSelect={(media) => updatePerson(index, { imageId: media.id, imageUrl: media.url, imageAlt: media.alt || media.title || "" })}
									render={({ open }) => (
										<div className="our-people-editor__media">
											{person.imageUrl ? <img src={person.imageUrl} alt="" /> : <div>No image</div>}
											<Button variant="secondary" onClick={open}>{person.imageUrl ? "Replace" : "Upload"}</Button>
										</div>
									)}
								/>
							</MediaUploadCheck>
							<TextControl label="Name" value={person.name} onChange={(name) => updatePerson(index, { name })} />
							<TextControl label="Role" value={person.role} onChange={(role) => updatePerson(index, { role })} />
							<TextControl label="Alt text" value={person.imageAlt} onChange={(imageAlt) => updatePerson(index, { imageAlt })} />
							<Button variant="link" isDestructive disabled={people.length <= 1} onClick={() => setPeople(people.filter((_, personIndex) => personIndex !== index))}>Remove</Button>
						</div>
					))}
					<Button variant="primary" onClick={() => setPeople([...people, { ...defaultPerson }])}>Add Person</Button>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="our-people__inner az-section__inner">
					<RichText tagName="h2" className="our-people__heading" value={attributes.heading} allowedFormats={[]} onChange={(heading) => setAttributes({ heading })} />
					<div className="our-people__grid">
						{people.map((person, index) => (
							<article className="our-people__card" key={index}>
								<div className="our-people__image">
									{person.imageUrl ? <img src={person.imageUrl} alt="" /> : null}
									<div className="our-people__label">
										<RichText tagName="h3" className="our-people__name" value={person.name} allowedFormats={[]} onChange={(name) => updatePerson(index, { name })} />
										<RichText tagName="p" className="our-people__role" value={person.role} allowedFormats={[]} onChange={(role) => updatePerson(index, { role })} />
									</div>
								</div>
							</article>
						))}
					</div>
					<RichText tagName="div" multiline="br" className="our-people__cta" value={attributes.ctaText} allowedFormats={["core/bold", "core/italic"]} onChange={(ctaText) => setAttributes({ ctaText })} />
				</div>
			</section>
		</>
	);
}
