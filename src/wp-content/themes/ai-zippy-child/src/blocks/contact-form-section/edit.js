import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, RangeControl, SelectControl, TextareaControl, TextControl } from "@wordpress/components";
import { SectionControls, getSectionClassName, getSectionStyle } from "../_shared/section-controls.js";

const iconOptions = [
	{ label: "Phone", value: "phone" },
	{ label: "Email", value: "email" },
	{ label: "Location", value: "location" },
];

const defaultContact = { icon: "phone", label: "Contact detail", url: "" };
const asContacts = (contacts) => (Array.isArray(contacts) && contacts.length ? contacts : [defaultContact]).map((contact) => ({ ...defaultContact, ...contact }));

const Icon = ({ name }) => {
	if (name === "email") {
		return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="m3 7 9 7 9-7"/></svg>;
	}
	if (name === "location") {
		return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
	}
	return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2h8v20H8z"/><path d="M11 19h2M10 5h4"/></svg>;
};

export default function Edit({ attributes, setAttributes }) {
	const contacts = asContacts(attributes.contacts);
	const blockProps = useBlockProps({
		className: getSectionClassName("contact-form-section", attributes),
		style: {
			...getSectionStyle(attributes),
			"--contact-form-section-gap": `${attributes.columnGap ?? 78}px`,
		},
	});
	const setContacts = (nextContacts) => setAttributes({ contacts: nextContacts });
	const updateContact = (index, patch) => setContacts(contacts.map((contact, contactIndex) => (contactIndex === index ? { ...contact, ...patch } : contact)));

	return (
		<>
			<InspectorControls>
				<PanelBody title="Contact Details" initialOpen={true}>
					<RangeControl label="Column gap" value={attributes.columnGap} min={32} max={140} step={2} onChange={(columnGap) => setAttributes({ columnGap })} />
					{contacts.map((contact, index) => (
						<div className="contact-form-section-editor__contact" key={index}>
							<SelectControl label="Icon" value={contact.icon} options={iconOptions} onChange={(icon) => updateContact(index, { icon })} />
							<TextControl label="Text" value={contact.label} onChange={(label) => updateContact(index, { label })} />
							<TextControl label="URL" value={contact.url} onChange={(url) => updateContact(index, { url })} />
						</div>
					))}
				</PanelBody>
				<PanelBody title="Form Embed" initialOpen={false}>
					<TextareaControl
						className="contact-form-section-editor__textarea"
						label="Form HTML or shortcode"
						value={attributes.embedHtml}
						onChange={(embedHtml) => setAttributes({ embedHtml })}
					/>
				</PanelBody>
			</InspectorControls>
			<SectionControls attributes={attributes} setAttributes={setAttributes} />
			<section {...blockProps}>
				<div className="contact-form-section__inner az-section__inner">
					<div className="contact-form-section__intro">
						<RichText tagName="h2" className="contact-form-section__heading" value={attributes.heading} allowedFormats={["core/bold"]} onChange={(heading) => setAttributes({ heading })} />
						<div className="contact-form-section__contacts">
							{contacts.map((contact, index) => (
								<div className="contact-form-section__contact" key={index}>
									<Icon name={contact.icon} />
									<span>{contact.label}</span>
								</div>
							))}
						</div>
					</div>
					<div className="contact-form-section__form-preview">
						<strong>Form embed preview</strong>
						<span>Your HTML or shortcode will render on the frontend.</span>
						<code>{attributes.embedHtml ? attributes.embedHtml.slice(0, 180) : "No form embed added yet."}</code>
					</div>
				</div>
			</section>
		</>
	);
}
