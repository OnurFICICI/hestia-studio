# Theme translations

Studio includes all 43 languages offered by HestiaCP 1.10.9. The selected Hestia account language controls the theme; no separate language selector is introduced.

Every theme interface label is supplied by `theme/locales/<language>.json`. Native form labels continue to use Hestia's own gettext catalogs. Theme dictionaries incorporate existing Hestia translations plus theme-specific additions. English is used only for an unknown language or an invalid/missing dictionary; every supported dictionary has all keys.

Supported codes: `ar`, `az`, `bg`, `bn`, `bs`, `ca`, `cs`, `da`, `de`, `el`, `en`, `es`, `et`, `fa`, `fi`, `fr`, `hr`, `hu`, `id`, `it`, `ja`, `ka`, `ko`, `ku`, `lo`, `nl`, `no`, `pl`, `pt`, `pt-br`, `ro`, `ru`, `sk`, `sq`, `sr`, `sv`, `th`, `tr`, `uk`, `ur`, `vi`, `zh-cn`, `zh-tw`.

Arabic, Persian, Sorani Kurdish and Urdu use right-to-left navigation and layout. Brazilian Portuguese, Simplified Chinese and Traditional Chinese retain their full locale identifiers.

To change a label, edit the JSON dictionary using UTF-8. Keep every key from `en.json` and retain technical abbreviations such as DNS and SSH. Do not put translated text in CSS or JavaScript. Translations are written naturally; navigation does not force all labels to uppercase or lowercase. Only group headings use uppercase styling.

`scripts/build-locales.py` can regenerate the dictionaries from an official Hestia source checkout and `scripts/locale-additions.json`. It fails if a native translation is missing without an authored replacement. The package has no build-time or runtime dependency on an online translation service.

The automated checks verify language coverage, key parity, nonempty values, locale selection, safe JSON embedding and RTL selection. They are not a native-speaker linguistic review; translation improvements are welcome.
