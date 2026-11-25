#!/usr/bin/env bash
# Execute the real installer gate in isolation: no root access or installation.
set -euo pipefail
installer="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)/scripts/install.sh"
guard=$(sed -n '/^# BEGIN supported HestiaCP versions$/,/^# END supported HestiaCP versions$/p' "$installer")
[[ -n "$guard" ]] || { printf '%s\n' 'Installer version gate was not found.' >&2; exit 1; }
for candidate in 1.10.9 1.10.10; do
  output=$(version="$candidate" bash -c "$guard")
  [[ -z "$output" ]] || { printf '%s\n' 'Unexpected output for a supported version.' >&2; exit 1; }
done
for candidate in '' 1.10.8 1.10.11 1.11.0 1.10.100 v1.10.10 1.10.10-dev '1.10.10 ' ' 1.10.10' '1.10.9,1.10.10' $'1.10.10\n1.11.0'; do
  if output=$(version="$candidate" bash -c "$guard" 2>&1); then
    printf '%s\n' 'Unsupported or malformed version was accepted.' >&2
    exit 1
  fi
  [[ "$output" == 'This package targets HestiaCP 1.10.9 or 1.10.10. Found: '* ]] || exit 1
done
printf '%s\n' 'Installer version gate passed: 2 supported and 11 rejected inputs; no files installed.'
