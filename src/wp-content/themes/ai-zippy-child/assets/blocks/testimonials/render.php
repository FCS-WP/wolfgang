<?php
defined('ABSPATH') || exit;

$default_items = [
    [
        'quote' => '"Add a testimonial and showcase positive feedback from a happy client or customer."',
        'name' => 'Client 01',
        'company' => "Company's Name",
    ],
    [
        'quote' => '"Their team helped us move faster, sharpen our campaigns, and make every touchpoint feel more connected."',
        'name' => 'Client 02',
        'company' => "Company's Name",
    ],
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#c8ff9a',
    'textColor' => '#000000',
    'paddingTop' => 136,
    'paddingRight' => 0,
    'paddingBottom' => 116,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'eyebrow' => 'What Clients Say',
    'quoteMaxWidth' => 820,
    'autoplay' => false,
    'autoplayDelay' => 6000,
    'showArrows' => true,
    'showDots' => true,
    'items' => $default_items,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$items = is_array($attrs['items']) && $attrs['items'] ? $attrs['items'] : $default_items;
$quote_width = min(max(absint($attrs['quoteMaxWidth']), 520), 1100);
$autoplay_delay = min(max(absint($attrs['autoplayDelay']), 2500), 12000);
$has_multiple = count($items) > 1;

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#c8ff9a',
    '--az-section-color' => $attrs['textColor'] ?: '#000000',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--testimonials-quote-width' => $quote_width . 'px',
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
    'class' => 'testimonials az-section az-section--' . $layout,
    'style' => $style,
    'data-autoplay' => $attrs['autoplay'] && $has_multiple ? 'true' : 'false',
    'data-autoplay-delay' => (string) $autoplay_delay,
]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="testimonials__inner az-section__inner">
        <?php if (trim((string) $attrs['eyebrow']) !== '') : ?>
            <p class="testimonials__eyebrow"><?php echo esc_html($attrs['eyebrow']); ?></p>
        <?php endif; ?>

        <div class="testimonials__viewport">
            <div class="testimonials__track">
                <?php foreach ($items as $index => $item) : ?>
                    <?php $item = wp_parse_args((array) $item, ['quote' => '', 'name' => '', 'company' => '']); ?>
                    <article class="testimonials__slide<?php echo $index === 0 ? ' is-active' : ''; ?>" aria-hidden="<?php echo $index === 0 ? 'false' : 'true'; ?>">
                        <?php if (trim((string) $item['quote']) !== '') : ?>
                            <blockquote class="testimonials__quote"><?php echo wp_kses_post($item['quote']); ?></blockquote>
                        <?php endif; ?>
                        <div class="testimonials__meta">
                            <?php if (trim((string) $item['name']) !== '') : ?>
                                <div class="testimonials__name"><?php echo esc_html($item['name']); ?></div>
                            <?php endif; ?>
                            <?php if (trim((string) $item['company']) !== '') : ?>
                                <div class="testimonials__company"><?php echo esc_html($item['company']); ?></div>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>

        <?php if ($attrs['showArrows'] && $has_multiple) : ?>
            <div class="testimonials__arrows">
                <button class="testimonials__arrow testimonials__arrow--prev" type="button" aria-label="<?php echo esc_attr__('Previous testimonial', 'ai-zippy-child'); ?>"></button>
                <button class="testimonials__arrow testimonials__arrow--next" type="button" aria-label="<?php echo esc_attr__('Next testimonial', 'ai-zippy-child'); ?>"></button>
            </div>
        <?php endif; ?>

        <?php if ($attrs['showDots'] && $has_multiple) : ?>
            <div class="testimonials__dots" aria-label="<?php echo esc_attr__('Choose testimonial', 'ai-zippy-child'); ?>">
                <?php foreach ($items as $index => $item) : ?>
                    <button class="testimonials__dot<?php echo $index === 0 ? ' is-active' : ''; ?>" type="button" aria-label="<?php echo esc_attr(sprintf(__('Show testimonial %d', 'ai-zippy-child'), $index + 1)); ?>" aria-current="<?php echo $index === 0 ? 'true' : 'false'; ?>"></button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
