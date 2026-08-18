# WordPress security

Read when auditing or hardening a WordPress site, plugin, or theme. Most WordPress compromises are not core exploits; they are missing capability checks, unsanitized input in a plugin, and abandoned dependencies.

## The four gates, every time

Every request that changes state passes all four. Missing any one is a finding.

```php
// 1. CSRF
check_admin_referer( 'prefix_action' );        // forms
check_ajax_referer( 'prefix_action', 'nonce' ); // wp_ajax
// REST: 'wp_rest' nonce, handled by the REST cookie authentication layer

// 2. Authorization — capability AND object
if ( ! current_user_can( 'edit_post', $post_id ) ) {
	wp_send_json_error( array( 'message' => 'Forbidden' ), 403 );
}

// 3. Validation and sanitization
$email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
if ( ! is_email( $email ) ) {
	wp_send_json_error( array( 'message' => 'Invalid email' ), 400 );
}

// 4. Escaping at output
echo esc_html( $email );
```

**A nonce is not authorization.** It proves the request came from your page, not that the user is allowed to perform the action. Every real-world "any subscriber can change site options" vulnerability is a nonce check with no capability check.

## Audit checklist

**Entry points to enumerate**

```bash
grep -rn "add_action( *'wp_ajax" .           # authenticated AJAX
grep -rn "add_action( *'wp_ajax_nopriv"      # UNAUTHENTICATED AJAX — audit every one
grep -rn "register_rest_route"               # REST routes
grep -rn "admin_post_\|admin_post_nopriv_"   # form handlers
grep -rn "add_shortcode\|do_shortcode"       # shortcode attributes are user input
grep -rn "wp_schedule_event\|add_action( *'init'"  # cron and boot-time work
```

**Dangerous patterns to grep**

```bash
grep -rn '\$wpdb->query\|\$wpdb->get_\|\$wpdb->prepare' .   # raw SQL: is every one prepared?
grep -rn "__return_true" .                                   # permission_callback bypass
grep -rn 'echo \$\|print \$' .                               # unescaped output
grep -rn '\$_GET\|\$_POST\|\$_REQUEST\|\$_COOKIE' .          # raw superglobals
grep -rn 'unserialize\|eval(\|extract(\|create_function' .   # code execution sinks
grep -rn 'file_get_contents( *\$\|wp_remote_get( *\$' .      # potential SSRF
grep -rn 'move_uploaded_file\|wp_handle_upload' .            # upload paths
```

Every hit is a question, not a finding. Trace it.

**Per finding, verify:** is the input attacker-controlled, is the path reachable by a role lower than the one intended, and is there a genuine control in between.

## Common WordPress vulnerability shapes

| Shape | What it looks like | Fix |
| --- | --- | --- |
| Missing capability check | `wp_ajax_` handler that trusts a nonce only | Add `current_user_can()` with the object ID |
| `nopriv` handler doing privileged work | `wp_ajax_nopriv_save_settings` | Remove the `nopriv` registration, or restrict it to genuinely public work |
| Public REST mutation | `'permission_callback' => '__return_true'` on POST/PUT/DELETE | A real capability plus ownership check |
| SQL injection | `$wpdb->get_results( "... WHERE id = $id" )` | `$wpdb->prepare()` with placeholders |
| Stored XSS | Option or meta echoed without escaping in admin | `esc_html()` / `esc_attr()` at output, `wp_kses_post()` for rich text |
| Arbitrary option update | A handler that accepts an option name from the request | Allowlist the option keys |
| Arbitrary file read or delete | A path parameter passed to a file function | Resolve and confirm containment in a fixed base directory |
| Privilege escalation via meta | `update_user_meta` with a key from input, reaching `wp_capabilities` | Allowlist meta keys; never let input choose the key |
| Unrestricted upload | `wp_handle_upload` with `test_type => false` | Keep type checking on; validate extension, detected type, and structure |
| Data exposure | A REST route returning full user objects | Return only the fields the caller needs |

## Site hardening

- Remove, do not merely deactivate, unused plugins and themes. Deactivated code is still reachable in some attack paths and still needs updating.
- Prefer plugins that are actively maintained. Check the last update date, the open-issue trail, and whether the vendor responds to security reports. An abandoned plugin with 100k installs is a scheduled incident.
- Keep automatic updates on for security releases, with a staging environment for major ones.
- Disable file editing in the admin: `define( 'DISALLOW_FILE_EDIT', true );`
- Turn off debug output in production: `WP_DEBUG` and `WP_DEBUG_DISPLAY` false, `WP_DEBUG_LOG` to a file outside the web root if used at all.
- Disable XML-RPC unless something genuinely needs it; it is a standing brute-force and amplification surface.
- Block PHP execution inside `wp-content/uploads` at the web-server level.
- Restrict `wp-login.php` and `wp-admin` by rate limit, and add a second factor for administrators.
- Reduce user enumeration where it matters: author archives, the REST users endpoint, and login error differences.
- Set correct file ownership and permissions; the web server should not own the whole tree.
- Keep the database prefix decision in perspective: it is obfuscation, not a control. Do not present it as a fix.
- Keep a tested restore path. Most WordPress incident response is "restore clean, patch the entry point, rotate credentials, then hunt for persistence".

## After a compromise

1. Preserve evidence: file listing with timestamps, web-server logs, database dump, plugin versions.
2. Rotate everything: database credentials, salts and keys in `wp-config.php`, admin passwords, API keys, and hosting panel access. Force logout of all sessions.
3. Hunt for persistence: unfamiliar admin users, unexpected scheduled events (`wp_get_scheduled_event`), modified core files, PHP files in uploads, injected `mu-plugins`, and unknown entries in `active_plugins`.
4. Find the entry point before restoring, or the restore will be reinfected.
5. Patch the entry point, restore clean, then re-scan.
