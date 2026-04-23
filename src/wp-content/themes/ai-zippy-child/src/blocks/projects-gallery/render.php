<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'layout' => 'boxed',
    'backgroundColor' => '#000000',
    'textColor' => '#ffffff',
    'paddingTop' => 72,
    'paddingRight' => 0,
    'paddingBottom' => 110,
    'paddingLeft' => 0,
    'marginTop' => 0,
    'marginBottom' => 0,
    'heading' => 'Our Projects',
    'tabs' => [
        ['label' => 'Videos', 'items' => []],
        ['label' => 'Graphic Ads', 'items' => []],
    ],
    'columns' => 4,
    'gap' => 20,
    'itemRadius' => 0,
]);

$layout = in_array($attrs['layout'], ['boxed', 'wide', 'full'], true) ? $attrs['layout'] : 'boxed';
$tabs = is_array($attrs['tabs']) && $attrs['tabs'] ? $attrs['tabs'] : [['label' => 'Videos', 'items' => []]];
$columns = min(max(absint($attrs['columns']), 2), 5);
$gap = min(max(absint($attrs['gap']), 8), 44);
$radius = min(max(absint($attrs['itemRadius']), 0), 28);
$block_id = 'projects-gallery-' . wp_unique_id();

$style_values = [
    '--az-section-bg' => $attrs['backgroundColor'] ?: '#000000',
    '--az-section-color' => $attrs['textColor'] ?: '#ffffff',
    '--az-section-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--az-section-padding-right' => absint($attrs['paddingRight']) . 'px',
    '--az-section-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--az-section-padding-left' => absint($attrs['paddingLeft']) . 'px',
    '--az-section-margin-top' => absint($attrs['marginTop']) . 'px',
    '--az-section-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--projects-gallery-columns' => $columns,
    '--projects-gallery-gap' => $gap . 'px',
    '--projects-gallery-radius' => $radius . 'px',
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

$wrapper_attributes = get_block_wrapper_attributes([
    'id' => $block_id,
    'class' => 'projects-gallery az-section az-section--' . $layout,
    'style' => $style,
]);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="projects-gallery__inner az-section__inner">
        <?php if (trim((string) $attrs['heading']) !== '') : ?>
            <h2 class="projects-gallery__heading"><?php echo esc_html($attrs['heading']); ?></h2>
        <?php endif; ?>

        <div class="projects-gallery__tabs" role="tablist" aria-label="<?php esc_attr_e('Project categories', 'ai-zippy-child'); ?>">
            <?php foreach ($tabs as $tab_index => $tab) : $tab = wp_parse_args((array) $tab, ['label' => '', 'items' => []]); ?>
                <button
                    class="projects-gallery__tab<?php echo $tab_index === 0 ? ' is-active' : ''; ?>"
                    type="button"
                    role="tab"
                    aria-selected="<?php echo $tab_index === 0 ? 'true' : 'false'; ?>"
                    aria-controls="<?php echo esc_attr($block_id . '-panel-' . $tab_index); ?>"
                    data-projects-tab="<?php echo esc_attr((string) $tab_index); ?>"
                >
                    <?php echo esc_html($tab['label'] ?: sprintf(__('Tab %d', 'ai-zippy-child'), $tab_index + 1)); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <?php foreach ($tabs as $tab_index => $tab) : $tab = wp_parse_args((array) $tab, ['label' => '', 'items' => []]); $items = is_array($tab['items']) ? $tab['items'] : []; ?>
            <div
                class="projects-gallery__panel<?php echo $tab_index === 0 ? ' is-active' : ''; ?>"
                id="<?php echo esc_attr($block_id . '-panel-' . $tab_index); ?>"
                role="tabpanel"
                data-projects-panel="<?php echo esc_attr((string) $tab_index); ?>"
                <?php echo $tab_index === 0 ? '' : 'hidden'; ?>
            >
                <div class="projects-gallery__grid">
                    <?php if ($items) : foreach ($items as $item) : $item = wp_parse_args((array) $item, ['type' => 'image', 'url' => '', 'alt' => '', 'title' => '']); ?>
                        <?php if (trim((string) $item['url']) === '') { continue; } ?>
                        <?php $type = $item['type'] === 'video' ? 'video' : 'image'; ?>
                        <button
                            class="projects-gallery__item projects-gallery__item--<?php echo esc_attr($type); ?>"
                            type="button"
                            data-projects-media-type="<?php echo esc_attr($type); ?>"
                            data-projects-media-url="<?php echo esc_url($item['url']); ?>"
                            data-projects-media-alt="<?php echo esc_attr($item['alt']); ?>"
                        >
                            <?php if ($type === 'video') : ?>
                                <video src="<?php echo esc_url($item['url']); ?>" muted playsinline preload="metadata"></video>
                                <span class="projects-gallery__play" aria-hidden="true"></span>
                            <?php else : ?>
                                <img src="<?php echo esc_url($item['url']); ?>" alt="<?php echo esc_attr($item['alt']); ?>" loading="lazy" decoding="async">
                            <?php endif; ?>
                        </button>
                    <?php endforeach; else : ?>
                        <div class="projects-gallery__empty"><?php esc_html_e('Add project media to this tab.', 'ai-zippy-child'); ?></div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>
