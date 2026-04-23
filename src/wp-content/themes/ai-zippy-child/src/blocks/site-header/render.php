<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'logoUrl' => '',
    'logoAlt' => '',
    'logoWidth' => 190,
    'logoHeight' => 52,
    'menuId' => 0,
    'fallbackLinks' => [
        ['label' => 'Home', 'url' => '/'],
        ['label' => 'Our Story', 'url' => '/our-story'],
        ['label' => 'Our Services', 'url' => '/our-services'],
        ['label' => 'Our Projects', 'url' => '/our-projects'],
    ],
    'ctaText' => 'Contact us',
    'ctaUrl' => '/contact-us',
    'paddingTop' => 26,
    'paddingRight' => null,
    'paddingBottom' => 26,
    'paddingLeft' => null,
    'marginTop' => 0,
    'marginBottom' => 0,
    'isSticky' => false,
    'stickyTop' => 0,
    'stickyZIndex' => 900,
]);

$menu_items = [];
if (!empty($attrs['menuId'])) {
    $items = wp_get_nav_menu_items(absint($attrs['menuId']));
    $menu_items = is_array($items) ? array_filter($items, static fn($item) => (int) $item->menu_item_parent === 0) : [];
}
$fallback_links = is_array($attrs['fallbackLinks']) ? $attrs['fallbackLinks'] : [];
$logo_width = max(1, absint($attrs['logoWidth']));
$logo_height = max(1, absint($attrs['logoHeight']));
$logo_style = sprintf('--site-header-logo-width:%1$dpx;--site-header-logo-height:%2$dpx;', $logo_width, $logo_height);
$drawer_id = wp_unique_id('site-header-drawer-');
$current_object_id = get_queried_object_id();
$request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash((string) $_SERVER['REQUEST_URI']) : '/';
$current_path = trim((string) wp_parse_url(home_url($request_uri), PHP_URL_PATH), '/');

$normalize_path = static function ($url): string {
    $path = (string) wp_parse_url($url ?: '/', PHP_URL_PATH);
    return trim($path, '/');
};

$is_current_url = static function ($url) use ($normalize_path, $current_path): bool {
    return $normalize_path($url) === $current_path;
};

$is_current_menu_item = static function ($item) use ($current_object_id, $is_current_url): bool {
    $classes = is_array($item->classes ?? null) ? $item->classes : [];
    $current_classes = ['current-menu-item', 'current_page_item', 'current-menu-ancestor', 'current-menu-parent'];

    if (array_intersect($current_classes, $classes)) {
        return true;
    }

    if ($current_object_id && !empty($item->object_id) && (int) $item->object_id === (int) $current_object_id) {
        return true;
    }

    return $is_current_url($item->url ?? '');
};

$wrapper_style_values = [
    '--site-header-padding-top' => absint($attrs['paddingTop']) . 'px',
    '--site-header-padding-bottom' => absint($attrs['paddingBottom']) . 'px',
    '--site-header-margin-top' => absint($attrs['marginTop']) . 'px',
    '--site-header-margin-bottom' => absint($attrs['marginBottom']) . 'px',
    '--site-header-sticky-top' => absint($attrs['stickyTop']) . 'px',
    '--site-header-sticky-z-index' => absint($attrs['stickyZIndex']),
];

if (isset($attrs['paddingRight']) && $attrs['paddingRight'] !== '') {
    $wrapper_style_values['--site-header-padding-right'] = absint($attrs['paddingRight']) . 'px';
}

if (isset($attrs['paddingLeft']) && $attrs['paddingLeft'] !== '') {
    $wrapper_style_values['--site-header-padding-left'] = absint($attrs['paddingLeft']) . 'px';
}

