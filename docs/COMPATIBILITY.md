# Hestia Studio 2.1 compatibility

Reference: official HestiaCP **1.10.9**, commit `99df77b4c29408b7a941c48d0ec97d44148cf50f`, reviewed 2026-11-24. The tagged source contains 1,572 files. The [77-view inventory](upstream-inventory.json) records native field names and source hashes. Other versions have not been verified; the installer rejects them.

## Installed files

Studio owns exactly 46 files: `studio.css`, `studio.js`, `studio.php` and 43 JSON dictionaries. PHP is loaded by Hestia's existing `web/js/custom_scripts/*.php` extension hook. No Hestia templates, controllers, core scripts, configuration files, services or native language catalogs are patched. The installer backs up previous Studio assets before replacement.

Hestia continues to render the original forms, CSRF tokens, submit targets, permissions, quota conditions and backend actions. Studio supplies navigation, presentation, section links and charts based on authorized page data. It does not create a second administration backend.

## Native feature coverage

| Area | Native integration |
| --- | --- |
| Users and packages | Existing add/edit/list forms and hosting limits; original permission checks retained |
| Server settings | Vertical section tabs generated from actual configuration sections; controls stay inside their original forms and Alpine scopes |
| Web, mail, DNS, databases, cron and backups | Links derived from native enabled modules; native lists, forms, SSL, records, mailbox and restore workflows remain available |
| Services, firewall, IP addresses, monitoring and updates | Navigation respects administrator context and hide-services policy; native actions retained |
| SSH keys, access keys and logs | Root-account protection, API levels and log policy checked before adding navigation |
| Statistics | Monthly records styled as cards; disk and bandwidth charts use only numeric series already authorized by the statistics controller |
| Overview | Live host metrics, actual RRD load/memory history, account web/log previews, all native services as compact status cards |
| Translation | 43 theme dictionaries; Hestia owns native form translations; RTL layout for Arabic, Persian, Sorani and Urdu |

Appearance controls persist locally. Overview makes authenticated same-origin read-only requests to existing Hestia routes; it does not save configuration or execute administrative commands. CPU/RAM/root-disk values are collected by the theme PHP hook on the authorized services Overview only. Theme navigation is not an authorization layer: Hestia controllers remain authoritative.

Version 2.1.0 uses Contact Name for the profile display/initials and a theme-owned session flag for the first administrator Users-to-Overview navigation. The default server/monitoring policy still determines whether Overview uses services or account statistics. Other initial pages and subsequent Users visits are preserved.

## Preview versus installed theme

`dist/` and `Hestia-Studio-Preview.html` are the earlier standalone design demonstration with fictional in-memory records. Their actions do not change a server. They are included only in the source archive and are not installed. The actual theme lives in `theme/` and enhances native Hestia pages. Do not treat the standalone demonstration as a live integration test.

## Verification and limits

- PHP and Node syntax checks; theme contracts cover 43 dictionaries, role/impersonation/policy combinations, safe JSON output, statistics whitelisting and core-free installation targets.
- Twenty-one original PHP views rendered locally with fictional values. Fixtures exercise native list sorting/selection and form frontend modules; they never run Hestia controllers or service commands.
- Browser checks cover the 14-service synthetic Overview, RRD chart gaps, CPU/live and memory tabs, icon tooltips, palette persistence, profile spacing, light/dark appearance, settings section switching and responsive layouts. The original 72 fixture settings controls remain in the native form.
- Live Linux metrics and production RRD responses require validation on the target server. Local Windows fixtures explicitly use synthetic data and a request adapter; that adapter is excluded from installation. No CPU history collector, cron job or daemon is installed.
- Release archives use explicit allowlists; local fixtures, credentials and real server data are excluded.

This is not a full production regression test. Real provisioning, mail delivery, SSL issuance, backup restore and service operations were not executed. SSH access was unavailable in the development environment, so these changes were not deployed to production. Bash installer execution was also unavailable in the Windows sandbox; validate install/restore on a staging HestiaCP 1.10.9 host before a public release. Translation key coverage is checked; native-speaker review remains appropriate.

## References

- https://github.com/hestiacp/hestiacp/tree/1.10.9/web/templates
- https://hestiacp.com/docs/introduction/getting-started
- https://hestiacp.com/docs/server-administration/customisation
- https://hestiacp.com/docs/server-administration/configuration
