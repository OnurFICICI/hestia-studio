# Security policy

Studio 2.1.1 targets HestiaCP 1.10.9. Other versions are unverified. This community project has no guaranteed security-response SLA.

## Report privately

Private vulnerability reporting is enabled on this repository. Open **Security and quality → Advisories → Report a vulnerability** to send a confidential report to the maintainers. Do not disclose vulnerabilities in public issues, discussions, or pull requests.

Include versions, reproduction with fictional data, expected/actual behavior, and potential impact. Never include live passwords, tokens, SSH keys, cookies, session exports, or customer records.

## Boundaries

HestiaCP controls authentication, authorization, CSRF checks, and server operations. Theme navigation is not an authorization layer. Studio reads existing authorized same-origin routes and emits selected presentation metadata rather than the whole session. Host metrics are restricted to a permitted administrator overview. It creates no administration API and executes no shell commands.

The installed theme needs no telemetry service, CDN, remote font, or translation service. Install and restore are separate root-level operations.

## Publication

Explicit file lists and checks look for key material, token patterns, personal paths, unexpected email/IP literals, and excluded files. Screenshots require visual review; text checks cannot inspect pixels. These are safeguards, not a formal audit or a guarantee of zero vulnerabilities. See [PRIVACY.md](docs/PRIVACY.md) and [COMPATIBILITY.md](docs/COMPATIBILITY.md).
