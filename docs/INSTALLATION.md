# Installing Hestia Studio

Studio 2.1.1 targets HestiaCP 1.10.9. Install it on the Hestia server, not on a desktop computer or inside a website's public directory.

## Requirements

- Root access or an account that can run `sudo`.
- HestiaCP 1.10.9; do not bypass the version check.
- A complete source ZIP or dedicated Theme archive.

No Node.js, npm, Python, Composer, or build is needed on the server. The installer uses Hestia's PHP when available, with system PHP as a fallback. Keep a working SSH session available. The backup covers Studio assets, not the entire server.

## Quick installation

1. Download **Code → Download ZIP** from the repository, or a dedicated Theme archive if available.
2. Transfer and extract it outside hosted public directories on the Hestia server.
3. Enter the folder containing `scripts/` and `theme/`.
4. Run `sudo bash scripts/install.sh`.
5. In **your own Hestia user profile**, select **Theme → studio**, save, and reload.

For a dedicated TAR.GZ package:

```sh
tar -xzf Hestia-Studio-Theme.tar.gz
cd hestia-studio
sudo bash scripts/install.sh
```

A GitHub ZIP normally creates `hestia-studio-main`; enter that folder instead. A dedicated Theme ZIP creates `hestia-studio`. If already root, omit `sudo`.

If SHA-256 checksums are supplied, compare your archive with its checksum before extraction. Validate a first installation and restore on a disposable/staging host; local checks are not a full live server test.

## Activate it: account theme versus server default

Installing files does not activate Studio automatically.

| Setting | Location | Behavior |
| --- | --- | --- |
| Your account | Profile / Edit User → **Theme** → **studio** → Save. | Essential if this user has another theme saved. |
| Server default | Administrator: **Server settings → Basic Options → Theme** → **studio** → Save. | An existing user's saved theme may still take precedence. |
| All users | Server form: **Set as selected theme for all users**. | Optional; changes everyone's selected theme. |

**Changed the server setting but your screen did not change?** Open the affected user's own profile, select `studio` in that user's **Theme** field, save, and reload. You may need both the server setting and user setting. Do not patch core templates to force activation.

Labels depend on the account language; the selected value remains `studio`. Make sure you are editing your own account if you only want to change your appearance.

Hard-refresh with **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (macOS). A fresh sign-in can also help with an older session's appearance. Then use **Light / Dark** in the sidebar and **Color palette** in the top bar. These preferences stay in the current browser.

## What the installer does

It validates privileges, version, directories, symlinks, PHP syntax, and 43 dictionaries before replacing files. Existing Studio assets are backed up under `/usr/local/hestia/data/studio-backups/`. Each of the 46 files is replaced atomically and compared with its source. The backup path is printed at completion.

It does not patch core files, select a theme, create users, install a daemon, or restart services. Keep the printed backup path.

## Update

Extract the newer package and run `sudo bash scripts/install.sh` from its directory. If the account already uses `studio`, reload. Versioned assets help prevent mixed old/new files; hard-refresh if necessary.

## Roll back

Use the exact backup directory printed by the installation to undo:

```sh
sudo bash scripts/restore.sh /usr/local/hestia/data/studio-backups/BACKUP_DIRECTORY
```

Restore affects only Studio assets. A first-install backup removes files that did not exist previously; select another theme for affected accounts before restoring that backup. Reload afterward.

## Remove

Switch affected users and the server default to another installed theme, log out of Studio sessions, then run:

```sh
sudo bash scripts/uninstall.sh
```

Only known Studio assets are removed. Backups and HestiaCP remain.

## Troubleshooting

| Symptom | Next step |
| --- | --- |
| `studio` is missing | Confirm installation completed on the correct server and custom `studio.css` exists; reload the profile form. |
| Server setting changed but appearance did not | Select `studio` in the user's profile too. |
| Old or mixed layout | Save the account theme, hard-refresh, and try a fresh sign-in. All assets must come from the same package. |
| Version mismatch | Keep the restriction; only 1.10.9 is targeted. |
| Permission denied | Run as root or with `sudo` on the Hestia server. |
| PHP/dictionary error | Obtain a complete unmodified package; do not skip validation. |
| Host data unavailable | Check administrator permissions and services/monitoring routes. No fabricated fallback readings are shown. |
| Ordinary user cannot see administration | Expected: Hestia's roles and policies still apply. |
| Color differs between browsers | Appearance preferences are browser-local. |

Reports must use fictional data and sanitized screenshots. See [SECURITY.md](../SECURITY.md).
