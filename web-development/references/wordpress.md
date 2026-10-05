# WordPress, WooCommerce, and Elementor

Read when working on a WordPress site, plugin, theme, block, REST route, WP-CLI task, or commerce integration. Security review of WordPress code goes deeper than this file; the implementation habits that prevent most findings are here.

## Orient

```bash
wp core version && php -v
wp plugin list --fields=name,status,version,update
wp theme list --status=active
```

Without WP-CLI, read the plugin header (`Requires at least`, `Requires PHP`), `composer.json`, `theme.json`, and the theme's `templates/` directory (block theme) or `functions.php` (classic). The declared minimum versions are your support floor: do not use newer APIs without a guard or a deliberate floor change. Note multisite, WooCommerce version and HPOS status, the page builder, and caching layers. Read `wp-config.php` constants by name only.

Never edit WordPress core or third-party plugin files; updates overwrite them. Use hooks, filters, a child theme, or a small plugin (a must-use plugin for site-specific code). If patching vendor code is the task, keep a reviewable patch or fork and state what updates will do to it.

## Plugin conventions

- Prefix or namespace every function, class, option key, transient, and hook (`abc_`, `ABC\Plugin\`). Add `defined( 'ABSPATH' ) || exit;` to directly executable files; this stops direct loading and is not authorization.
- Register on the documented hook: `plugins_loaded`, `init`, `rest_api_init`, `admin_menu`, `admin_init`, `wp_enqueue_scripts`, `admin_enqueue_scripts`. Do not do heavy work on `init` for every request.
- Use `register_activation_hook` for setup and `uninstall.php` for cleanup. Keep presentation separate from business logic when it must survive a theme change.
- Use text domains and `__()`, `esc_html__()`, `_n()` for every user-visible string. Follow WordPress Coding Standards with PHPCS, and the PHPCompatibilityWP ruleset for your PHP floor.

## Request controls by entry point

| Entry | Required |
| --- | --- |
| Cookie-authenticated admin form or AJAX action | Action nonce (CSRF) and a capability check (authorization), then validate fields |
| Cookie-authenticated REST mutation | REST authentication (`X-WP-Nonce`) and a `permission_callback` for the resource |
| Application Password or other explicit credential | The supported authentication layer; no UI nonce needed |
| Public form, signup, or webhook | Intentionally public: input limits, abuse control, or provider signature verification |
| `save_post`, cron, CLI | Know the initiating authority; guard autosave, revisions, recursion, and replay |

A nonce mitigates CSRF. It does not authenticate or authorize, does not prove origin, and is not single-use. Always pair a protected action with `current_user_can()`. Use an object-aware meta capability (`edit_post` with a post id) when the policy is per object; site-wide settings use plain capabilities such as `manage_options` with no invented object id.

```php
add_action( 'wp_ajax_abc_save_settings', 'abc_save_settings' );

function abc_save_settings() {
	check_ajax_referer( 'abc_save_settings', 'nonce' );              // CSRF
	if ( ! current_user_can( 'manage_options' ) ) {                    // authorization, independent of the nonce
		wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
	}
	$mode = ( isset( $_POST['mode'] ) && is_string( $_POST['mode'] ) )
		? sanitize_key( wp_unslash( $_POST['mode'] ) )
		: '';
	if ( ! in_array( $mode, array( 'basic', 'advanced' ), true ) ) {   // reject invalid input; do not default it into validity
		wp_send_json_error( array( 'code' => 'invalid_mode' ), 422 );
	}
	update_option( 'abc_mode', $mode );
	wp_send_json_success( array( 'mode' => $mode ) );
}
```

Superglobals: check the type before string functions (an array where a string is expected causes errors), `wp_unslash()` values WordPress slashed, then validate and sanitize for the intended meaning. REST arguments have their own parsing contract; do not blindly unslash them.

## REST API

Register on `rest_api_init` with a `permission_callback` and an argument schema. An intentionally public route says so with `'__return_true'`; a protected route must enforce its policy whatever the method.

```php
add_action( 'rest_api_init', function () {
	register_rest_route( 'abc/v1', '/reports/(?P<id>\d+)', array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => 'abc_get_report',
		'permission_callback' => function ( WP_REST_Request $request ) {
			return current_user_can( 'edit_post', (int) $request['id'] );
		},
		'args'                => array(
			'id' => array(
				'type'              => 'integer',
				'required'          => true,
				'validate_callback' => 'rest_validate_request_arg',
				'sanitize_callback' => 'absint',
			),
		),
	) );
} );

