#!/usr/bin/env bash
# Hestia Studio 2.1.2. Only custom theme assets are installed; no core files changed.
set -euo pipefail
[[ ${EUID} -eq 0 ]] || { printf '%s\n' 'Run this installer as root.' >&2; exit 1; }
root=/usr/local/hestia
source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
[[ -f "$root/conf/hestia.conf" ]] || { printf '%s\n' 'HestiaCP was not found.' >&2; exit 1; }
version=$(sed -n "s/^VERSION='\([^']*\)'[[:space:]]*$/\1/p" "$root/conf/hestia.conf")
# BEGIN supported HestiaCP versions
case "$version" in
  1.10.9|1.10.10) ;;
  *) printf 'This package targets HestiaCP 1.10.9 or 1.10.10. Found: %s\n' "$version" >&2; exit 1 ;;
esac
# END supported HestiaCP versions
css_dir="$root/web/css/themes/custom"
js_dir="$root/web/js/custom_scripts"
locale_dir="$js_dir/studio-locales"
for dir in "$css_dir" "$js_dir"; do
  [[ -d "$dir" && ! -L "$dir" ]] || { printf 'Expected a real directory: %s\n' "$dir" >&2; exit 1; }
done
[[ ! -L "$locale_dir" ]] || { printf '%s\n' 'Refusing symlink locale directory.' >&2; exit 1; }
php_bin="$root/php/bin/php"
[[ -x "$php_bin" ]] || php_bin=$(command -v php)
"$php_bin" -l "$source_dir/theme/studio.php" >/dev/null
# Validate all dictionaries, keys and strings before touching installed assets.
"$php_bin" -r '
$dir=$argv[1];$files=glob($dir."/*.json");
if(count($files)!==43){fwrite(STDERR,"Expected all 43 locales.\n");exit(1);}
$en=json_decode(file_get_contents($dir."/en.json"),true,512,JSON_THROW_ON_ERROR);
foreach($files as $file){$v=json_decode(file_get_contents($file),true,512,JSON_THROW_ON_ERROR);
if(array_keys($v)!==array_keys($en)){fwrite(STDERR,"Locale keys do not match.\n");exit(1);}
foreach($v as $text){if(!is_string($text)||trim($text)===""){exit(1);}}}
' "$source_dir/theme/locales"
sources=("$source_dir/theme/studio.css" "$source_dir/theme/studio.js" "$source_dir/theme/studio.php")
targets=("$css_dir/studio.css" "$js_dir/studio.js" "$js_dir/studio.php")
for locale in "$source_dir"/theme/locales/*.json; do
  name="${locale##*/}"
  [[ "$name" =~ ^[a-z]{2,3}(-[a-z]{2,3})?\.json$ ]] || exit 1
  sources+=("$locale"); targets+=("$locale_dir/$name")
done
for i in "${!targets[@]}"; do
  [[ -f "${sources[$i]}" && ! -L "${targets[$i]}" ]] || { printf '%s\n' 'Missing source or symlink target; stopped.' >&2; exit 1; }
done
backup_root="$root/data/studio-backups"
[[ ! -L "$backup_root" ]] || { printf '%s\n' 'Refusing symlink backup directory.' >&2; exit 1; }
install -d -m 0700 "$backup_root"
backup_dir=$(mktemp -d "$backup_root/$(date -u +%Y%m%dT%H%M%SZ).XXXXXXXX")
for i in "${!targets[@]}"; do
  [[ ! -f "${targets[$i]}" ]] || cp -p -- "${targets[$i]}" "$backup_dir/$i.asset"
  printf '%s\n' "${targets[$i]}" >> "$backup_dir/targets.txt"
done
install -d -o root -g root -m 0755 "$locale_dir"
changed=()
rollback(){
  local result=$?
  trap - ERR
  for i in "${changed[@]}"; do
    if [[ -f "$backup_dir/$i.asset" ]]; then cp -p -- "$backup_dir/$i.asset" "${targets[$i]}"; else rm -f -- "${targets[$i]}"; fi
  done
  printf 'Installation failed; restored previous theme assets. Backup: %s\n' "$backup_dir" >&2
  exit "$result"
}
trap rollback ERR
# Locale files first; PHP metadata last. Each target is replaced atomically.
order=(); for ((i=3;i<${#targets[@]};i++)); do order+=("$i"); done; order+=(0 1 2)
for i in "${order[@]}"; do
  tmp=$(mktemp "${targets[$i]%/*}/.studio-install.XXXXXXXX")
  install -o root -g root -m 0644 "${sources[$i]}" "$tmp"
  changed+=("$i")
  mv -f -- "$tmp" "${targets[$i]}"
  cmp -s -- "${sources[$i]}" "${targets[$i]}"
done
trap - ERR
printf 'Installed Studio 2.1.2 with 43 locales. Backup: %s\n' "$backup_dir"
printf '%s\n' 'Select studio in Hestia appearance settings, then reload.' 'No core templates, accounts, services or permissions were changed.'
