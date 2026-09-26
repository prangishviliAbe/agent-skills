# WordPress, WooCommerce, and Elementor

Read for a site, plugin, theme, block, REST route or commerce integration. Inspect WordPress/PHP versions, plugin dependencies, theme type, multisite state and relevant storage features first.

## Extension boundaries

Use supported hooks, filters, templates, child themes or a focused plugin. Avoid untracked vendor/core edits that updates will overwrite; if vendor code itself is the requested repair target, maintain a reviewable patch or fork and state the update implications.

Namespace or prefix global symbols and persistent keys. Use the lifecycle hook documented for the API; do not assume all registration and translation work belongs on one hook across WordPress versions. Keep business behavior separate from presentation when it should survive a theme change.

Protect directly executable entry files when necessary, but do not mistake an ABSPATH guard for endpoint authorization. Follow project coding standards and supported PHP syntax rather than introducing a modern feature the host cannot run.

## Request controls

Select controls by authentication mode and operation; there is no universal sequence of four function calls.

| Entry | Required reasoning |
| --- | --- |
| Cookie-authenticated admin form or AJAX mutation | Verify the appropriate action nonce and capability; validate the target and permitted fields |
| Cookie-authenticated REST mutation | Use REST authentication/nonces and a permission_callback appropriate to the resource |
| Application Password or other explicit credential flow | Validate through its supported authentication mechanism; assess CSRF based on ambient credentials |
| Public form, signup or webhook | Preserve intentional public access; apply input limits, abuse controls or provider signature verification as appropriate |
| Save hook, cron or CLI | Identify its initiating authority and guard autosave, revision, recursion or replay where relevant |

A WordPress nonce helps mitigate CSRF. It does not prove origin, authorize an actor, guarantee a single use or stop replay. Pair protected work with capability/resource checks. Meta capabilities such as edit_post take an object ID; capabilities for site-wide settings need no invented ownership ID.

For superglobals, reject the wrong type before calling string functions, unslash where WordPress added slashes, then validate and sanitize for the intended value. Do not silently turn invalid security-sensitive input into a valid default. REST request values have their own parsing contract; do not blindly unslash every input source.

Escape when rendering for the exact context: HTML text, attribute, URL or deliberately allowed HTML. Sanitization is not authorization and does not make a value universally safe for SQL or script output.

## REST API

Register on rest_api_init. Supply a permission_callback, argument schema and validation suitable for the route. An intentionally public route may use __return_true; a protected mutation must enforce its policy regardless of the method name.

Use WP_REST_Response or WP_Error with suitable status codes. Return only permitted fields. Verify denied and allowed actors, invalid types, missing objects and alternate entry points. A successful capability check does not itself validate the field values or permitted state transition.

## SQL and query cost

Prefer documented data APIs where they fit. They do not automatically authorize callers; raw SQL is not automatically unsafe if constructed correctly.

Parameterize values with wpdb::prepare. WordPress 6.2+ supports %i for identifiers; check the plugin's minimum version or identifier_placeholders capability before relying on it. On older versions, use fixed identifiers or a strict mapping. Identifier escaping still does not authorize which column/table a caller may select; allowlist dynamic choices. For LIKE, apply esc_like to the search value before preparing the full wildcard value.

Bound growing queries and inspect expensive meta queries with representative data. Set no_found_rows when total counts are unnecessary and disable meta/term priming only when callers do not need it. Large exports may need batched queries; a blanket ban on every loop obscures that use case.

## Assets and editor behavior

Enqueue with real dependencies and load only on relevant surfaces. Use build hashes or a release version for reliable cache invalidation; filemtime is useful when deployment timestamps are reliable. Use supported URL helpers. Keep server secrets out of inline configuration; a browser nonce is visible to the user and must not be treated as a secret capability.

Use script translation/localization APIs for translated strings and an appropriate JSON/inline-data mechanism for configuration. Verify safely serialized values cannot break out of their HTML/script context.

For Elementor and other builders, use documented extension APIs and classes you control. Test both editor and rendered output when changing shared styles or widgets. Preserve builder-owned data unless editing that structure is explicitly part of the task. Inspect the installed plugin's registration contracts instead of guessing from an older version.

## WooCommerce

Use order/product CRUD and documented getters/setters rather than assuming orders are posts. Check HPOS and legacy-storage compatibility where supported, and declare compatibility only after meaningful validation. Checkout Blocks and classic checkout may expose different extension paths; verify the one the site uses.

Keep pricing, tax, coupons and totals authoritative on the server. Do not apply PHP-specific storage assumptions to currency calculations without checking the relevant WooCommerce API.

Payment callbacks and order transitions may repeat or arrive concurrently. Verify signatures, order/provider identity, amount/currency and permissible state; deduplicate atomically. Avoid repeating stock updates, notifications or refunds when replaying an event. Customer-facing order access can use ownership or the platform's supported guest-order mechanism; do not replace it with an admin-only capability check.

## Site operations

- Exclude or correctly partition personalized pages from shared caches; client rendering still requires an authorized data endpoint.
- WP-Cron depends on traffic by default. If reliable scheduling is required, configure and verify an external trigger before disabling page-load spawning; guard overlap and replay.
- In multisite work, restore blog context after switching and inspect network/site scope for options, capabilities and uploads.
- Version schema/option upgrades and make interrupted reruns safe. Avoid expensive migrations on every request.

## Primary references

- [WordPress nonces](https://developer.wordpress.org/apis/security/nonces/): limitations, CSRF and authentication boundaries.
- [wpdb::prepare](https://developer.wordpress.org/reference/classes/wpdb/prepare/): placeholder semantics, including %i since 6.2.
- [WooCommerce HPOS recipe book](https://developer.woocommerce.com/docs/features/orders/high-performance-order-storage/recipe-book/): order storage APIs and compatibility declarations.
