# Publication privacy checks

The public source is explicitly listed in `scripts/public-files.json`. Local review fixtures, archives, environment files, deployment credentials, and private key formats are excluded. The package script uses the same list for the source archive and a smaller list for the installable theme.

Run `python scripts/privacy-check.py` before distribution. Checks cover private-key blocks, common provider tokens, SSH key material, personal filesystem paths, credential URLs, JWT/bearer patterns, non-example email/IP literals, and image metadata requiring review. Findings contain file locations and rule names rather than matched sensitive values.

For an additional local check, set `STUDIO_PRIVATE_MARKERS` to a JSON array of private strings to reject. Keep that variable outside the repository. Do not commit a real person's name or domain in a privacy test's denylist; that would itself publish the value.

Examples use reserved domains and documentation addresses. Loopback addresses are used only by local development tooling. Neither example values nor test passwords are operational credentials. The installed theme contains no sample host values.

Before publishing screenshots, inspect visible account names, hostnames, domains, addresses, form values, notifications, and logs. Only synthetic native-view screenshots belong in the gallery. Image pixels need human/visual review; a string scan alone is insufficient.

Archive verification compares exact paths and file bytes with the approved source and rejects extra entries. TAR metadata uses neutral owner/group values, and ZIP members contain no comments or extra fields. SHA-256 checksums accompany generated archives.

These checks are safeguards, not exhaustive secret detection or a formal security audit. Review new files, screenshots, and commit history before changing repository visibility. GitHub account ownership and commit metadata are separate from the contents of the theme.
