<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 120,
    'paddingRight' => 0,
    'paddingBottom' => 70,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'items' => [
        ['value' => '1000+', 'label' => 'client served'],
        ['value' => '100%', 'label' => 'claim rate'],
        ['value' => '5', 'label' => 'years of expertise'],
    ],
    'startColor' => '#b8ff9b',
    'endColor' => '#1688ff',
    'columns' => 3,
    'gap' => 72,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$items = is_array($attrs['items']) ? $attrs['items'] : [];
$columns = min(max(absint($attrs['columns']), 1), 4);
$gap = min(max(absint($attrs['gap']), 20), 160);

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--home-stats-start' => sanitize_hex_color((string) $attrs['startColor']) ?: '#b8ff9b',
    '--home-stats-end' => sanitize_hex_color((string) $attrs['endColor']) ?: '#1688ff',
    '--home-stats-columns' => $columns,
    '--home-stats-gap' => $gap . 'px',
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
    'class' => 'home-stats az-section az-section--' . $layout,
    'style' => $style,
]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="home-stats__inner az-section__inner">
        <div class="home-stats__grid">
            <?php foreach ($items as $item) : ?>
                <?php $item = wp_parse_args((array) $item, ['value' => '', 'label' => '']); ?>
                <?php if (trim((string) $item['value']) === '' && trim((string) $item['label']) === '') { continue; } ?>
                <div class="home-stats__item">
                    <?php if (trim((string) $item['value']) !== '') : ?>
                        <div class="home-stats__value"><?php echo esc_html($item['value']); ?></div>
                    <?php endif; ?>
                    <?php if (trim((string) $item['label']) !== '') : ?>
                        <div class="home-stats__label"><?php echo esc_html($item['label']); ?></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
