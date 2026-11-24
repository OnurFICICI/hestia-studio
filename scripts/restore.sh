#!/usr/bin/env bash
# Restore only Studio-owned assets from an installer backup.
set -euo pipefail
[[ ${EUID} -eq 0 && $# -eq 1 ]] || { printf '%s\n' 'Run as root with one Studio backup directory.' >&2; exit 1; }
root=/usr/local/hestia
backup=$(realpath -e -- "$1")
[[ "$backup" == "$root/data/studio-backups/"* && -f "$backup/targets.txt" ]] || exit 1
mapfile -t targets < "$backup/targets.txt"
[[ ${#targets[@]} -eq 46 ]] || exit 1
for target in "${targets[@]}"; do
  case "$target" in
    "$root/web/css/themes/custom/studio.css"|"$root/web/js/custom_scripts/studio.js"|"$root/web/js/custom_scripts/studio.php") ;;
    "$root/web/js/custom_scripts/studio-locales/"*.json) [[ "${target##*/}" =~ ^[a-z]{2,3}(-[a-z]{2,3})?\.json$ ]] || exit 1 ;;
    *) exit 1 ;;
  esac
  [[ ! -L "$target" && ! -L "${target%/*}" ]] || exit 1
done
for i in "${!targets[@]}"; do
  if [[ -f "$backup/$i.asset" && ! -L "$backup/$i.asset" ]]; then
    install -o root -g root -m 0644 "$backup/$i.asset" "${targets[$i]}"
  else
    rm -f -- "${targets[$i]}"
  fi
done
printf '%s\n' 'Previous Studio assets restored. Reload the panel.'
