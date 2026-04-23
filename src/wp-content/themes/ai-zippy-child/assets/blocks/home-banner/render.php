<?php
defined('ABSPATH') || exit;

$default_slide = [
    'imageId' => 0,
    'imageUrl' => '',
    'imageAlt' => '',
    'eyebrow' => '',
    'title' => "We're the Best<br>SME Agency",
    'subtitle' => '500 happy clients served',
    'contentHtml' => "<h1>We're the Best<br>SME Agency</h1><p>500 happy clients served</p>",
    'buttonLabel' => 'Contact us',
    'buttonUrl' => '/contact-us',
    'buttonNewTab' => false,
    'buttonBackgroundColor' => '#c8ff9a',
    'buttonTextColor' => '#000000',
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'full',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 0,
    'paddingRight' => 0,
    'paddingBottom' => 0,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'paddingTopTablet' => null,
    'paddingRightTablet' => null,
    'paddingBottomTablet' => null,
    'paddingLeftTablet' => null,
    'marginTopTablet' => null,
    'marginBottomTablet' => null,
    'paddingTopMobile' => null,
    'paddingRightMobile' => null,
    'paddingBottomMobile' => null,
    'paddingLeftMobile' => null,
    'marginTopMobile' => null,
    'marginBottomMobile' => null,
    'slides' => [$default_slide],
    'height' => 650,
    'contentWidth' => 980,
    'showOverlay' => false,
    'overlayOpacity' => 44,
    'autoplay' => true,
    'autoplayDelay' => 6000,
    'showArrows' => true,
    'showDots' => true,
    'containerWidth' => 1180,
    'contentPaddingTop' => 90,
    'contentPaddingRight' => 96,
    'contentPaddingBottom' => 90,
    'contentPaddingLeft' => 96,
    'contentPaddingTopTablet' => null,
    'contentPaddingRightTablet' => null,
    'contentPaddingBottomTablet' => null,
    'contentPaddingLeftTablet' => null,
    'contentPaddingTopMobile' => null,
    'contentPaddingRightMobile' => null,
    'contentPaddingBottomMobile' => null,
    'contentPaddingLeftMobile' => null,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'full';
$slides = is_array($attrs['slides']) && $attrs['slides'] ? $attrs['slides'] : [$default_slide];
$height = min(max(absint($attrs['height']), 420), 900);
$container_width = min(max(absint($attrs['containerWidth']), 960), 1800);
$content_width = min(max(absint($attrs['contentWidth']), 520), 1320);
$overlay_opacity = !empty($attrs['showOverlay']) ? min(max(absint($attrs['overlayOpacity']), 0), 80) / 100 : 0;
$autoplay_delay = min(max(absint($attrs['autoplayDelay']), 2500), 12000);

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--home-banner-height' => $height . 'px',
    '--home-banner-container-width' => $container_width . 'px',
    '--home-banner-content-width' => $content_width . 'px',
    '--home-banner-content-padding-top' => absint($attrs['contentPaddingTop']) . 'px',
    '--home-banner-content-padding-right' => absint($attrs['contentPaddingRight']) . 'px',
    '--home-banner-content-padding-bottom' => absint($attrs['contentPaddingBottom']) . 'px',
    '--home-banner-content-padding-left' => absint($attrs['contentPaddingLeft']) . 'px',
    '--home-banner-overlay-opacity' => (string) $overlay_opacity,
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

foreach ([
    'contentPaddingTopTablet' => '--home-banner-content-padding-top-tablet',
    'contentPaddingRightTablet' => '--home-banner-content-padding-right-tablet',
    'contentPaddingBottomTablet' => '--home-banner-content-padding-bottom-tablet',
    'contentPaddingLeftTablet' => '--home-banner-content-padding-left-tablet',
    'contentPaddingTopMobile' => '--home-banner-content-padding-top-mobile',
    'contentPaddingRightMobile' => '--home-banner-content-padding-right-mobile',
    'contentPaddingBottomMobile' => '--home-banner-content-padding-bottom-mobile',
    'contentPaddingLeftMobile' => '--home-banner-content-padding-left-mobile',
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
    'class' => 'home-banner ' . (!empty($attrs['showOverlay']) ? 'home-banner--has-overlay' : 'home-banner--no-overlay') . ' az-section az-section--' . $layout,
    'style' => $style,
]);
?>
<section
    <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
    data-autoplay="<?php echo !empty($attrs['autoplay']) ? 'true' : 'false'; ?>"
    data-autoplay-delay="<?php echo esc_attr((string) $autoplay_delay); ?>"
>
    <div class="home-banner__slides">
        <?php foreach ($slides as $index => $slide) : ?>
            <?php
            $slide = wp_parse_args((array) $slide, $default_slide);
            $image_url = trim((string) $slide['imageUrl']);
            $slide_style = $image_url !== '' ? sprintf('background-image:url(%s);', esc_url($image_url)) : '';
            $button_url = trim((string) $slide['buttonUrl']);
            $button_label = trim((string) $slide['buttonLabel']);
            $content_html = trim((string) $slide['contentHtml']);
            if ($content_html === '' && (trim((string) $slide['title']) !== '' || trim((string) $slide['subtitle']) !== '')) {
                $content_html = sprintf(
                    '%1$s%2$s',
                    trim((string) $slide['title']) !== '' ? '<h1>' . $slide['title'] . '</h1>' : '',
                    trim((string) $slide['subtitle']) !== '' ? '<p>' . esc_html($slide['subtitle']) . '</p>' : ''
                );
            }
            $button_style = '';
            $button_background_color = sanitize_hex_color((string) $slide['buttonBackgroundColor']);
            $button_text_color = sanitize_hex_color((string) $slide['buttonTextColor']);
            if ($button_background_color) {
                $button_style .= '--home-banner-button-bg:' . esc_attr($button_background_color) . ';';
            }
            if ($button_text_color) {
                $button_style .= '--home-banner-button-color:' . esc_attr($button_text_color) . ';';
            }
            ?>
            <div class="home-banner__slide<?php echo $index === 0 ? ' is-active' : ''; ?>" style="<?php echo esc_attr($slide_style); ?>">
                <div class="home-banner__overlay" aria-hidden="true"></div>
                <div class="home-banner__inner az-section__inner">
                    <div class="home-banner__content">
                        <?php if (trim((string) $slide['eyebrow']) !== '') : ?>
                            <p class="home-banner__eyebrow"><?php echo esc_html($slide['eyebrow']); ?></p>
                        <?php endif; ?>
                        <?php if ($content_html !== '') : ?>
                            <div class="home-banner__copy"><?php echo wp_kses_post($content_html); ?></div>
                        <?php endif; ?>
                        <?php if ($button_label !== '') : ?>
                            <?php if ($button_url !== '') : ?>
                                <a
                                    class="home-banner__button az-button az-button--medium"
                                    href="<?php echo esc_url($button_url); ?>"
                                    style="<?php echo esc_attr($button_style); ?>"
                                    <?php echo !empty($slide['buttonNewTab']) ? 'target="_blank" rel="noopener noreferrer"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                                >
                                    <?php echo esc_html($button_label); ?>
                                </a>
                            <?php else : ?>
                                <span class="home-banner__button az-button az-button--medium" style="<?php echo esc_attr($button_style); ?>"><?php echo esc_html($button_label); ?></span>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <?php if (!empty($attrs['showArrows']) && count($slides) > 1) : ?>
        <button class="home-banner__arrow home-banner__arrow--prev" type="button" aria-label="<?php esc_attr_e('Previous slide', 'ai-zippy-child'); ?>">
            <span aria-hidden="true"></span>
        </button>
        <button class="home-banner__arrow home-banner__arrow--next" type="button" aria-label="<?php esc_attr_e('Next slide', 'ai-zippy-child'); ?>">
            <span aria-hidden="true"></span>
        </button>
    <?php endif; ?>

    <?php if (!empty($attrs['showDots']) && count($slides) > 1) : ?>
        <div class="home-banner__dots" role="tablist" aria-label="<?php esc_attr_e('Banner slides', 'ai-zippy-child'); ?>">
            <?php foreach ($slides as $index => $_slide) : ?>
                <button class="home-banner__dot<?php echo $index === 0 ? ' is-active' : ''; ?>" type="button" data-slide="<?php echo esc_attr((string) $index); ?>" aria-label="<?php echo esc_attr(sprintf(__('Go to slide %d', 'ai-zippy-child'), $index + 1)); ?>"></button>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>
