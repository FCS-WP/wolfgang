<?php
defined('ABSPATH') || exit;

$default_stats = [
    ['value' => '8+ years', 'label' => 'of experience as PSG pre-approved vendor'],
    ['value' => '30M', 'label' => 'Amount of grants applied and approved'],
];

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 80,
    'paddingRight' => 0,
    'paddingBottom' => 110,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Up to 50% Productivity Solutions Grant (PSG) Support',
    'description' => 'Eligible businesses can claim up to 50% support through PSG, with potential for further funding via other schemes. Discover which grants you qualify for and how to get started today.',
    'imageUrl' => '',
    'imageAlt' => '',
    'featureHeading' => 'Trusted Government Grants Vendor in Singapore',
    'stats' => $default_stats,
    'badgeImageUrl' => '',
    'badgeImageAlt' => '',
    'body' => 'SMEs are eligible for up to 50% Productivity Solutions Grant (PSG) support for the adoption of EPOS Pre-Approved Solutions under the IMDA SMEs Go Digital programme.',
    'imageRadius' => 8,
    'contentGap' => 56,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$stats = is_array($attrs['stats']) && $attrs['stats'] ? $attrs['stats'] : $default_stats;
$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--service-psg-image-radius' => min(max(absint($attrs['imageRadius']), 0), 32) . 'px',
    '--service-psg-content-gap' => min(max(absint($attrs['contentGap']), 28), 110) . 'px',
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

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'service-psg-support az-section az-section--' . $layout, 'style' => $style]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="service-psg-support__inner az-section__inner">
        <div class="service-psg-support__header">
            <?php if (trim((string) $attrs['heading']) !== '') : ?><h2 class="service-psg-support__heading"><?php echo esc_html($attrs['heading']); ?></h2><?php endif; ?>
            <?php if (trim((string) $attrs['description']) !== '') : ?><p class="service-psg-support__description"><?php echo esc_html($attrs['description']); ?></p><?php endif; ?>
        </div>
        <div class="service-psg-support__content">
            <div class="service-psg-support__media">
                <?php if (trim((string) $attrs['imageUrl']) !== '') : ?>
                    <img src="<?php echo esc_url($attrs['imageUrl']); ?>" alt="<?php echo esc_attr($attrs['imageAlt']); ?>" loading="lazy" decoding="async">
                <?php endif; ?>
            </div>
            <div class="service-psg-support__copy">
                <?php if (trim((string) $attrs['featureHeading']) !== '') : ?><h3 class="service-psg-support__feature-heading"><?php echo esc_html($attrs['featureHeading']); ?></h3><?php endif; ?>
                <div class="service-psg-support__stats">
                    <?php foreach ($stats as $stat) : $stat = wp_parse_args((array) $stat, ['value' => '', 'label' => '']); ?>
                        <div class="service-psg-support__stat">
                            <?php if (trim((string) $stat['value']) !== '') : ?><strong class="service-psg-support__stat-value"><?php echo esc_html($stat['value']); ?></strong><?php endif; ?>
                            <?php if (trim((string) $stat['label']) !== '') : ?><span class="service-psg-support__stat-label"><?php echo esc_html($stat['label']); ?></span><?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
                <?php if (trim((string) $attrs['badgeImageUrl']) !== '') : ?>
                    <img class="service-psg-support__badge" src="<?php echo esc_url($attrs['badgeImageUrl']); ?>" alt="<?php echo esc_attr($attrs['badgeImageAlt']); ?>" loading="lazy" decoding="async">
                <?php endif; ?>
                <?php if (trim((string) $attrs['body']) !== '') : ?><p class="service-psg-support__body"><?php echo esc_html($attrs['body']); ?></p><?php endif; ?>
            </div>
        </div>
    </div>
</section>
