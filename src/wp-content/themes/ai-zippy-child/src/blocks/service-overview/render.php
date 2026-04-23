<?php
defined('ABSPATH') || exit;

$default_cards = [
    [
        'icon' => 'megaphone',
        'iconImageId' => 0,
        'iconImageUrl' => '',
        'iconImageAlt' => '',
        'title' => 'Digital Marketing',
        'items' => ['Social Media Marketing', 'Performance Marketing', 'Influencer Marketing', 'Content Marketing', 'Amplification Posts'],
    ],
    [
        'icon' => 'globe',
        'iconImageId' => 0,
        'iconImageUrl' => '',
        'iconImageAlt' => '',
        'title' => 'Website',
        'items' => ['E-commerce', 'SEO Optimization', 'Functionality & Integration (Booking system, Calendars)'],
    ],
    [
        'icon' => 'bulb',
        'iconImageId' => 0,
        'iconImageUrl' => '',
        'iconImageAlt' => '',
        'title' => 'Creative Services',
        'items' => ['Logo Design', 'Print Design', 'Digital Design', 'EDM', 'Generative AI'],
    ],
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#c8ff9a',
    'paddingTop' => 120,
    'paddingRight' => 0,
    'paddingBottom' => 96,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'intro' => 'Effective marketing more than just grabbing attention. It\'s about building meaningful connections. By combining strategy, creativity, and data, we craft campaigns that resonate and deliver measurable results.',
    'cards' => $default_cards,
    'cardRadius' => 8,
    'cardGap' => 28,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$cards = is_array($attrs['cards']) && $attrs['cards'] ? $attrs['cards'] : $default_cards;
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#c8ff9a',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--service-overview-card-radius' => min(max(absint($attrs['cardRadius']), 0), 32) . 'px',
    '--service-overview-card-gap' => min(max(absint($attrs['cardGap']), 14), 70) . 'px',
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

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'service-overview az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="service-overview__inner az-section__inner">
        <?php if (trim((string) $attrs['intro']) !== '') : ?>
            <p class="service-overview__intro"><?php echo esc_html($attrs['intro']); ?></p>
        <?php endif; ?>
        <div class="service-overview__cards">
            <?php foreach ($cards as $card) : $card = wp_parse_args((array) $card, ['icon' => 'megaphone', 'iconImageUrl' => '', 'iconImageAlt' => '', 'title' => '', 'items' => []]); ?>
                <article class="service-overview__card">
                    <?php if (trim((string) $card['iconImageUrl']) !== '') : ?>
                        <img class="service-overview__icon" src="<?php echo esc_url($card['iconImageUrl']); ?>" alt="<?php echo esc_attr($card['iconImageAlt']); ?>" loading="lazy" decoding="async">
                    <?php else : ?>
                        <?php $render_icon((string) $card['icon']); ?>
                    <?php endif; ?>
                    <?php if (trim((string) $card['title']) !== '') : ?><h3 class="service-overview__title"><?php echo esc_html($card['title']); ?></h3><?php endif; ?>
                    <?php if (!empty($card['items']) && is_array($card['items'])) : ?>
                        <ul class="service-overview__list">
                            <?php foreach ($card['items'] as $item) : if (trim((string) $item) === '') { continue; } ?>
                                <li><?php echo esc_html($item); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
