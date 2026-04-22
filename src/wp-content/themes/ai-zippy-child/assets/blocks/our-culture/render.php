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
    'accentStartColor' => '#0167ff',
    'accentEndColor' => '#c5fda2',
    'images' => [],
    'imageHeight' => 360,
]);
$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$images = is_array($attrs['images']) ? $attrs['images'] : [];
$height = min(max(absint($attrs['imageHeight']), 220), 520);
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
$get_item_class = static function ($index, $active_index, $total) {
    $raw_offset = ($index - $active_index + $total) % $total;
    $class = 'our-culture__item';

    if ($index === $active_index) {
        $class .= ' is-active';
    } elseif ($raw_offset === 1) {
        $class .= ' is-offset-plus-1';
    } elseif ($raw_offset === 2) {
        $class .= ' is-offset-plus-2';
    } elseif ($raw_offset === 3) {
        $class .= ' is-offset-plus-3';
    } elseif ($raw_offset === $total - 1) {
        $class .= ' is-offset-minus-1';
    } elseif ($raw_offset === $total - 2) {
        $class .= ' is-offset-minus-2';
    } else {
        $class .= ' is-hidden';
    }

    return $class;
};
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'our-culture az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="our-culture__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?><h2 class="our-culture__heading"><?php echo esc_html($attrs['heading']); ?></h2><?php endif; ?>
        <div class="our-culture__gallery" aria-label="<?php esc_attr_e('Culture gallery', 'ai-zippy-child'); ?>">
            <?php if ($images) : $active_index = (int) floor(count($images) / 2); $image_count = count($images); foreach ($images as $index => $image) : $image = wp_parse_args((array) $image, ['url' => '', 'alt' => '']); ?>
                <?php if (trim((string) $image['url']) !== '') : ?>
                    <button class="<?php echo esc_attr($get_item_class($index, $active_index, $image_count)); ?>" type="button">
                        <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" loading="lazy" decoding="async">
                    </button>
                <?php endif; ?>
            <?php endforeach; else : ?>
                <div class="our-culture__placeholder"><?php esc_html_e('Add culture images', 'ai-zippy-child'); ?></div>
            <?php endif; ?>
        </div>
    </div>
</section>
