# Changelog

## 2.1.1

- Correct HestiaCP 1.10.9 load-history scaling: raw `105` is displayed as `1.05`; process counts are ignored, gaps and zero are preserved, and memory/live CPU scales are unchanged.
- Use the resolved account language consistently for theme translations, RTL/LTR layout, number formatting, dates, and localized text operations, including when the server default differs.
- Add representative RRD-export and account/server language regressions; safely handle invalid or unavailable locales.
- Refresh versioned browser assets and document the maintainer-confirmed 2.1.0 Linux installation/interface checks and their limits. Targeted Linux/browser validation of these new fixes remains outstanding.

## 2.1.0

- Native HestiaCP 1.10.9 sidebar, headers, profile display, and quick navigation.
- Administrator overview, live metrics, load/memory charts, domains/logs, and service cards.
- Seven light/dark palettes with browser-local persistence.
- Section navigation for native settings, readable statistics, shared search/bulk controls, SVG icons, and tooltips.
- 43 complete dictionaries and RTL support for Arabic, Persian, Sorani Kurdish, and Urdu.
- Contact Name display and first-login administrator Overview navigation.
- Theme-only install, backup, restore, and removal scripts.
- English documentation, fictional-data screenshots, explicit publication lists, privacy checks, and archive checksums.

This is the first documented repository release. Limited Linux installation, first-install restoration, reinstallation, and interface checks were subsequently confirmed by the maintainer; see [COMPATIBILITY.md](docs/COMPATIBILITY.md). Full production operation coverage is not claimed.
