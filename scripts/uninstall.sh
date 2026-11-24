#!/usr/bin/env bash
set -euo pipefail
[[ ${EUID} -eq 0 ]] || { printf '%s\n' 'Run this uninstaller as root.' >&2; exit 1; }
root=/usr/local/hestia
[[ -f "$root/conf/hestia.conf" && -d "$root/data/users" ]] || { printf '%s\n' 'HestiaCP was not found.' >&2; exit 1; }
shopt -s nullglob
configs=("$root/conf/hestia.conf" "$root"/data/users/*/user.conf)
if grep -Eq "^THEME='studio'" "${configs[@]}"; then
  printf '%s\n' 'Select a different theme for all users and the server default first. Log out of existing sessions before removal.' >&2
  exit 1
fi
for file in "$root/web/css/themes/custom/studio.css" "$root/web/js/custom_scripts/studio.js" "$root/web/js/custom_scripts/studio.php"; do
  [[ ! -L "$file" ]] || { printf '%s\n' 'Refusing a symlink target.' >&2; exit 1; }
  rm -f -- "$file"
done
locale_dir="$root/web/js/custom_scripts/studio-locales"
[[ ! -L "$locale_dir" ]] || { printf '%s\n' 'Refusing symlink locale directory.' >&2; exit 1; }
for language in ar az bg bn bs ca cs da de el en es et fa fi fr hr hu id it ja ka ko ku lo nl no pl pt pt-br ro ru sk sq sr sv th tr uk ur vi zh-cn zh-tw; do
  file="$locale_dir/$language.json"
  [[ ! -L "$file" ]] || { printf '%s\n' 'Refusing symlink locale file.' >&2; exit 1; }
  rm -f -- "$file"
done
rmdir -- "$locale_dir" 2>/dev/null || true
printf '%s\n' 'Studio theme assets removed. Existing backups were kept.'
