# WordPress, WooCommerce, Elementor

Read when working on a WordPress site, plugin, theme, block, REST route, or WooCommerce/Elementor integration.

## Extension rules

- Extend through hooks, filters, the template hierarchy, a child theme, or a focused plugin. Never edit core, and never patch a vendor plugin file in place: the next update erases it and you lose the audit trail.
- One plugin, one responsibility. A site-specific "functionality plugin" is better than dozens of snippets in `functions.php` or a snippets plugin, because it is versionable and reviewable.
- Prefix every global function, class, constant, option, meta key, hook name, and script handle with a project-specific prefix. Collisions in the global namespace are the most common WordPress bug.
- Guard direct file access at the top of every PHP file:

```php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
```

- Load code on the right hook: `plugins_loaded` for bootstrapping, `init` for post types, taxonomies and text domains, `wp_enqueue_scripts` for assets, `admin_init` for admin-only work. Work performed at file load runs on every request, including AJAX and cron.

## The four gates on every request that changes something

Forms, `admin_post_*`, `wp_ajax_*`, REST mutations, and block editor saves all pass the same four gates, in this order:

```php
// 1. CSRF: prove the request came from your UI
check_admin_referer( 'prefix_save_thing' );            // or wp_verify_nonce(), or check_ajax_referer()

// 2. Authorization: prove this user may do this, to this object
if ( ! current_user_can( 'edit_post', $post_id ) ) {
	wp_die( esc_html__( 'Not allowed.', 'text-domain' ), '', array( 'response' => 403 ) );
}

// 3. Validation and sanitization: coerce input to a known-safe shape
$title  = sanitize_text_field( wp_unslash( $_POST['title'] ?? '' ) );
$status = in_array( $_POST['status'] ?? '', array( 'draft', 'publish' ), true ) ? $_POST['status'] : 'draft';

// 4. Escaping at output, in the right context
echo esc_html( $title );
```

A nonce is **not** a permission check. `current_user_can()` without an object ID is not an ownership check. Both are required.

## REST API

```php
register_rest_route(
	'prefix/v1',
	'/things/(?P<id>\d+)',
	array(
		'methods'             => WP_REST_Server::EDITABLE,
		'callback'            => 'prefix_update_thing',
		'permission_callback' => function ( WP_REST_Request $request ) {
			return current_user_can( 'edit_post', (int) $request['id'] );
		},
		'args'                => array(
			'id'    => array( 'required' => true, 'type' => 'integer', 'sanitize_callback' => 'absint' ),
			'title' => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
		),
	)
);
```

- `permission_callback` is mandatory. Returning `true` is a public endpoint; write it only when that is the intent.
- Define `args` with types and sanitize callbacks so validation is declarative and documented.
- Return `WP_Error` with a proper status code rather than an ad-hoc array with `success => false`.

## Database access

- Use the WordPress data APIs (`WP_Query`, `get_posts`, `wp_insert_post`, `update_post_meta`, `WP_User_Query`) before dropping to SQL. They handle caching, hooks, and escaping.
- When raw SQL is unavoidable, always prepare:

```php
$rows = $wpdb->get_results(
	$wpdb->prepare( "SELECT id, name FROM {$wpdb->prefix}custom WHERE status = %s AND created > %d", $status, $since )
);
```

- `prepare()` cannot placeholder table or column names. Whitelist dynamic identifiers against a fixed array; never interpolate user input into them.
- Never run an unbounded `meta_query` on a large site. Meta is not indexed for value lookups. If you filter by it constantly, use a taxonomy or a custom table.
- Set `'no_found_rows' => true` when you do not paginate, `'update_post_meta_cache' => false` and `'update_post_term_cache' => false` when you do not need them, and `'fields' => 'ids'` when you only need IDs.
- `posts_per_page => -1` is a production outage waiting for the content to grow. Always cap it.

## Assets

