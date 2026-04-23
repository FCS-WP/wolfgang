<?php
defined('ABSPATH') || exit;

$default_items = [
    [
        'icon' => 'solution',
        'iconId' => 0,
        'iconUrl' => '',
        'iconAlt' => '',
        'title' => 'All in one solution',
        'description' => 'As part of an all-in-one SME solution, we deliver marketing services seamlessly integrated with EPOS POS and rewards programs. This connects every campaign across your ecosystem, helping you engage customers, track results in real time, and drive loyalty from one unified platform.',
    ],
    [
        'icon' => 'ai',
        'iconId' => 0,
        'iconUrl' => '',
        'iconAlt' => '',
        'title' => 'AI driven',
        'description' => 'We leverage AI-driven processes to streamline every stage of your marketing projects. From content creation and campaign optimisation to performance tracking, AI helps us work more efficiently to deliver faster turnaround times, so your business sees results sooner without compromising quality.',
    ],
    [
        'icon' => 'local',
        'iconId' => 0,
        'iconUrl' => '',
        'iconAlt' => '',
        'title' => 'We are local',
        'description' => 'We are a team with a deep understanding of the local trends, behaviours, and nuances to create more relevant and relatable campaigns. This ensures your brand communicates authentically while connecting more effectively with your target market.',
    ],
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 116,
    'paddingRight' => 0,
    'paddingBottom' => 130,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Why Choose Us',
    'headingStartColor' => '#1688ff',
    'headingEndColor' => '#c8ff9a',
    'iconColor' => '#c8ff9a',
    'columns' => 3,
    'gap' => 120,
    'items' => $default_items,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$items = is_array($attrs['items']) && $attrs['items'] ? $attrs['items'] : $default_items;
$columns = min(max(absint($attrs['columns']), 1), 4);
$gap = min(max(absint($attrs['gap']), 40), 180);

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--why-choose-heading-start' => sanitize_hex_color((string) $attrs['headingStartColor']) ?: '#1688ff',
    '--why-choose-heading-end' => sanitize_hex_color((string) $attrs['headingEndColor']) ?: '#c8ff9a',
    '--why-choose-icon-color' => sanitize_hex_color((string) $attrs['iconColor']) ?: '#c8ff9a',
    '--why-choose-columns' => $columns,
    '--why-choose-gap' => $gap . 'px',
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
    'class' => 'why-choose-us az-section az-section--' . $layout,
    'style' => $style,
]);

$render_icon = static function (string $icon): void {
    if ($icon === 'ai') {
        echo '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="21" y="21" width="22" height="22" rx="4"/><rect x="27" y="27" width="10" height="10" rx="2"/><path d="M12 20h9M12 32h9M12 44h9M43 20h9M43 32h9M43 44h9M20 12v9M32 12v9M44 12v9M20 43v9M32 43v9M44 43v9M27 32h10M32 27v10"/><circle cx="12" cy="20" r="2"/><circle cx="12" cy="32" r="2"/><circle cx="12" cy="44" r="2"/><circle cx="52" cy="20" r="2"/><circle cx="52" cy="32" r="2"/><circle cx="52" cy="44" r="2"/></svg>';
        return;
    }

    if ($icon === 'local') {
        echo '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M17 26c2-5 4-11 5-17 1-4 5-6 9-5h8c4 0 7 3 8 7l3 13M15 27l10 2 3 10 7 2 6-5 8 2M18 29c-2 4-2 10 2 15 3 5 9 9 16 9 11 0 20-9 20-20 0-4-1-7-3-10M29 41l-4 4M41 36l3 7M34 21h8M29 29h8M27 15l-4 9"/><path d="M8 28c5-1 10-2 16 1M50 24c4 1 6 2 8 5"/></svg>';
        return;
    }

    echo '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M11 47l17-8h10c5 0 10-4 10-9V17c0-7-6-12-13-12s-13 5-13 12v7"/><path d="M25 45l-10 8H6v-9h9M26 39v-8h12v8M29 31V17M35 31V17M24 17h16M32 5v7M19 13l-5-5M45 13l5-5M14 25H6M58 25h-8"/></svg>';
};
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="why-choose-us__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?>
            <h2 class="why-choose-us__heading"><?php echo esc_html($attrs['heading']); ?></h2>
        <?php endif; ?>
        <div class="why-choose-us__grid">
            <?php foreach ($items as $item) : ?>
                <?php
                $item = wp_parse_args((array) $item, [
                    'icon' => 'solution',
                    'iconId' => 0,
                    'iconUrl' => '',
                    'iconAlt' => '',
                    'title' => '',
                    'description' => '',
                ]);
                ?>
                <div class="why-choose-us__item">
                    <?php if (trim((string) $item['iconUrl']) !== '') : ?>
                        <img class="why-choose-us__icon" src="<?php echo esc_url($item['iconUrl']); ?>" alt="<?php echo esc_attr($item['iconAlt']); ?>" loading="lazy" decoding="async" />
                    <?php else : ?>
                        <?php $render_icon((string) $item['icon']); ?>
                    <?php endif; ?>
                    <?php if (trim((string) $item['title']) !== '') : ?>
                        <h3 class="why-choose-us__title"><?php echo esc_html($item['title']); ?></h3>
                    <?php endif; ?>
                    <?php if (trim((string) $item['description']) !== '') : ?>
                        <p class="why-choose-us__description"><?php echo esc_html($item['description']); ?></p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
