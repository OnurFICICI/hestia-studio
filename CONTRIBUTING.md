# Contributing

Focused bug fixes, translations, accessibility improvements, and UI reports are welcome.

Include HestiaCP/Studio versions, browser, language, appearance, color, reproduction steps, and expected/actual behavior. Use fictional accounts and example domains. Remove sensitive data from screenshots and logs. Security reports follow [SECURITY.md](SECURITY.md).

## Development

Use Node.js 20+, PHP 8+, and Python 3.10+. No npm installation is needed.

```sh
npm run check
npm run build
python scripts/package.py
```

- Edit `theme/` for the real theme; `dist/` is a separate prototype.
- Preserve native field names, actions, CSRF handling, permissions, and Alpine scopes.
- Keep all 43 dictionaries in sync; see [TRANSLATING.md](docs/TRANSLATING.md).
- Add intended public files to `scripts/public-files.json`.
- Use real authorized data in production and fictional values in tests/previews.
- Avoid external telemetry, new administration endpoints, and shell execution in theme PHP.
- Include fictional-data screenshots for visible changes and explain validation limits.
- Keep personal paths, real hosts, email addresses, credentials, and local review files out of commits.

Install/restore testing needs a disposable HestiaCP host. New version support requires reviewing native templates, the inventory, tests, and installer; do not merely relax the version guard.

Contributions use GPL-3.0-or-later. Preserve third-party notices.