```php
add_action( 'wp_enqueue_scripts', function () {
	if ( ! is_singular( 'product' ) ) {
		return; // load only where it is needed
	}
	$path = plugin_dir_path( __FILE__ ) . 'assets/app.js';
	wp_enqueue_script(
		'prefix-app',
		plugins_url( 'assets/app.js', __FILE__ ),
		array(),
		file_exists( $path ) ? (string) filemtime( $path ) : '1.0.0',
		true
	);
	wp_localize_script( 'prefix-app', 'prefixData', array(
		'restUrl' => esc_url_raw( rest_url( 'prefix/v1/' ) ),
		'nonce'   => wp_create_nonce( 'wp_rest' ),
	) );
} );
```

- Version assets by file modification time so caches and CDNs invalidate on deploy.
- Never hardcode a URL; use `plugins_url()`, `get_stylesheet_directory_uri()`, or `rest_url()`.
- Declare real dependencies instead of relying on load order.

## WooCommerce

- Use the CRUD API (`wc_get_order`, `$order->get_total()`, `$order->save()`, `wc_get_product`) rather than reading post meta directly. Direct meta access breaks under High-Performance Order Storage.
- Declare HPOS compatibility explicitly in the plugin bootstrap, and test with it enabled.
- Never recalculate prices, totals, or tax by hand in the frontend. Use the cart and order APIs so coupons, tax, and currency rules stay correct.
- Payment gateway and webhook handlers must be idempotent: the same notification will arrive twice. Key on the transaction ID and the order state machine.
- Order status transitions have side effects (stock, emails, accounting). Hook the specific transition, not a generic save.
- Never expose order or customer data in a public REST route or an AJAX endpoint without a capability plus ownership check.

## Elementor and page builders

- Builder output is generated markup. Do not target its internal class names with brittle selectors; the next version will rename them. Add your own class or a wrapper you control.
- Register a custom widget rather than pasting HTML into a text widget when the content has logic, data, or state.
- Keep custom CSS scoped and specific enough not to leak into the editor UI. Test inside the editor as well as on the frontend.
- Anything the editor owns, the editor will overwrite. Store your data in post meta or options you control, not in builder-managed structures.
- Assume the builder already loads a large amount of CSS and JS. Do not add another framework on top; measure the page weight before and after.

## Site environment concerns

- **Caching:** page caching, object caching, and a CDN can all serve stale or wrong output. Anything user-specific must be excluded from full-page cache or rendered client-side. Invalidate deliberately on write.
- **Cron:** `wp_cron` runs on traffic, not on time. For anything reliable, disable it and drive a real system cron. Schedule with a unique hook, guard against overlap, and make the job idempotent.
- **Multisite:** switch and restore blog context correctly, and remember that options, uploads, and users are scoped differently per network configuration.
- **Localization:** load the text domain on `init`, wrap every user-facing string, and use the escaping variants (`esc_html__`, `esc_attr_e`) rather than escaping a translated string afterwards.
- **Upgrades:** run schema or option changes through a versioned upgrade routine keyed to a stored version option, so it executes once and can be re-run deterministically.

## WordPress anti-patterns

| Anti-pattern | Replace with |
| --- | --- |
| Editing a plugin or core file directly | Hook, filter, child theme, or a custom plugin |
| `$_POST['x']` used without `wp_unslash()` and sanitization | Unslash, sanitize by type, validate against a whitelist |
| `echo $value` in a template | `esc_html()`, `esc_attr()`, `esc_url()`, or `wp_kses_post()` by context |
| `permission_callback => '__return_true'` on a mutation | A real capability plus ownership check |
| `posts_per_page => -1` | A capped page size with pagination |
| Business logic in `functions.php` | A versioned, testable plugin |
| Inline `<style>` and `<script>` in templates | Enqueued, versioned, conditionally loaded assets |
| Reading order data from post meta | WooCommerce CRUD getters |
