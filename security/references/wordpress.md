# WordPress and WooCommerce security

Read for WordPress site, plugin, theme, REST/AJAX endpoint or compromise investigation. Record relevant WordPress/PHP/plugin versions, intended roles, storage mode and deployment controls; ecosystem reputation is not evidence about a particular installation.

## Discover entry points

Search for registrations and follow callbacks; use the available text-search tool and inspect the match in context. Useful terms:

| Surface | Search terms |
| --- | --- |
| AJAX | wp_ajax_, wp_ajax_nopriv_ |
| Forms and REST | admin_post_, admin_post_nopriv_, register_rest_route, permission_callback |
| Content and lifecycle | add_shortcode, register_block_type, save_post, init, cron hook registrations |
| Data/side effects | $wpdb, update_option, update_user_meta, wp_remote_get, wp_remote_post, file operations |
| Output/parsing | echo, print, wp_kses, unserialize, eval, template construction |

A registration or unsafe-looking function is a lead. Trace the initiating actor, actual input, effective controls and impact before reporting it.

## Authentication, nonce, and capability distinctions

WordPress nonces mitigate CSRF in applicable flows; they are not authentication, authorization, proof of origin or single-use replay protection. Logged-out nonce behavior needs particular attention when used in public forms. Never infer a user's capability from possessing a nonce.

For cookie-authenticated forms/AJAX, check the action nonce and intended capability. For cookie-authenticated REST work, inspect the REST authentication layer and permission_callback. Application Passwords and signed provider webhooks use different identity mechanisms; they do not universally need a UI nonce.

Use object-aware meta capabilities such as current_user_can('edit_post', $id) when that is the policy. Site-wide capabilities do not require an invented object argument. For commerce customer operations, preserve the supported ownership or guest-order authorization mechanism instead of imposing an administrative capability.

Public endpoints and public mutations can be intentional. Check their policy, input limits, abuse controls and returned data; __return_true alone is not an auth-bypass finding.

## Input, SQL, and output

Validate types before applying string sanitizers. Unslash superglobal input where appropriate, not already-parsed data indiscriminately. Select permitted fields, option names and meta keys; a sanitized option name can still refer to a privileged setting. Distinguish normalization from rejection and business rules.

Use data APIs where suitable and wpdb::prepare for dynamic SQL values. WordPress 6.2+ supports %i identifiers; on older supported versions use fixed/mapped identifiers. Allowlist which identifiers may be selected regardless of quoting. Look for unsafe fragments before or after preparation, and check authorization separately from SQL injection.

Encode output by its actual HTML/attribute/URL context. Rich HTML needs a configured allowlist sanitizer; scripts and embedded JSON need safe serialization. A value saved by an administrator can still reach another principal, but only report XSS after identifying executable context and a realistic actor path.

## High-value invariants

| Operation | Verify |
| --- | --- |
| User/meta or option update | Caller cannot choose privileged keys or elevate roles |
| File upload/read/delete | Allowed format, private-object access, path containment and safe serving |
| REST serialization | Permitted fields only, including metadata registered for REST exposure |
| User-provided outbound URL | Safe destination handling, redirects and bounded response processing |
| Order/payment/refund | Correct order/provider/account, signature, amount/currency, state and replay safety |
| Save/cron handler | Intended initiating authority, no unintended recursion or duplicate effects |
| Multisite operation | Correct site/network scope and restoration after context switches |

Use WooCommerce CRUD and supported authorization APIs; direct order post-meta assumptions can fail with HPOS. Verify the installed checkout architecture and relevant alternate routes, not only one admin screen.

## Hardening with compatibility

Prioritize supported versions, unused executable code, credential privilege, upload execution policy, diagnostic exposure and tested restoration. Remove unused plugins/themes only when that change is authorized and dependencies are understood; deactivation alone may not eliminate directly reachable files.

Evaluate XML-RPC, REST and admin access against actual integration needs before disabling them. Rate limits and MFA should protect login/recovery without locking out required service identities. Use the server's supported ownership/permission model; there is no universal numeric filesystem mode for every host.

Keep debug display off on public production responses; protected logging can remain useful. Disable dashboard code editing when consistent with operations. Treat database prefixes and hidden login URLs as exposure reduction at most, not replacements for authorization and patching.

## Suspected compromise

1. Determine scope and authorized containment; preserve minimal useful logs, hashes, version records and timestamps before destructive cleanup when feasible.
2. Isolate affected execution and access. Rotate exposed or plausibly compromised credentials through a trusted control plane in a coordinated order; credentials rotated while malicious code still runs can be stolen again.
3. Inspect persistence in users, scheduled tasks, mu-plugins, executable uploads, options and modified code. Compare to trusted artifacts; a malware scan alone cannot prove absence.
4. Patch plausible entry points and restore/redeploy from known-good material. Record an unknown initial vector instead of blocking urgent recovery indefinitely.
5. Verify business behavior and access controls, monitor for recurrence, and retain evidence with appropriate access and retention. Restoration alone does not prove eradication.

## Primary references

- [WordPress nonces](https://developer.wordpress.org/apis/security/nonces/): nonce limitations and intended use.
- [wpdb::prepare](https://developer.wordpress.org/reference/classes/wpdb/prepare/): supported placeholders and version history.
