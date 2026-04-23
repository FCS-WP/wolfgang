<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'full',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 220,
    'paddingRight' => 0,
    'paddingBottom' => 220,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Our Environment',
    'posterUrl' => 'https://static.wixstatic.com/media/46cce8_43afb77607804910840f9fd6b57e1934f000.jpg/v1/fill/w_1280,h_720,al_c,q_85,enc_avif,quality_auto/46cce8_43afb77607804910840f9fd6b57e1934f000.jpg',
    'posterAlt' => '',
    'videoUrl' => 'https://video.wixstatic.com/video/46cce8_43afb77607804910840f9fd6b57e1934/720p/mp4/file.mp4',
    'overlayOpacity' => 20,
    'accentStartColor' => '#0167ff',
    'accentEndColor' => '#c5fda2',
]);
$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'full';
$overlay = min(max(absint($attrs['overlayOpacity']), 0), 80) / 100;
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--our-environment-overlay-opacity' => $overlay,
    '--our-environment-accent-start' => sanitize_hex_color((string) $attrs['accentStartColor']) ?: '#0167ff',
    '--our-environment-accent-end' => sanitize_hex_color((string) $attrs['accentEndColor']) ?: '#c5fda2',
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
$wrapper_attributes = get_block_wrapper_attributes(['class' => 'our-environment az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <?php if (trim((string) $attrs['videoUrl']) !== '') : ?>
        <video class="our-environment__video" src="<?php echo esc_url($attrs['videoUrl']); ?>" poster="<?php echo esc_url($attrs['posterUrl']); ?>" muted loop playsinline autoplay></video>
    <?php elseif (trim((string) $attrs['posterUrl']) !== '') : ?>
        <img class="our-environment__poster" src="<?php echo esc_url($attrs['posterUrl']); ?>" alt="<?php echo esc_attr($attrs['posterAlt']); ?>" loading="lazy" decoding="async">
    <?php endif; ?>
    <div class="our-environment__overlay" aria-hidden="true"></div>
    <div class="our-environment__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?><h2 class="our-environment__heading"><?php echo esc_html($attrs['heading']); ?></h2><?php endif; ?>
    </div>
</section>
