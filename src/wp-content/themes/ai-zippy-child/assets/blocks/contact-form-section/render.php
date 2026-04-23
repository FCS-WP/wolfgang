<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 86,
    'paddingRight' => 0,
    'paddingBottom' => 96,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Lets Make<br>Something<br>Awesome<br>Together.',
    'contacts' => [
        ['icon' => 'phone', 'label' => '65 1234 5678', 'url' => 'tel:+6512345678'],
        ['icon' => 'email', 'label' => 'care@ethoscreatives.com', 'url' => 'mailto:care@ethoscreatives.com'],
        ['icon' => 'location', 'label' => '51 Bras Basah Rd, Singapore 189554', 'url' => ''],
    ],
    'embedHtml' => '[custom_form submit_text="Submit"]
[form_input type="text" label="First name" required="true" width="50%"]
[form_input type="text" label="Last name" width="50%"]
[form_phone label="Phone" required="true" width="100%" initial_country="sg"]
[form_input type="email" label="Email" required="true" width="100%"]
[form_select label="Nature of Business" options="Food & Beverage,Retail,Services" required="true" width="100%"]
[form_select label="Type of Services" options="Website,Digital Marketing,Creative Services" required="true" width="100%"]
[/custom_form]',
    'columnGap' => 78,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$contacts = is_array($attrs['contacts']) ? $attrs['contacts'] : [];
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--contact-form-section-gap' => min(max(absint($attrs['columnGap']), 32), 140) . 'px',
];

foreach (['paddingTopTablet'=>'--az-section-padding-top-tablet','paddingRightTablet'=>'--az-section-padding-right-tablet','paddingBottomTablet'=>'--az-section-padding-bottom-tablet','paddingLeftTablet'=>'--az-section-padding-left-tablet','marginTopTablet'=>'--az-section-margin-top-tablet','marginBottomTablet'=>'--az-section-margin-bottom-tablet','paddingTopMobile'=>'--az-section-padding-top-mobile','paddingRightMobile'=>'--az-section-padding-right-mobile','paddingBottomMobile'=>'--az-section-padding-bottom-mobile','paddingLeftMobile'=>'--az-section-padding-left-mobile','marginTopMobile'=>'--az-section-margin-top-mobile','marginBottomMobile'=>'--az-section-margin-bottom-mobile'] as $key => $var) {
    if (isset($attrs[$key]) && $attrs[$key] !== '') {
        $style_values[$var] = absint($attrs[$key]) . 'px';
    }
}

$style = '';
foreach ($style_values as $property => $value) {
    $style .= sprintf('%s:%s;', $property, esc_attr((string) $value));
}

$allowed_html = [
    'form' => ['action' => true, 'method' => true, 'class' => true, 'id' => true, 'name' => true, 'target' => true, 'autocomplete' => true, 'novalidate' => true],
    'div' => ['class' => true, 'id' => true, 'data-*' => true],
    'span' => ['class' => true, 'id' => true],
    'p' => ['class' => true, 'id' => true],
    'label' => ['for' => true, 'class' => true, 'id' => true],
    'input' => ['type' => true, 'name' => true, 'value' => true, 'placeholder' => true, 'required' => true, 'class' => true, 'id' => true, 'autocomplete' => true, 'checked' => true, 'disabled' => true, 'data-full-name' => true, 'data-country-name' => true, 'data-initial-country' => true],
    'select' => ['name' => true, 'required' => true, 'class' => true, 'id' => true, 'multiple' => true, 'disabled' => true],
    'option' => ['value' => true, 'selected' => true, 'disabled' => true],
    'textarea' => ['name' => true, 'placeholder' => true, 'required' => true, 'class' => true, 'id' => true, 'rows' => true, 'cols' => true, 'disabled' => true],
    'button' => ['type' => true, 'name' => true, 'value' => true, 'class' => true, 'id' => true, 'disabled' => true],
    'iframe' => ['src' => true, 'title' => true, 'width' => true, 'height' => true, 'class' => true, 'id' => true, 'loading' => true, 'allow' => true, 'allowfullscreen' => true, 'frameborder' => true],
    'br' => [],
];

$render_icon = static function (string $icon): void {
    if ($icon === 'email') {
        echo '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18v12H3z"/><path d="m3 7 9 7 9-7"/></svg>';
        return;
    }
    if ($icon === 'location') {
        echo '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
        return;
    }
    echo '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 2h8v20H8z"/><path d="M11 19h2M10 5h4"/></svg>';
};

$embed_source = (string) $attrs['embedHtml'];
$form_html = do_shortcode($embed_source);
$is_shortcode_embed = preg_match('/\[(custom_form|zippy_contact_form)\b/i', $embed_source);
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'contact-form-section az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="contact-form-section__inner az-section__inner">
        <div class="contact-form-section__intro">
            <?php if (trim((string) $attrs['heading']) !== '') : ?>
                <h2 class="contact-form-section__heading"><?php echo wp_kses_post($attrs['heading']); ?></h2>
            <?php endif; ?>
            <div class="contact-form-section__contacts">
                <?php foreach ($contacts as $contact) : $contact = wp_parse_args((array) $contact, ['icon' => 'phone', 'label' => '', 'url' => '']); ?>
                    <?php if (trim((string) $contact['label']) === '') { continue; } ?>
                    <?php $tag = trim((string) $contact['url']) !== '' ? 'a' : 'span'; ?>
                    <<?php echo tag_escape($tag); ?> class="contact-form-section__contact" <?php echo $tag === 'a' ? 'href="' . esc_url($contact['url']) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
                        <?php $render_icon((string) $contact['icon']); ?>
                        <span><?php echo esc_html($contact['label']); ?></span>
                    </<?php echo tag_escape($tag); ?>>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="contact-form-section__form">
            <?php
            if ($is_shortcode_embed) {
                echo $form_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted local form shortcodes include inline validation script.
            } else {
                echo wp_kses($form_html, $allowed_html);
            }
            ?>
        </div>
    </div>
</section>
