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

Studio 2.1 uses Contact Name for the profile display/initials and a theme-owned session flag for the first administrator Users-to-Overview navigation. The default server/monitoring policy still determines whether Overview uses services or account statistics. Other initial pages and subsequent Users visits are preserved.

### 2.1.1 corrections

- HestiaCP 1.10.9 `v-update-sys-rrd-la` stores load multiplied by 100; `v-export-rrd` exports `[Load, Processes]` without normalization. Studio divides only the load column by 100 (`105` becomes `1.05`). The process count is never used as a substitute. Zero is valid; missing, negative, nonnumeric, or nonfinite samples remain gaps. Memory history stays in MiB and live CPU stays in percent.
- The PHP bridge includes the resolved account language in its safely encoded JSON context. JavaScript uses it for the document's presentation language, RTL/LTR direction, number formatting, dates, and localized text operations. It does not modify account preferences or server settings. Arabic, Persian, Sorani Kurdish, and Urdu remain RTL even when the server default is English; English accounts remain LTR when the server default is RTL.
- Selection preserves account-before-server precedence and case/underscore normalization. Empty account language uses the server default. Invalid or unavailable dictionaries retain the existing gettext/English labels and use `en` as the presentation fallback. Native Hestia form translations remain Hestia's responsibility.

## Preview versus installed theme

`dist/` and `Hestia-Studio-Preview.html` are the earlier standalone design demonstration with fictional in-memory records. Their actions do not change a server. They are included only in the source archive and are not installed. The actual theme lives in `theme/` and enhances native Hestia pages. Do not treat the standalone demonstration as a live integration test.

## Verification and limits

- PHP and Node syntax checks; theme contracts cover 43 dictionaries, role/impersonation/policy combinations, safe JSON output, statistics whitelisting and core-free installation targets. Regression tests use representative RRD export JSON, exercise actual dashboard chart selection, preserve CPU/memory scales and gaps, and test conflicting account/server languages in both directions, including locale fallback and number/date formatting.
- Twenty-one original PHP views rendered locally with fictional values. Fixtures exercise native list sorting/selection and form frontend modules; they never run Hestia controllers or service commands.
- Browser checks cover the 14-service synthetic Overview, RRD chart gaps, CPU/live and memory tabs, icon tooltips, palette persistence, profile spacing, light/dark appearance, settings section switching and responsive layouts. The original 72 fixture settings controls remain in the native form.
- Local Windows fixtures use synthetic data and a request adapter; that adapter is excluded from installation. The 2.1.1 regressions model the official 1.10.9 RRD export format without copying production responses. Automated validation also passed in GitHub's Ubuntu 24.04 workflow. Live installation and load-scale checks are recorded below; targeted real-Hestia browser checks of account/server language mismatch and RTL remain outstanding. No CPU history collector, cron job or daemon is installed.
- Release archives use explicit allowlists; local fixtures, credentials and real server data are excluded.

### Maintainer-confirmed Linux checks

On 2026-11-24 the maintainer confirmed the following checks on **Ubuntu 24.04 / HestiaCP 1.10.9**, using Studio **2.1.0**:

- Installation from the public GitHub source ZIP.
- Byte-for-byte agreement between the 46 installed theme files and their sources.
- Restoration from the backup made by the first installation, followed by reinstallation.
- Turkish display, palette switching, light/dark switching, the mobile menu, and opening server settings.
- Installation from the published GitHub Release and ongoing use without additional reported problems.

After the **v2.1.1** Release was published, the maintainer also confirmed the following on **2026-11-24**, on the same **Ubuntu 24.04 / HestiaCP 1.10.9** server:

- Successful installation of the published v2.1.1 Release, with no reported problems after installation.
- Byte-for-byte agreement between all 46 installed theme files and the release package.
- The load-average graph displays the corrected scale, and Turkish display works.
- Hestia core files and account settings remain unchanged; a backup of the previous Studio version was created.

These are maintainer-reported installation and interface results. The live installation occurred after release publication, separately from patch preparation. No server addresses, account details, production screenshots, credentials, or actual backup paths are included here.

This is not a comprehensive production regression test. User creation, service restarts, SSL issuance, mail delivery, hosting-backup restoration, and all administration operations have not been verified. First-install restoration and creation of an upgrade backup do **not** establish that rolling back to an older Studio version after an upgrade works. The 2.1.1 fixes have automated coverage locally and on GitHub's Ubuntu 24.04 runner. Account/server language mismatch and RTL behavior have not yet received a targeted real-Hestia browser check. Translation key coverage is checked; native-speaker review remains appropriate.

## References

- https://github.com/hestiacp/hestiacp/tree/1.10.9/web/templates
- https://github.com/hestiacp/hestiacp/blob/1.10.9/bin/v-update-sys-rrd-la
- https://github.com/hestiacp/hestiacp/blob/1.10.9/bin/v-export-rrd
- https://hestiacp.com/docs/introduction/getting-started
- https://hestiacp.com/docs/server-administration/customisation
- https://hestiacp.com/docs/server-administration/configuration
