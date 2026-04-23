<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 70,
    'paddingRight' => 0,
    'paddingBottom' => 120,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'logos' => [],
    'speed' => 36,
    'logoSize' => 92,
    'gap' => 48,
    'pauseOnHover' => true,
    'reverse' => false,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$logos = is_array($attrs['logos']) ? array_values(array_filter($attrs['logos'], static fn($logo) => !empty($logo['url']))) : [];
$speed = min(max(absint($attrs['speed']), 12), 90);
$logo_size = min(max(absint($attrs['logoSize']), 54), 180);
$gap = min(max(absint($attrs['gap']), 16), 120);

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--client-logo-marquee-speed' => $speed . 's',
    '--client-logo-marquee-size' => $logo_size . 'px',
    '--client-logo-marquee-gap' => $gap . 'px',
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

$classes = trim('client-logo-marquee az-section az-section--' . $layout . (!empty($attrs['pauseOnHover']) ? ' client-logo-marquee--pause' : '') . (!empty($attrs['reverse']) ? ' client-logo-marquee--reverse' : ''));
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => $classes,
    'style' => $style,
]);

$render_group = static function () use ($logos): void {
    foreach ($logos as $logo) {
        $logo = wp_parse_args((array) $logo, ['url' => '', 'alt' => '', 'name' => '']);
        ?>
        <div class="client-logo-marquee__logo">
            <img src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($logo['alt'] ?: $logo['name']); ?>">
        </div>
        <?php
    }
};
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="client-logo-marquee__inner az-section__inner">
        <?php if ($logos) : ?>
            <div class="client-logo-marquee__viewport">
                <div class="client-logo-marquee__track">
                    <div class="client-logo-marquee__group">
                        <?php $render_group(); ?>
                    </div>
                    <div class="client-logo-marquee__group" aria-hidden="true">
                        <?php $render_group(); ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>
