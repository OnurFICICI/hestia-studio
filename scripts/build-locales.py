"""Build complete theme dictionaries from official gettext catalogs and authored additions.
No translation network service is used. Source catalogs are GPL HestiaCP translations.
"""
from pathlib import Path
import gettext, json, sys
root=Path(__file__).resolve().parent.parent
reference=Path(sys.argv[1]) / 'web/locale'
locales=root/'theme/locales'
native={
 'accountSection':'Account','web':'Web Domains','mail':'Mail Domains','dns':'DNS Zones',
 'db':'Databases','cron':'Cron Jobs','backup':'Backups','users':'Users','packages':'Packages',
 'services':'Services','firewall':'Firewall','ip':'IP Addresses','settings':'Configure',
 'stats':'Statistics','rrd':'Task Monitor','updates':'Updates','keys':'Manage SSH Keys',
 'accessKeys':'Access Keys','logs':'Logs','files':'File manager','terminal':'Web terminal',
 'theme':'Theme','admin':'Administrator','user':'User','disk':'Disk','bandwidth':'Bandwidth',
 'cpu':'CPU','memory':'Memory','loadAverage':'Load Average','daily':'Daily',
 'weekly':'Weekly','monthly':'Monthly','refresh':'Refresh','loading':'Loading...'
}
custom=json.loads((root/'scripts/locale-additions.json').read_text(encoding='utf-8'))
names=json.loads((reference/'languages.json').read_text())
missing={}
for lang in [k for k in names if not k.endswith('_locale')]:
    catalog=gettext.NullTranslations() if lang=='en' else gettext.GNUTranslations((reference/lang/'LC_MESSAGES/hestiacp.mo').open('rb'))
    labels={'brand':'Hestia','brandSubtitle':'STUDIO','searchShortcut':'Ctrl K'}
    for key,source in native.items():
        labels[key]=catalog.gettext(source)
        if lang!='en' and source not in catalog._catalog and key not in custom.get(lang,{}):
            missing.setdefault(lang,{})[key]=source
    labels.update(custom[lang])
    labels['usersDescription']=' · '.join(labels[k] for k in ['users','packages'])
    labels['webDescription']=' · '.join(labels[k] for k in ['web','dns'])
    labels['settingsDescription']=' · '.join(labels[k] for k in ['settings','services','firewall'])
    labels['statsDescription']=' · '.join(labels[k] for k in ['bandwidth','disk','stats'])
    labels['servicesDescription']=' · '.join(labels[k] for k in ['services','settings'])
    labels['overviewDescription']=' · '.join(labels[k] for k in ['web','mail','db'])
    (locales/(lang+'.json')).write_text(json.dumps(labels,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(missing,ensure_ascii=False,indent=2))
if missing:sys.exit(1)
print('43 complete theme dictionaries generated.')
