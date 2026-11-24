"""Build verified public archives from approved files only."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib
import importlib.util
import io
import json
import os
import tarfile
import tempfile

root=Path(__file__).resolve().parent.parent
release=root/'release'
release.mkdir(exist_ok=True)
spec=importlib.util.spec_from_file_location('privacy_check',root/'scripts/privacy-check.py')
privacy=importlib.util.module_from_spec(spec)
spec.loader.exec_module(privacy)
markers=json.loads(os.environ.get('STUDIO_PRIVATE_MARKERS','[]'))
source_files=privacy.check(markers)
theme_files=[name for name in source_files if name.startswith(('theme/','docs/')) or name in {
    'README.md','LICENSE','THIRD_PARTY_NOTICES.md','CONTRIBUTING.md','SECURITY.md','CHANGELOG.md',
    'SUPPORT.md','CODE_OF_CONDUCT.md',
    'scripts/install.sh','scripts/restore.sh','scripts/uninstall.sh'}]
preview=release/'Hestia-Studio-Preview.html'
if not preview.is_file(): raise FileNotFoundError('Run npm run build first.')
if privacy.scan_bytes(preview.name,preview.read_bytes(),markers):
    raise ValueError('Offline preview failed publication checks')

def entries(names,include_preview=False):
    result={'hestia-studio/'+name:(root/name).read_bytes() for name in names}
    if include_preview: result['hestia-studio/Hestia-Studio-Preview.html']=preview.read_bytes()
    return result

def zip_package(filename,content):
    fd,temp=tempfile.mkstemp(prefix='studio-',suffix='.zip',dir=release)
    os.close(fd)
    try:
        with ZipFile(temp,'w',ZIP_DEFLATED) as archive:
            for name,data in content.items():
                info=ZipInfo(name,date_time=(2026,1,1,0,0,0))
                info.compress_type=ZIP_DEFLATED
                info.create_system=3
                info.external_attr=0o100644<<16
                archive.writestr(info,data)
        with ZipFile(temp) as archive:
            if set(archive.namelist())!=set(content) or len(archive.infolist())!=len(content) or archive.testzip():
                raise ValueError('ZIP entry validation failed')
            for info in archive.infolist():
                if info.comment or info.extra or archive.read(info)!=content[info.filename]:
                    raise ValueError('ZIP content or metadata mismatch')
        os.replace(temp,release/filename)
    finally:
        if os.path.exists(temp): os.unlink(temp)

zip_package('Hestia-Studio-Source.zip',entries(source_files,True))
theme_entries=entries(theme_files)
zip_package('Hestia-Studio-Theme.zip',theme_entries)
fd,temp=tempfile.mkstemp(prefix='studio-',suffix='.tar.gz',dir=release)
os.close(fd)
try:
    with tarfile.open(temp,'w:gz',format=tarfile.USTAR_FORMAT) as archive:
        for name,data in theme_entries.items():
            info=tarfile.TarInfo(name)
            info.size=len(data)
            info.mode=0o644
            info.uid=info.gid=0
            info.uname=info.gname=''
            info.mtime=0
            archive.addfile(info,io.BytesIO(data))
    with tarfile.open(temp,'r:gz') as archive:
        members=archive.getmembers()
        if len(members)!=len(theme_entries) or {x.name for x in members}!=set(theme_entries):
            raise ValueError('TAR entry validation failed')
        for info in members:
            if not info.isfile() or info.uid or info.gid or info.uname or info.gname or info.pax_headers:
                raise ValueError('Unexpected TAR metadata')
            if archive.extractfile(info).read()!=theme_entries[info.name]:
                raise ValueError('TAR content mismatch')
    os.replace(temp,release/'Hestia-Studio-Theme.tar.gz')
finally:
    if os.path.exists(temp): os.unlink(temp)

assets=[x for x in theme_files if x.startswith('theme/')]
if len(assets)!=46: raise ValueError('Expected exactly 46 installable theme assets')
names=['Hestia-Studio-Source.zip','Hestia-Studio-Theme.zip','Hestia-Studio-Theme.tar.gz','Hestia-Studio-Preview.html']
(release/'SHA256SUMS.txt').write_text(''.join(hashlib.sha256((release/name).read_bytes()).hexdigest()+'  '+name+'\n' for name in names),encoding='utf-8')
print(f'Created and verified {len(source_files)} source files, {len(assets)} installable assets, archive metadata, and SHA256SUMS.txt.')
