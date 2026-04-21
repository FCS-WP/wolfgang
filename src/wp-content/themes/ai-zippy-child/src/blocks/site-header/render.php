<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'logoUrl' => '',
    'logoAlt' => '',
    'menuId' => 0,
    'ctaText' => '',
    'ctaUrl' => '',
]);

$menu_items = [];
if (!empty($attrs['menuId'])) {
    $items = wp_get_nav_menu_items(absint($attrs['menuId']));
    $menu_items = is_array($items) ? array_filter($items, static fn($item) => (int) $item->menu_item_parent === 0) : [];
}

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'site-header']);
?>
<header <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="site-header__inner">
        <a class="site-header__brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php if (!empty($attrs['logoUrl'])) : ?>
                <img src="<?php echo esc_url($attrs['logoUrl']); ?>" alt="<?php echo esc_attr($attrs['logoAlt'] ?: get_bloginfo('name')); ?>">
            <?php else : ?>
                <span><?php echo esc_html(get_bloginfo('name')); ?></span>
            <?php endif; ?>
        </a>

        <?php if ($menu_items) : ?>
            <nav class="site-header__nav" aria-label="<?php esc_attr_e('Primary menu', 'ai-zippy-child'); ?>">
                <?php foreach ($menu_items as $item) : ?>
                    <a href="<?php echo esc_url($item->url); ?>"><?php echo esc_html($item->title); ?></a>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>

        <?php if (!empty($attrs['ctaText'])) : ?>
            <a class="site-header__cta" href="<?php echo esc_url($attrs['ctaUrl'] ?: '#'); ?>"><?php echo esc_html($attrs['ctaText']); ?></a>
        <?php endif; ?>
    </div>
</header>
