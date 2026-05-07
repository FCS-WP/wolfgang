<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#1b1b1b',
    'textColor' => '#ffffff',
    'paddingTop' => 90,
    'paddingRight' => 0,
    'paddingBottom' => 100,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Our Culture',
    'description' => '',
    'accentStartColor' => '#0167ff',
    'accentEndColor' => '#c5fda2',
    'images' => [],
    'imageHeight' => 360,
    'autoRun' => false,
    'autoRunDelay' => 3200,
]);
$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$images = is_array($attrs['images']) ? $attrs['images'] : [];
$height = min(max(absint($attrs['imageHeight']), 220), 520);
$auto_run_delay = min(max(absint($attrs['autoRunDelay']), 1500), 9000);
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#1b1b1b',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--our-culture-accent-start' => sanitize_hex_color((string) $attrs['accentStartColor']) ?: '#0167ff',
    '--our-culture-accent-end' => sanitize_hex_color((string) $attrs['accentEndColor']) ?: '#c5fda2',
    '--our-culture-image-height' => $height . 'px',
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
$get_item_style = static function ($index, $active_index, $total) {
    if ($total < 1) {
        return '';
    }

    $angle = (($index - $active_index) / $total) * M_PI * 2 + M_PI / 2;
    $base_width = max(88, min(220, 980 / max($total, 5)));
    $radius_x = max(220, min(440, 220 + $total * 12));
    $radius_y = max(72, min(170, 98 + $total * 3));
    $x = cos($angle) * $radius_x;
    $y = sin($angle) * $radius_y;
    $depth = (($y / $radius_y) + 1) / 2;
    $scale = 0.54 + $depth * 0.46;
    $opacity = 0.22 + $depth * 0.78;
    $overlay_opacity = $index === $active_index ? 0 : max(0.12, 0.62 - $depth * 0.42);
    $z_index = 10 + (int) round($depth * 40);

    return sprintf(
        '--our-culture-item-x:%1$spx;--our-culture-item-y:%2$spx;--our-culture-item-scale:%3$s;--our-culture-item-opacity:%4$s;--our-culture-item-z:%5$s;--our-culture-item-overlay-opacity:%6$s;--our-culture-item-base-width:%7$spx;',
        esc_attr((string) round($x, 2)),
        esc_attr((string) round($y, 2)),
        esc_attr((string) round($scale, 4)),
        esc_attr((string) round($opacity, 4)),
        esc_attr((string) $z_index),
        esc_attr((string) round($overlay_opacity, 4)),
        esc_attr((string) round($base_width, 2))
    );
};
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'our-culture az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-auto-run="<?php echo !empty($attrs['autoRun']) ? 'true' : 'false'; ?>" data-auto-run-delay="<?php echo esc_attr((string) $auto_run_delay); ?>">
    <div class="our-culture__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?><h2 class="our-culture__heading"><?php echo esc_html($attrs['heading']); ?></h2><?php endif; ?>
        <?php if (trim((string) $attrs['description']) !== '') : ?><div class="our-culture__description"><?php echo wp_kses_post(wpautop((string) $attrs['description'])); ?></div><?php endif; ?>
        <div class="our-culture__gallery" aria-label="<?php esc_attr_e('Culture gallery', 'ai-zippy-child'); ?>">
            <?php if ($images) : $active_index = (int) floor(count($images) / 2); $image_count = count($images); foreach ($images as $index => $image) : $image = wp_parse_args((array) $image, ['url' => '', 'alt' => '']); ?>
                <?php if (trim((string) $image['url']) !== '') : ?>
                    <button class="our-culture__item<?php echo $index === $active_index ? ' is-active' : ''; ?>" type="button" style="<?php echo esc_attr($get_item_style($index, $active_index, $image_count)); ?>">
                        <div class="our-culture__overlay"></div>
                        <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" loading="lazy" decoding="async">
                    </button>
                <?php endif; ?>
            <?php endforeach; else : ?>
                <div class="our-culture__placeholder"><?php esc_html_e('Add culture images', 'ai-zippy-child'); ?></div>
            <?php endif; ?>
        </div>
    </div>
</section>