$wrapper_style = '';
foreach ($wrapper_style_values as $property => $value) {
    $wrapper_style .= sprintf('%s:%s;', $property, esc_attr((string) $value));
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'site-header' . (!empty($attrs['isSticky']) ? ' site-header--sticky' : ''),
    'style' => $wrapper_style,
]);
?>
<header <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="site-header__inner">
        <a class="site-header__brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php if (!empty($attrs['logoUrl'])) : ?>
                <img src="<?php echo esc_url($attrs['logoUrl']); ?>" alt="<?php echo esc_attr($attrs['logoAlt'] ?: get_bloginfo('name')); ?>" style="<?php echo esc_attr($logo_style); ?>">
            <?php else : ?>
                <span class="site-header__logo-text" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
                    <span><?php esc_html_e('Wolfgang', 'ai-zippy-child'); ?></span>
                    <strong><?php esc_html_e('Methos', 'ai-zippy-child'); ?></strong>
                </span>
            <?php endif; ?>
        </a>

        <?php if ($menu_items || $fallback_links) : ?>
            <nav class="site-header__nav" aria-label="<?php esc_attr_e('Primary menu', 'ai-zippy-child'); ?>">
                <?php if ($menu_items) : ?>
                    <?php foreach ($menu_items as $item) : ?>
                        <?php $is_active = $is_current_menu_item($item); ?>
                        <a class="<?php echo $is_active ? 'is-active' : ''; ?>" href="<?php echo esc_url($item->url); ?>" <?php echo $is_active ? 'aria-current="page"' : ''; ?>><?php echo esc_html($item->title); ?></a>
                    <?php endforeach; ?>
                <?php else : ?>
                    <?php foreach ($fallback_links as $link) : ?>
                        <?php $link = wp_parse_args((array) $link, ['label' => '', 'url' => '#']); ?>
                        <?php if (trim((string) $link['label']) === '') { continue; } ?>
                        <?php $is_active = $is_current_url($link['url'] ?: '#'); ?>
                        <a class="<?php echo $is_active ? 'is-active' : ''; ?>" href="<?php echo esc_url($link['url'] ?: '#'); ?>" <?php echo $is_active ? 'aria-current="page"' : ''; ?>><?php echo esc_html($link['label']); ?></a>
                    <?php endforeach; ?>
                <?php endif; ?>
            </nav>
        <?php endif; ?>

        <?php if (!empty($attrs['ctaText'])) : ?>
            <a class="site-header__cta" href="<?php echo esc_url($attrs['ctaUrl'] ?: '#'); ?>"><?php echo esc_html($attrs['ctaText']); ?></a>
        <?php endif; ?>

        <button class="site-header__toggle" type="button" aria-controls="<?php echo esc_attr($drawer_id); ?>" aria-expanded="false">
            <span class="site-header__toggle-line"></span>
            <span class="site-header__toggle-line"></span>
            <span class="site-header__toggle-line"></span>
            <span class="screen-reader-text"><?php esc_html_e('Open menu', 'ai-zippy-child'); ?></span>
        </button>
    </div>

    <div class="site-header__overlay" data-site-header-close></div>
    <div class="site-header__drawer" id="<?php echo esc_attr($drawer_id); ?>" aria-hidden="true">
        <div class="site-header__drawer-top">
            <span class="site-header__drawer-title"><?php esc_html_e('Menu', 'ai-zippy-child'); ?></span>
            <button class="site-header__drawer-close" type="button" data-site-header-close aria-label="<?php esc_attr_e('Close menu', 'ai-zippy-child'); ?>">×</button>
        </div>

        <?php if ($menu_items || $fallback_links) : ?>
            <nav class="site-header__drawer-nav" aria-label="<?php esc_attr_e('Mobile menu', 'ai-zippy-child'); ?>">
                <?php if ($menu_items) : ?>
                    <?php foreach ($menu_items as $item) : ?>
                        <?php $is_active = $is_current_menu_item($item); ?>
                        <a class="<?php echo $is_active ? 'is-active' : ''; ?>" href="<?php echo esc_url($item->url); ?>" <?php echo $is_active ? 'aria-current="page"' : ''; ?>><?php echo esc_html($item->title); ?></a>
                    <?php endforeach; ?>
                <?php else : ?>
                    <?php foreach ($fallback_links as $link) : ?>
                        <?php $link = wp_parse_args((array) $link, ['label' => '', 'url' => '#']); ?>
                        <?php if (trim((string) $link['label']) === '') { continue; } ?>
                        <?php $is_active = $is_current_url($link['url'] ?: '#'); ?>
                        <a class="<?php echo $is_active ? 'is-active' : ''; ?>" href="<?php echo esc_url($link['url'] ?: '#'); ?>" <?php echo $is_active ? 'aria-current="page"' : ''; ?>><?php echo esc_html($link['label']); ?></a>
                    <?php endforeach; ?>
                <?php endif; ?>
            </nav>
        <?php endif; ?>

        <?php if (!empty($attrs['ctaText'])) : ?>
            <a class="site-header__drawer-cta" href="<?php echo esc_url($attrs['ctaUrl'] ?: '#'); ?>"><?php echo esc_html($attrs['ctaText']); ?></a>
        <?php endif; ?>
    </div>
</header>
