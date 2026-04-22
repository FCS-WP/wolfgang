<?php
defined('ABSPATH') || exit;

$default_cards = [
    [
        'icon' => 'vision',
        'iconId' => 0,
        'iconUrl' => '',
        'iconAlt' => '',
        'title' => 'Vision',
        'description' => '',
    ],
    [
        'icon' => 'mission',
        'iconId' => 0,
        'iconUrl' => '',
        'iconAlt' => '',
        'title' => 'Mission',
        'description' => '',
    ],
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#c8ff9a',
    'textColor' => '#000000',
    'paddingTop' => 110,
    'paddingRight' => 0,
    'paddingBottom' => 110,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Our Story',
    'body' => "Wolfgang Ethos is the creative and marketing arm of EPOS, focused on helping SMEs grow through strategic, results-driven campaigns. By combining local insights with expertise in digital marketing, website development, and WhatsApp engagement, Wolfgang delivers integrated solutions that drive real business impact.\n\nBacked by EPOS and strengthened by ANT Group's 2025 investment, Wolfgang is uniquely positioned to scale smarter, more connected marketing solutions for merchants.",
    'cardRadius' => 8,
    'cardMinHeight' => 290,
    'cardBackgroundColor' => '#000000',
    'cardTextColor' => '#ffffff',
    'cardAccentStartColor' => '#1688ff',
    'cardAccentEndColor' => '#c8ff9a',
    'cards' => $default_cards,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$cards = is_array($attrs['cards']) && $attrs['cards'] ? $attrs['cards'] : $default_cards;
$card_radius = min(max(absint($attrs['cardRadius']), 0), 32);
$card_min_height = min(max(absint($attrs['cardMinHeight']), 220), 520);

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#c8ff9a',
    '--az-section-color' => $attrs['textColor'] ?: '#000000',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--our-story-card-radius' => $card_radius . 'px',
    '--our-story-card-min-height' => $card_min_height . 'px',
    '--our-story-card-bg' => $attrs['cardBackgroundColor'] ?: '#000000',
    '--our-story-card-color' => $attrs['cardTextColor'] ?: '#ffffff',
    '--our-story-card-accent-start' => sanitize_hex_color((string) $attrs['cardAccentStartColor']) ?: '#1688ff',
    '--our-story-card-accent-end' => sanitize_hex_color((string) $attrs['cardAccentEndColor']) ?: '#c8ff9a',
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
    'class' => 'our-story-intro az-section az-section--' . $layout,
    'style' => $style,
]);

$render_icon = static function (string $icon): void {
    if ($icon === 'mission') {
        echo '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="29" cy="34" r="18"/><circle cx="29" cy="34" r="10"/><circle cx="29" cy="34" r="3"/><path d="M42 21l10-10M45 11h7v7M38 25l14-14M10 34c0-11 8-20 19-20M29 54c-11 0-19-9-19-20"/></svg>';
        return;
    }

    echo '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M5 32s10-15 27-15 27 15 27 15-10 15-27 15S5 32 5 32z"/><circle cx="32" cy="32" r="8"/><path d="M32 7v6M32 51v6M17 11l3 5M47 11l-3 5M8 21l6 3M56 21l-6 3"/></svg>';
};
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="our-story-intro__inner az-section__inner">
        <div class="our-story-intro__copy">
            <?php if (trim((string) $attrs['heading']) !== '') : ?>
                <h2 class="our-story-intro__heading"><?php echo esc_html($attrs['heading']); ?></h2>
            <?php endif; ?>
            <?php if (trim((string) $attrs['body']) !== '') : ?>
                <div class="our-story-intro__body"><?php echo wp_kses_post(wpautop((string) $attrs['body'])); ?></div>
            <?php endif; ?>
        </div>
        <div class="our-story-intro__cards">
            <?php foreach ($cards as $card) : ?>
                <?php
                $card = wp_parse_args((array) $card, [
                    'icon' => 'vision',
                    'iconId' => 0,
                    'iconUrl' => '',
                    'iconAlt' => '',
                    'title' => '',
                    'description' => '',
                ]);
                ?>
                <article class="our-story-intro__card">
                    <?php if (trim((string) $card['iconUrl']) !== '') : ?>
                        <img class="our-story-intro__icon" src="<?php echo esc_url($card['iconUrl']); ?>" alt="<?php echo esc_attr($card['iconAlt']); ?>" loading="lazy" decoding="async" />
                    <?php else : ?>
                        <?php $render_icon((string) $card['icon']); ?>
                    <?php endif; ?>
                    <?php if (trim((string) $card['title']) !== '') : ?>
                        <h3 class="our-story-intro__card-title"><?php echo esc_html($card['title']); ?></h3>
                    <?php endif; ?>
                    <?php if (trim((string) $card['description']) !== '') : ?>
                        <p class="our-story-intro__card-description"><?php echo wp_kses_post($card['description']); ?></p>
                    <?php endif; ?>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
