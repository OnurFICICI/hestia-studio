"""Offline publication checks. Reports locations and rule names, never matched values."""
from pathlib import Path, PurePosixPath
import argparse
import ipaddress
import json
import os
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PATTERNS = {
    'private-key': re.compile(r'-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----'),
    'ssh-key': re.compile(r'\b(?:ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp\d+)\s+[A-Za-z0-9+/]{40,}'),
    'provider-token': re.compile(r'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16}|sk-[A-Za-z0-9_-]{24,}|xox[baprs]-[A-Za-z0-9-]{20,})'),
    'personal-path': re.compile(r'(?i:[A-Za-z]:[\\/](?:Users|laragon)[\\/])|/(?:Users|home)/(?!demo/)[A-Za-z_][A-Za-z0-9_.-]*/'),
    'credential-url': re.compile(r'https?://[^\s/\'"<>]+:[^\s/\'"<>]+@', re.I),
    'bearer-token': re.compile(r'Bearer\s+[A-Za-z0-9_.-]{24,}', re.I),
    'jwt': re.compile(r'\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}'),
}
EMAIL = re.compile(r'\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b')
IPV4 = re.compile(r'(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?![\w.])')
IPV6 = re.compile(r'(?<![\w:])(?:[0-9a-f]{0,4}:){2,}[0-9a-f:]{0,39}(?![\w:])', re.I)
EXAMPLE_NETS = [ipaddress.ip_network(x) for x in ('192.0.2.0/24','198.51.100.0/24','203.0.113.0/24','2001:db8::/32')]
FORBIDDEN_PARTS = {'.git','.review','.ssh','.aws','.codex','.agents','node_modules','__pycache__','release'}
FORBIDDEN_SUFFIXES = {'.pem','.key','.ppk','.p12','.pfx','.bak','.log','.sql','.dump','.har','.zip','.gz'}

def manifest():
    names = json.loads((ROOT/'scripts/public-files.json').read_text(encoding='utf-8'))
    if not isinstance(names,list) or not names or any(not isinstance(x,str) for x in names):
        raise ValueError('Invalid public file list')
    if len(names) != len(set(names)):
        raise ValueError('Duplicate public path')
    for name in names:
        p=PurePosixPath(name)
        if p.is_absolute() or '..' in p.parts or '\\' in name or ':' in name:
            raise ValueError('Unsafe public path')
        if set(p.parts)&FORBIDDEN_PARTS or p.suffix.lower() in FORBIDDEN_SUFFIXES or p.name.startswith(('.env','id_rsa','id_ed25519')):
            raise ValueError('Private file type in public list')
        f=ROOT/name
        if not f.is_file() or f.is_symlink() or any(x.is_symlink() for x in f.parents):
            raise ValueError('Missing or linked public file: '+name)
    return names

def scan_bytes(name, data, markers=()):
    issues=[]
    text=data.decode('utf-8',errors='replace')
    for marker in markers:
        if marker and marker.casefold() in text.casefold():
            issues.append((name,0,'private-marker'))
    # Binary image payloads still receive private-marker scanning above.
    if name.lower().endswith(('.jpg','.jpeg','.png')):
        if b'Exif\x00\x00' in data or b'http://ns.adobe.com/xap/' in data or b'tEXt' in data or b'iTXt' in data:
            issues.append((name,0,'image-metadata-needs-review'))
        return issues
    for number,line in enumerate(text.splitlines(),1):
        for rule,pattern in PATTERNS.items():
            if pattern.search(line): issues.append((name,number,rule))
        for m in EMAIL.finditer(line):
            domain=m.group(1).lower()
            if not any(domain==x or domain.endswith('.'+x) for x in ('example.com','example.org','example.net','example.test')):
                issues.append((name,number,'non-example-email'))
        for pattern in (IPV4,IPV6):
            for m in pattern.finditer(line):
                try: address=ipaddress.ip_address(m.group())
                except ValueError: continue
                # Documentation networks, loopback, unspecified address and a common netmask are examples only.
                allowed=address.is_loopback or address.is_unspecified or str(address)=='255.255.255.0' or any(address.version==net.version and address in net for net in EXAMPLE_NETS)
                if not allowed: issues.append((name,number,'non-example-ip'))
    return sorted(set(issues))

def check(markers=()):
    names=manifest()
    issues=[]
    for name in names: issues.extend(scan_bytes(name,(ROOT/name).read_bytes(),markers))
    if issues:
        for name,line,rule in issues: print(f'{name}:{line}: {rule}')
        raise ValueError(f'Publication scan blocked: {len(issues)} finding(s)')
    print(f'Publication scan passed: {len(names)} approved files. Image pixels require separate visual review.')
    return names

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.parse_args()
    try: check(json.loads(os.environ.get('STUDIO_PRIVATE_MARKERS','[]')))
    except (ValueError,OSError) as error:
        print(str(error),file=sys.stderr)
        sys.exit(1)
