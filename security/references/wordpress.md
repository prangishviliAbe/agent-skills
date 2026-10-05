# WordPress and WooCommerce security

Read for WordPress site, plugin, theme, REST or AJAX endpoint review, or a compromise investigation. Record the WordPress, PHP, and plugin versions, intended roles, storage mode, and deployment controls first; ecosystem reputation is not evidence about a particular installation. The implementation-side habits are in the web-development skill's WordPress notes; this file is about finding and proving flaws.

## Discover entry points

The first block of patterns is in [audit-playbook.md](audit-playbook.md) (`wp_ajax_`, `admin_post_`, `register_rest_route`, shortcodes). Also search for data and side effects: `$wpdb`, `update_option`, `update_user_meta`, `wp_remote_get`, `wp_remote_post`, `unserialize`, `move_uploaded_file`, `include`, `eval`. A registration or an unsafe-looking call is a lead: trace the initiating actor, the real input, the controls, and the impact before reporting.

## Distinctions that decide findings

- A **nonce** mitigates CSRF. It is not authentication, authorization, proof of origin, or single-use. Logged-out nonce behavior needs scrutiny on public forms. Possessing a nonce says nothing about capability.
- **Cookie-authenticated** forms and AJAX need the action nonce and the intended capability. **Cookie-authenticated REST** needs the REST authentication layer and a correct `permission_callback`. **Application Passwords** and **signed provider webhooks** use different identity mechanisms and do not need a UI nonce.
- Use meta capabilities with an object id (`current_user_can( 'edit_post', $id )`) when the policy is per object. Site-wide capabilities take no invented object argument. Customer order operations use ownership or the guest order key, not an administrator check.
- Public endpoints and public mutations can be intentional. `__return_true` alone is not an authorization bypass; check the policy, input limits, abuse control, and the data returned.

## Vulnerable and corrected patterns

```php
// Vulnerable: wp_ajax_nopriv_ exposes a state change to everyone; no nonce, no capability
add_action( 'wp_ajax_nopriv_abc_set_role', function () {
	wp_update_user( array( 'ID' => (int) $_POST['user'], 'role' => $_POST['role'] ) );
} );

// Corrected: logged-in only, nonce for CSRF, capability for authorization, allowlisted role
add_action( 'wp_ajax_abc_set_role', function () {
	check_ajax_referer( 'abc_set_role', 'nonce' );
	if ( ! current_user_can( 'promote_users' ) ) {
		wp_send_json_error( null, 403 );
	}
	$role = isset( $_POST['role'] ) && is_string( $_POST['role'] ) ? sanitize_key( wp_unslash( $_POST['role'] ) ) : '';
	if ( ! in_array( $role, array( 'subscriber', 'contributor', 'editor' ), true ) ) {
		wp_send_json_error( null, 422 ); // 'administrator' is not an option
	}
	wp_update_user( array( 'ID' => absint( $_POST['user'] ?? 0 ), 'role' => $role ) );
	wp_send_json_success();
} );
```

```php
// Vulnerable: SQL built from request data, so the value controls the statement
$wpdb->query( "DELETE FROM {$wpdb->prefix}abc_log WHERE id = " . $_GET['id'] );

// Corrected: prepared value, type enforced, capability checked earlier in the handler
$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}abc_log WHERE id = %d", absint( $_GET['id'] ?? 0 ) ) );
```

```php
// Vulnerable: the caller chooses the meta key, so they can write wp_capabilities and become an administrator
update_user_meta( get_current_user_id(), $_POST['key'], $_POST['value'] );

// Corrected: only allowlisted keys are writable
$allowed = array( 'abc_display_name', 'abc_timezone' );
if ( in_array( $_POST['key'] ?? '', $allowed, true ) ) {
	update_user_meta( get_current_user_id(), $_POST['key'], sanitize_text_field( wp_unslash( $_POST['value'] ?? '' ) ) );
}
```

Other recurring flaws: `unserialize()` on user-controlled data (use JSON, or `allowed_classes => false`); file uploads that keep the client extension or land in an executable path; REST responses that expose private meta registered with `show_in_rest`; user-supplied URLs fetched without destination checks; shortcode attributes echoed unescaped; payment callbacks that accept an order id without verifying the signature, amount, and state. A value saved by an administrator can still reach another principal, but report XSS only after identifying the executable context and a realistic actor path.

## High-value invariants

| Operation | Verify |
| --- | --- |
| User or option update | The caller cannot choose privileged keys or raise roles |
| Upload, read, delete | Allowed format, private-object authorization, path containment, safe serving |
| REST serialization | Only permitted fields, including registered meta |
| Outbound URL from input | Destination validation, redirects, bounded response |
| Order, payment, refund | Correct order and provider, signature, amount and currency, allowed state, replay safety |
| Save hook, cron | The initiating authority, no recursion or duplicate effects |
| Multisite | Correct site or network scope and restored blog context |

WooCommerce: use the CRUD objects and supported authorization; direct order post-meta assumptions fail under High-Performance Order Storage. Verify the actual checkout architecture (classic or Blocks) and the alternate routes, not one admin screen.

## Hardening with compatibility

Prioritize supported versions, removing unused executable code, credential privilege, upload execution policy, diagnostic exposure, and a tested restore. Remove unused plugins or themes only when authorized and dependencies are understood; deactivation may leave files reachable. Evaluate XML-RPC, the REST API, and admin access against real integration needs before disabling them, and protect login and recovery with rate limits and MFA without locking out service identities. Keep `WP_DEBUG_DISPLAY` off in production, set `DISALLOW_FILE_EDIT` when it fits operations, and treat database prefixes and hidden login URLs as exposure reduction at most. There is no universal numeric file mode; follow the host's ownership model.

## Suspected compromise

1. Establish scope and authorized containment. Preserve useful evidence first when feasible: logs, file hashes, version records, timestamps.
2. Isolate execution and access, then rotate exposed or plausibly stolen credentials from a trusted machine, in a coordinated order. Rotating while malicious code runs lets it steal the new values.
3. Look for persistence and tampering; a malware scan alone cannot prove absence:

```bash
wp core verify-checksums                                    # core files against wordpress.org checksums
wp plugin verify-checksums --all                            # plugins from wordpress.org
wp user list --role=administrator --fields=ID,user_login,user_registered
wp cron event list --fields=hook,next_run_relative
wp option get active_plugins --format=json
find wp-content/uploads -name '*.php'                       # code in the uploads tree
find wp-content/mu-plugins -type f -newermt '30 days ago'   # recent must-use plugins
```

4. Patch the plausible entry points, then restore or redeploy from known-good material. Record an unknown initial vector instead of blocking recovery indefinitely.
5. Verify business behavior and access controls, monitor for recurrence, and keep evidence with limited access. Restoration alone does not prove eradication.

## Primary references

- [WordPress nonces](https://developer.wordpress.org/apis/security/nonces/)
- [wpdb::prepare](https://developer.wordpress.org/reference/classes/wpdb/prepare/)
