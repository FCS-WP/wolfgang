<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'full',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 0,
    'paddingRight' => 0,
    'paddingBottom' => 0,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'paddingTopTablet' => null,
    'paddingRightTablet' => null,
    'paddingBottomTablet' => null,
    'paddingLeftTablet' => null,
    'marginTopTablet' => null,
    'marginBottomTablet' => null,
    'paddingTopMobile' => null,
    'paddingRightMobile' => null,
    'paddingBottomMobile' => null,
    'paddingLeftMobile' => null,
    'marginTopMobile' => null,
    'marginBottomMobile' => null,
    'text' => 'Productivity Solutions Grant Accredited',
    'mark' => '♛',
    'repeatCount' => 6,
    'speed' => 28,
    'height' => 34,
    'gap' => 34,
    'fontSize' => 18,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'full';
$repeat_count = min(max(absint($attrs['repeatCount']), 2), 12);
$speed = min(max(absint($attrs['speed']), 10), 80);
$height = min(max(absint($attrs['height']), 24), 96);
$gap = min(max(absint($attrs['gap']), 12), 96);
$font_size = min(max(absint($attrs['fontSize']), 12), 42);
$text = trim((string) $attrs['text']);
$mark = trim((string) $attrs['mark']);

if ($text === '') {
    return;
}

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--accreditation-marquee-speed' => $speed . 's',
    '--accreditation-marquee-height' => $height . 'px',
    '--accreditation-marquee-gap' => $gap . 'px',
    '--accreditation-marquee-font-size' => $font_size . 'px',
];

foreach ([
    'paddingTopTablet' => '--az-section-padding-top-tablet',
    'paddingRightTablet' => '--az-section-padding-right-tablet',
    'paddingBottomTablet' => '--az-section-padding-bottom-tablet',
    'paddingLeftTablet' => '--az-section-padding-left-tablet',
    'marginTopTablet' => '--az-section-margin-top-tablet',
    'marginBottomTablet' => '--az-section-margin-bottom-tablet',
    'paddingTopMobile' => '--az-section-padding-top-mobile',
    'paddingRightMobile' => '--az-section-padding-right-mobile',
    'paddingBottomMobile' => '--az-section-padding-bottom-mobile',
    'paddingLeftMobile' => '--az-section-padding-left-mobile',
    'marginTopMobile' => '--az-section-margin-top-mobile',
    'marginBottomMobile' => '--az-section-margin-bottom-mobile',
] as $attr_key => $css_var) {
    if (isset($attrs[$attr_key]) && $attrs[$attr_key] !== '') {
        $style_values[$css_var] = absint($attrs[$attr_key]) . 'px';
    }
}

$style = '';
foreach ($style_values as $property => $value) {
    $style .= sprintf('%s:%s;', $property, esc_attr((string) $value));
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'accreditation-marquee az-section az-section--' . $layout,
    'style' => $style,
]);

$render_group = static function () use ($repeat_count, $text, $mark): void {
    for ($index = 0; $index < $repeat_count; $index++) {
        ?>
        <span class="accreditation-marquee__item">
            <?php if ($mark !== '') : ?>
                <span class="accreditation-marquee__mark" aria-hidden="true"><?php echo esc_html($mark); ?></span>
            <?php endif; ?>
            <span class="accreditation-marquee__text"><?php echo esc_html($text); ?></span>
        </span>
        <?php
    }
};
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> aria-label="<?php echo esc_attr($text); ?>">
    <div class="accreditation-marquee__inner az-section__inner">
        <div class="accreditation-marquee__viewport">
            <div class="accreditation-marquee__track">
                <div class="accreditation-marquee__group">
                    <?php $render_group(); ?>
                </div>
                <div class="accreditation-marquee__group" aria-hidden="true">
                    <?php $render_group(); ?>
                </div>
            </div>
        </div>
    </div>
</section>
