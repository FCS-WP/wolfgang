<?php
defined('ABSPATH') || exit;

$attrs = wp_parse_args($attributes ?? [], [
    'logoUrl' => '',
    'logoAlt' => '',
    'description' => 'Wolfgang Ethos is a local AI-driven creative agency that provides an all-in-one solution for SMEs.',
    'menuId' => 0,
    'fallbackLinks' => [
        ['label' => 'Home', 'url' => '/'],
        ['label' => 'Our Story', 'url' => '/our-story'],
        ['label' => 'Our Services', 'url' => '/our-services'],
        ['label' => 'Our Projects', 'url' => '/our-projects'],
        ['label' => 'Contact Us', 'url' => '/contact-us'],
    ],
    'contactText' => 'T: 65 1234 5678<br>E: care@ethoscreatives.com<br><br>51 Bras Basah Rd,<br>Singapore 189554',
    'copyright' => '© 2025. All rights reserved.',
]);

$menu_items = [];
if (!empty($attrs['menuId'])) {
    $items = wp_get_nav_menu_items(absint($attrs['menuId']));
    $menu_items = is_array($items) ? array_filter($items, static fn($item) => (int) $item->menu_item_parent === 0) : [];
}
$fallback_links = is_array($attrs['fallbackLinks']) ? $attrs['fallbackLinks'] : [];

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
                    <span class="site-footer__logo-text" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
                        <span><?php esc_html_e('Wolfgang', 'ai-zippy-child'); ?></span>
                        <strong><?php esc_html_e('Methos', 'ai-zippy-child'); ?></strong>
                    </span>
                <?php endif; ?>
            </a>
            <?php if (!empty($attrs['description'])) : ?>
                <p class="site-footer__description"><?php echo wp_kses_post($attrs['description']); ?></p>
            <?php endif; ?>
        </div>

        <?php if ($menu_items || $fallback_links) : ?>
            <nav class="site-footer__nav" aria-label="<?php esc_attr_e('Footer menu', 'ai-zippy-child'); ?>">
                <?php if ($menu_items) : ?>
                    <?php foreach ($menu_items as $item) : ?>
                        <a href="<?php echo esc_url($item->url); ?>"><?php echo esc_html($item->title); ?></a>
                    <?php endforeach; ?>
                <?php else : ?>
                    <?php foreach ($fallback_links as $link) : ?>
                        <?php $link = wp_parse_args((array) $link, ['label' => '', 'url' => '#']); ?>
                        <?php if (trim((string) $link['label']) === '') { continue; } ?>
                        <a href="<?php echo esc_url($link['url'] ?: '#'); ?>"><?php echo esc_html($link['label']); ?></a>
                    <?php endforeach; ?>
                <?php endif; ?>
            </nav>
        <?php endif; ?>

        <div class="site-footer__contact">
            <?php if (!empty($attrs['contactText'])) : ?>
                <p><?php echo wp_kses_post($attrs['contactText']); ?></p>
            <?php endif; ?>
            <p class="site-footer__copyright"><?php echo esc_html($copyright); ?></p>
        </div>
    </div>
</footer>
