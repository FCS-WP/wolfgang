<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 70,
    'paddingRight' => 0,
    'paddingBottom' => 80,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Our People',
    'ctaText' => "Want to meet us in person?\nDrop by and say hello.",
    'accentStartColor' => '#0167ff',
    'accentEndColor' => '#c5fda2',
    'columns' => 4,
    'people' => [],
]);
$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$people = is_array($attrs['people']) ? $attrs['people'] : [];
$columns = min(max(absint($attrs['columns']), 2), 5);
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--our-people-columns' => $columns,
    '--our-people-accent-start' => sanitize_hex_color((string) $attrs['accentStartColor']) ?: '#0167ff',
    '--our-people-accent-end' => sanitize_hex_color((string) $attrs['accentEndColor']) ?: '#c5fda2',
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
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'our-people az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="our-people__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?><h2 class="our-people__heading"><?php echo esc_html($attrs['heading']); ?></h2><?php endif; ?>
        <div class="our-people__grid">
            <?php foreach ($people as $person) : $person = wp_parse_args((array) $person, ['imageUrl' => '', 'imageAlt' => '', 'name' => '', 'role' => '']); ?>
                <article class="our-people__card">
                    <div class="our-people__image">
                        <?php if (trim((string) $person['imageUrl']) !== '') : ?><img src="<?php echo esc_url($person['imageUrl']); ?>" alt="<?php echo esc_attr($person['imageAlt']); ?>" loading="lazy" decoding="async"><?php endif; ?>
                        <div class="our-people__label">
                            <?php if (trim((string) $person['name']) !== '') : ?><h3 class="our-people__name"><?php echo esc_html($person['name']); ?></h3><?php endif; ?>
                            <?php if (trim((string) $person['role']) !== '') : ?><p class="our-people__role"><?php echo esc_html($person['role']); ?></p><?php endif; ?>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
        <?php if (trim((string) $attrs['ctaText']) !== '') : ?><div class="our-people__cta"><?php echo wp_kses_post(nl2br((string) $attrs['ctaText'])); ?></div><?php endif; ?>
    </div>
</section>
