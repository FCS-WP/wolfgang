<?php
defined('ABSPATH') || exit;

/**
 * Add project-specific child block categories.
 */
function ai_zippy_child_block_categories(array $categories): array
{
    $custom_categories = [
        [
            'slug'  => 'ai-zippy-site',
            'title' => __('AI Zippy - Site', 'ai-zippy-child'),
            'icon'  => 'admin-site',
        ],
        [
            'slug'  => 'ai-zippy-page',
            'title' => __('AI Zippy - Pages', 'ai-zippy-child'),
            'icon'  => 'layout',
        ],
    ];

    $existing_slugs = wp_list_pluck($categories, 'slug');
    foreach (array_reverse($custom_categories) as $category) {
        if (!in_array($category['slug'], $existing_slugs, true)) {
            array_unshift($categories, $category);
        }
    }

    return $categories;
}
add_filter('block_categories_all', 'ai_zippy_child_block_categories', 20);
