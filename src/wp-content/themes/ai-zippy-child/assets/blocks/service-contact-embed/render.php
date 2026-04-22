<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#1b1b1b',
    'textColor' => '#ffffff',
    'paddingTop' => 96,
    'paddingRight' => 0,
    'paddingBottom' => 112,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Ready to Take The Next Step?',
    'embedHtml' => '<form><div class="service-contact-embed__row"><label>First name *<input type="text" name="first-name"></label><label>Last name<input type="text" name="last-name"></label></div><label>Phone *<input type="tel" name="phone"></label><label>Email *<input type="email" name="email"></label><label>Nature of Business *<select name="business"><option value=""></option><option>Retail</option><option>Food & Beverage</option><option>Services</option></select></label><label>Type of Services *<select name="service"><option value=""></option><option>Digital Marketing</option><option>Website</option><option>Creative Services</option></select></label><button type="submit">Submit</button></form>',
    'contentWidth' => 760,
    'headingBottomGap' => 42,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#1b1b1b',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--service-contact-content-width' => min(max(absint($attrs['contentWidth']), 520), 1100) . 'px',
    '--service-contact-heading-gap' => min(max(absint($attrs['headingBottomGap']), 20), 100) . 'px',
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

$embed_source = (string) $attrs['embedHtml'];
$form_html = do_shortcode($embed_source);
$is_shortcode_embed = preg_match('/\[(custom_form|zippy_contact_form)\b/i', $embed_source);
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'service-contact-embed az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="service-contact-embed__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?>
            <h2 class="service-contact-embed__heading"><?php echo esc_html($attrs['heading']); ?></h2>
        <?php endif; ?>
        <div class="service-contact-embed__embed">
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
