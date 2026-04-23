<?php
defined('ABSPATH') || exit;

$default_services = [
    [
        'icon' => 'megaphone',
        'title' => 'Digital marketing',
        'description' => 'Build your brand, reach the right audience, and turn attention into action with our end-to-end digital marketing expertise.',
    ],
    [
        'icon' => 'globe',
        'title' => 'Website',
        'description' => 'We design high-converting, mobile-friendly websites that turn visitors into paying customers.',
    ],
    [
        'icon' => 'bulb',
        'title' => 'Creative services',
        'description' => 'We craft compelling ideas into visuals and campaigns that elevate your brand.',
    ],
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#c8ff9a',
    'textColor' => '#000000',
    'paddingTop' => 56,
    'paddingRight' => 0,
    'paddingBottom' => 86,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'imageUrl' => '',
    'imageAlt' => '',
    'heading' => 'Our Services',
    'services' => $default_services,
    'buttonLabel' => 'Find out more',
    'buttonUrl' => '/our-services',
    'buttonNewTab' => false,
    'imageRadius' => 12,
    'contentGap' => 66,
    'itemGap' => 48,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$services = is_array($attrs['services']) && $attrs['services'] ? $attrs['services'] : $default_services;
$image_radius = min(max(absint($attrs['imageRadius']), 0), 40);
$content_gap = min(max(absint($attrs['contentGap']), 24), 140);
$item_gap = min(max(absint($attrs['itemGap']), 20), 90);

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#c8ff9a',
    '--az-section-color' => $attrs['textColor'] ?: '#000000',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--home-services-image-radius' => $image_radius . 'px',
    '--home-services-content-gap' => $content_gap . 'px',
    '--home-services-item-gap' => $item_gap . 'px',
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
    'class' => 'home-services az-section az-section--' . $layout,
    'style' => $style,
]);

$render_icon = static function (string $icon): void {
    if ($icon === 'globe') {
        echo '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="22" cy="22" r="17"/><path d="M5 22h34M22 5c5 5 8 11 8 17 0 3-.7 6-2 9M22 5c-5 5-8 11-8 17 0 6 3 12 8 17M9 13h26M9 31h21M31 31l11 11M34 41l8-8"/></svg>';
        return;
    }

    if ($icon === 'bulb') {
        echo '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M16 32c-4-3-6-7-6-12 0-8 6-14 14-14s14 6 14 14c0 5-2 9-6 12M18 32h12M19 38h10M21 43h6M24 1v5M4 20h5M39 20h5M9 7l4 4M39 7l-4 4"/></svg>';
        return;
    }

    echo '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M5 10h26v16H16l-7 7v-7H5zM31 15l9-5v22l-9-5M18 32l4 10h7l-4-10M12 18h2M19 18h2M26 18h2"/></svg>';
};
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="home-services__inner az-section__inner">
        <div class="home-services__media">
            <?php if (!empty($attrs['imageUrl'])) : ?>
                <img src="<?php echo esc_url($attrs['imageUrl']); ?>" alt="<?php echo esc_attr($attrs['imageAlt']); ?>">
            <?php endif; ?>
        </div>
        <div class="home-services__content">
            <?php if (trim((string) $attrs['heading']) !== '') : ?>
                <h2 class="home-services__heading"><?php echo esc_html($attrs['heading']); ?></h2>
            <?php endif; ?>
            <div class="home-services__list">
                <?php foreach ($services as $service) : ?>
                    <?php $service = wp_parse_args((array) $service, ['icon' => 'megaphone', 'title' => '', 'description' => '']); ?>
                    <div class="home-services__item">
                        <?php $render_icon((string) $service['icon']); ?>
                        <?php if (trim((string) $service['title']) !== '') : ?>
                            <h3 class="home-services__title"><?php echo esc_html($service['title']); ?></h3>
                        <?php endif; ?>
                        <?php if (trim((string) $service['description']) !== '') : ?>
                            <p class="home-services__description"><?php echo esc_html($service['description']); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php if (trim((string) $attrs['buttonLabel']) !== '') : ?>
                <?php if (trim((string) $attrs['buttonUrl']) !== '') : ?>
                    <a class="home-services__button az-button az-button--medium" href="<?php echo esc_url($attrs['buttonUrl']); ?>" <?php echo !empty($attrs['buttonNewTab']) ? 'target="_blank" rel="noopener noreferrer"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
                        <?php echo esc_html($attrs['buttonLabel']); ?>
                    </a>
                <?php else : ?>
                    <span class="home-services__button az-button az-button--medium"><?php echo esc_html($attrs['buttonLabel']); ?></span>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</section>
