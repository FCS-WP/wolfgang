<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'logoUrl' => '',
    'logoAlt' => '',
    'description' => '',
    'menuId' => 0,
    'copyright' => '',
]);

$menu_items = [];
if (!empty($attrs['menuId'])) {
    $items = wp_get_nav_menu_items(absint($attrs['menuId']));
    $menu_items = is_array($items) ? array_filter($items, static fn($item) => (int) $item->menu_item_parent === 0) : [];
}

$copyright = trim((string) $attrs['copyright']);
if ($copyright === '') {
    $copyright = sprintf('© %s %s', date_i18n('Y'), get_bloginfo('name'));
}

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'site-footer']);
?>
<footer <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
    <div class="site-footer__inner">
        <div class="site-footer__brand">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <?php if (!empty($attrs['logoUrl'])) : ?>
                    <img src="<?php echo esc_url($attrs['logoUrl']); ?>" alt="<?php echo esc_attr($attrs['logoAlt'] ?: get_bloginfo('name')); ?>">
                <?php else : ?>
                    <span><?php echo esc_html(get_bloginfo('name')); ?></span>
                <?php endif; ?>
            </a>
            <?php if (!empty($attrs['description'])) : ?>
                <p><?php echo wp_kses_post($attrs['description']); ?></p>
            <?php endif; ?>
        </div>

        <?php if ($menu_items) : ?>
            <nav class="site-footer__nav" aria-label="<?php esc_attr_e('Footer menu', 'ai-zippy-child'); ?>">
                <?php foreach ($menu_items as $item) : ?>
                    <a href="<?php echo esc_url($item->url); ?>"><?php echo esc_html($item->title); ?></a>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>
    </div>
    <p class="site-footer__copyright"><?php echo esc_html($copyright); ?></p>
</footer>