function abc_get_report( WP_REST_Request $request ) {
	$post = get_post( (int) $request['id'] );
	if ( ! $post || 'abc_report' !== $post->post_type ) {
		return new WP_Error( 'abc_not_found', __( 'Report not found.', 'abc' ), array( 'status' => 404 ) );
	}
	return rest_ensure_response( array(                              // permitted fields only
		'id'    => $post->ID,
		'title' => get_the_title( $post ),
	) );
}
```

Return `WP_REST_Response` or `WP_Error` with the right status. A passing capability check does not validate field values or the allowed state transition. Test denied and allowed actors, wrong types, and missing objects.

## SQL and query cost

Prefer the data APIs (`WP_Query`, `get_option`, `get_user_meta`). They do not authorize the caller, and raw SQL is safe when constructed correctly. Prepare every value with `$wpdb->prepare()`; escape `LIKE` terms with `$wpdb->esc_like()` before preparing the wildcard string. Dynamic identifiers cannot be bound as values: map caller input to fixed choices. `%i` (identifier placeholder) exists from WordPress 6.2; use it only when your minimum version is 6.2 or higher, otherwise use a mapping.

```php
global $wpdb;
$table    = $wpdb->prefix . 'abc_orders';
$sortable = array( 'created' => 'created_at', 'amount' => 'amount_cents' );

$orderby_in = ( isset( $_GET['orderby'] ) && is_string( $_GET['orderby'] ) ) ? sanitize_key( wp_unslash( $_GET['orderby'] ) ) : '';
$order_in   = ( isset( $_GET['order'] ) && is_string( $_GET['order'] ) ) ? strtolower( sanitize_key( wp_unslash( $_GET['order'] ) ) ) : '';
$order_by   = $sortable[ $orderby_in ] ?? 'created_at';   // only mapped column names reach the SQL
$direction  = ( 'asc' === $order_in ) ? 'ASC' : 'DESC';
$like       = '%' . $wpdb->esc_like( $search ) . '%';

// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- identifiers come from the fixed map above.
$rows = $wpdb->get_results( $wpdb->prepare(
	"SELECT id, customer_email, amount_cents FROM {$table} WHERE status = %s AND customer_email LIKE %s ORDER BY {$order_by} {$direction} LIMIT %d",
	'paid',
	$like,
	50
) );
```

Bound query work: set `posts_per_page`, avoid `-1` on the front end, set `no_found_rows` when you do not need totals, request `fields => 'ids'` when you only need ids, and disable meta or term cache priming only when callers do not use them. Do not query inside loops. Inspect meta queries on large tables with real data; they are often unindexed.

```php
$query = new WP_Query( array(
	'post_type'              => 'abc_report',
	'post_status'            => 'publish',
	'posts_per_page'         => 20,
	'no_found_rows'          => true,
	'fields'                 => 'ids',
	'update_post_meta_cache' => false,
	'update_post_term_cache' => false,
) );
```

## Output and assets

Escape for the exact context at output time: `esc_html()` for text, `esc_attr()` for attributes, `esc_url()` for URLs, `wp_kses_post()` or a configured allowlist for deliberately allowed HTML. Sanitizing on input is not escaping on output and does not make a value safe for SQL or script.

Pass configuration to scripts with HTML-safe encoding (`JSON_HEX_TAG` stops a literal closing script tag from ending the element):

```php
add_action( 'wp_enqueue_scripts', function () {
	if ( ! is_singular( 'abc_report' ) ) {
		return; // load only where needed
	}
	$asset = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php'; // dependencies and content hash from @wordpress/scripts
	wp_enqueue_script( 'abc-app', plugins_url( 'build/index.js', __FILE__ ), $asset['dependencies'], $asset['version'], array(
		'in_footer' => true,   // the array form needs WordPress 6.3+; pass true for older floors
		'strategy'  => 'defer',
	) );
	$config = array( 'restUrl' => esc_url_raw( rest_url( 'abc/v1/' ) ), 'nonce' => wp_create_nonce( 'wp_rest' ) );
	wp_add_inline_script( 'abc-app', 'window.abcConfig = ' . wp_json_encode( $config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ';', 'before' );
} );
```

A nonce printed into the page is visible to that user; it is a CSRF token, not a secret. Never put server secrets in inline configuration. Use `wp_set_script_translations()` for translated JavaScript strings, build hashes or the release version for cache busting, and `plugins_url()` or `plugin_dir_url()` rather than hard-coded paths.

## Blocks and Elementor

- Block themes use `theme.json` for tokens and `templates/*.html`; blocks use `block.json` and `register_block_type( __DIR__ . '/build/my-block' )`. Dynamic blocks escape inside `render_callback`. Check the installed WordPress version before using the Interactivity API or newer block APIs.
- For Elementor and other builders, use their documented extension APIs and classes you own (for Elementor, `\Elementor\Widget_Base`, registered on `elementor/widgets/register`). Test both the editor and the rendered page when you change shared styles or widgets. Preserve builder-owned data (`_elementor_data`) unless editing it is the task, and regenerate builder CSS after global style changes. Inspect the installed plugin's contracts instead of guessing from an older version.

## WooCommerce

- Use CRUD objects, not post meta: `wc_get_order()`, `$order->get_total()`, `$order->get_meta()`, `$order->update_meta_data()` then `$order->save()`. With High-Performance Order Storage, orders are not posts, so `get_post_meta( $order_id, ... )` returns nothing.
- Declare HPOS compatibility only after testing the plugin against it:

```php
add_action( 'before_woocommerce_init', function () {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );
```

- Classic checkout and Checkout Blocks expose different extension points (hooks versus the Store API). Verify which one the site uses and test it.
- Keep prices, taxes, coupons, and totals authoritative on the server; use WooCommerce's functions and decimal settings rather than PHP float arithmetic.
- Payment callbacks and order transitions can repeat or run concurrently. Verify the signature, the order and provider identity, amount and currency, and that the current order state permits the transition. Deduplicate atomically (check `$order->is_paid()` and the stored transaction id before calling `payment_complete()`), and avoid repeating stock changes, emails, or refunds on replay.
- Customer-facing order access uses ownership (`$order->get_user_id()`) or the guest order key (`$order->key_is_valid( $key )`), not an administrator capability.

## Site operations

- Exclude cart, checkout, account, and other personalized pages from page caches; a client-rendered view still needs an authorized data endpoint.
- WP-Cron runs on page loads. For reliable scheduling, set up a real system cron calling `wp cron event run --due-now` first, then `define( 'DISABLE_WP_CRON', true )`. Guard jobs against overlap and replay.
- Multisite: call `restore_current_blog()` after `switch_to_blog()`, and distinguish network from site options and capabilities.
- Version your schema and option upgrades, make them safe to rerun, and run them once, not on every request.
- Production: `WP_DEBUG_DISPLAY` off, `DISALLOW_FILE_EDIT` on when it fits operations, deploy code instead of editing it on the server.

## WP-CLI recipes

```bash
wp option get siteurl
wp post list --post_type=abc_report --fields=ID,post_status --format=table
wp eval 'echo WC()->version;'                       # run read-only PHP in WordPress context
wp db export before-change.sql                      # back up before destructive work
wp search-replace 'http://old.test' 'https://new.test' --dry-run   # always dry-run first
```

## Verify

Run `php -l` on changed files and PHPCS with the WordPress standard. Run the PHPUnit suite if the project has one. Exercise screens as an administrator, an editor, a subscriber, and signed out; call REST routes with and without authentication or `X-WP-Nonce`; test classic and block checkout and HPOS on and off when commerce is involved. Without a WordPress runtime, label behavior *Not run* and list the exact manual checks.
