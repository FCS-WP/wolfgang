<?php
defined('ABSPATH') || exit;

$defaults = [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 70,
    'paddingRight' => 0,
    'paddingBottom' => 90,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Our Journey',
    'accentStartColor' => '#0167ff',
    'accentEndColor' => '#c5fda2',
    'cardWidth' => 820,
    'cardGap' => 380,
    'items' => [
        ['imageId' => 0, 'imageUrl' => '', 'imageAlt' => '', 'year' => '2009', 'title' => 'EPOS is born', 'description' => "Started as a point-of-sale solutions provider helping businesses streamline operations, we've grown from a small POS startup into the beginning of something bigger."],
        ['imageId' => 0, 'imageUrl' => '', 'imageAlt' => '', 'year' => '2022', 'title' => 'Welcoming Wolfgang', 'description' => 'EPOS acquired Wolfgang Ethos and Zippy, adding creative, marketing, and WhatsApp marketing services to its connected all-in-one solutions.'],
    ],
];
$attrs = wp_parse_args($attributes ?? [], $defaults);
$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$items = is_array($attrs['items']) && $attrs['items'] ? $attrs['items'] : $defaults['items'];
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--our-journey-accent-start' => sanitize_hex_color((string) $attrs['accentStartColor']) ?: '#0167ff',
    '--our-journey-accent-end' => sanitize_hex_color((string) $attrs['accentEndColor']) ?: '#c5fda2',
    '--our-journey-card-width' => min(max(absint($attrs['cardWidth']), 420), 980) . 'px',
    '--our-journey-card-gap' => min(max(absint($attrs['cardGap']), 80), 520) . 'px',
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
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'our-journey az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="our-journey__sticky">
        <div class="our-journey__inner az-section__inner">
            <?php if (trim((string) $attrs['heading']) !== '') : ?><h2 class="our-journey__heading"><?php echo esc_html($attrs['heading']); ?></h2><?php endif; ?>
            <div class="our-journey__viewport">
                <div class="our-journey__track">
                    <?php foreach ($items as $item) : $item = wp_parse_args((array) $item, ['imageUrl' => '', 'imageAlt' => '', 'year' => '', 'title' => '', 'description' => '']); ?>
                        <article class="our-journey__item">
                            <div class="our-journey__media">
                                <?php if (trim((string) $item['imageUrl']) !== '') : ?>
                                    <img src="<?php echo esc_url($item['imageUrl']); ?>" alt="<?php echo esc_attr($item['imageAlt']); ?>" loading="lazy" decoding="async">
                                <?php else : ?>
                                    <div class="our-journey__placeholder"><?php esc_html_e('Upload image', 'ai-zippy-child'); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="our-journey__content">
                                <?php if (trim((string) $item['title']) !== '' || trim((string) $item['year']) !== '') : ?>
                                    <h3 class="our-journey__title">
                                        <?php if (trim((string) $item['year']) !== '') : ?><span><?php echo esc_html($item['year']); ?> | </span><?php endif; ?>
                                        <?php echo esc_html($item['title']); ?>
                                    </h3>
                                <?php endif; ?>
                                <?php if (trim((string) $item['description']) !== '') : ?><p class="our-journey__description"><?php echo wp_kses_post($item['description']); ?></p><?php endif; ?>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
                <div class="our-journey__line" aria-hidden="true"></div>
            </div>
        </div>
    </div>
</section>
