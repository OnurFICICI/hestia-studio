# Contributing

Focused bug fixes, translations, accessibility improvements, and UI reports are welcome.

Read the [code of conduct](CODE_OF_CONDUCT.md). For installation and usage questions, see [SUPPORT.md](SUPPORT.md).

## Your first contribution

1. Search existing issues and discussions. Use an issue for a reproducible bug or a focused feature request; discuss larger changes before implementing them.
2. Fork the repository to your GitHub account, then create a branch from `main` in your fork.
3. Make a focused change and run the checks below. Keep unrelated formatting changes out of the pull request.
4. Open a pull request against this repository's `main` branch. Complete the pull request template and explain any untested behavior.
5. Respond to review feedback. A maintainer reviews and merges accepted changes.

You do not need direct write access to contribute. External contributors' workflow runs require maintainer approval; a pending run is not a failed test. Pull requests require review, successful validation, and resolved review conversations. New commits invalidate previous approvals. Maintainers may use their administrative exception for their own reviewed maintenance work.

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
