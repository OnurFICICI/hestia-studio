/* Fictional, in-memory interactions. Never shipped to the live panel. */
(()=>{
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const defaults = type => window.STUDIO_FIELD_DEFAULTS(window.STUDIO_FORMS[type]?.groups||[]);
  const entities = {
    sites:['Web siteleri','Web sitesi ekle','globe'],mail:['E-posta alan adları','Alan adı ekle','mail'],mailAccounts:['Posta hesapları','Posta hesabı ekle','mail'],dns:['DNS bölgeleri','DNS bölgesi ekle','dns'],dnsRecords:['DNS kayıtları','DNS kaydı ekle','dns'],databases:['Veritabanları','Veritabanı ekle','database'],cron:['Zamanlanmış görevler','Görev ekle','clock'],users:['Kullanıcılar','Kullanıcı ekle','users'],packages:['Paketler','Paket ekle','backup'],firewall:['Güvenlik duvarı','Kural ekle','shield'],ipsets:['IP listeleri','IP listesi ekle','shield'],bans:['Engellenen IP adresleri','IP engelle','shield'],ips:['IP adresleri','IP adresi ekle','dns'],sshKeys:['SSH anahtarları','SSH anahtarı ekle','terminal'],accessKeys:['API erişim anahtarları','Erişim kaydı ekle','code'],files:['Dosya yöneticisi','Dosya oluştur','folder'],ftp:['FTP hesapları','FTP hesabı ekle','folder'],apps:['Uygulamalar','Uygulama kur','grid'],backups:['Yedekler','Yedek oluştur','backup'],server:['Sunucu servisleri','','server'],logs:['İşlem günlüğü','','clock'],stats:['İstatistikler','','activity']
  };
  const nav = [
    ['overview','Genel bakış','grid','workspace'],...['sites','mail','dns','databases','files','cron','backups','stats'].map(id=>[id,entities[id][0],entities[id][2],'workspace']),
    ...['users','packages','server','firewall','ips'].map(id=>[id,entities[id][0],entities[id][2],'admin']),['settings','Sunucu ayarları','settings','admin'],
    ['account','Hesabım','users','account'],...['sshKeys','accessKeys','logs'].map(id=>[id,entities[id][0],entities[id][2],'account'])
  ].map(([id,name,icon,group])=>({id,name,icon,group}));
  function fixtures(base){
    const data=clone(base);
    for(const [type,list] of Object.entries(data)) if(window.STUDIO_FORMS[type]) data[type]=list.map(row=>({...defaults(type),owner:'demo-user',...row}));
    data.users=[{...defaults('users'),id:71,name:'demo-admin',contact:'Demo Admin',email:'admin@example.com',role:'Yönetici',package:'default',status:'Aktif',protected:true,disk:'1.2 GB'},
      {...defaults('users'),id:72,name:'demo-user',contact:'Demo Kullanıcı',email:'hello@example.com',role:'Kullanıcı',package:'hosting',status:'Aktif',disk:'6.4 GB'}];
    data.packages=[{...defaults('packages'),id:91,name:'default',protected:true,status:'Aktif'}, {...defaults('packages'),id:92,name:'hosting',quota:20480,bandwidth:204800,webDomains:20,status:'Aktif'}];
    data.mail=[{...defaults('mail'),id:11,name:'example.com',owner:'demo-user',status:'Aktif',ssl:true},{...defaults('mail'),id:12,name:'shop.example.com',owner:'demo-user',status:'Aktif',ssl:true}];
    data.mailAccounts=[{...defaults('mailAccounts'),id:111,parentId:11,name:'hello',owner:'demo-user',used:'128 MB',status:'Aktif'},{...defaults('mailAccounts'),id:112,parentId:11,name:'support',owner:'demo-user',used:'346 MB',quota:2048,status:'Aktif'},{...defaults('mailAccounts'),id:113,parentId:12,name:'orders',owner:'demo-user',used:'82 MB',status:'Aktif'}];
    data.dns=data.dns.map(r=>({...r,detail:undefined}));
    data.dnsRecords=[{...defaults('dnsRecords'),id:211,parentId:21,name:'@',type:'A',value:'192.0.2.10',owner:'demo-user',status:'Aktif'},{...defaults('dnsRecords'),id:212,parentId:21,name:'www',type:'CNAME',value:'example.com.',owner:'demo-user',status:'Aktif'},{...defaults('dnsRecords'),id:213,parentId:21,name:'@',type:'MX',value:'mail.example.com.',priority:10,owner:'demo-user',status:'Aktif'},{...defaults('dnsRecords'),id:214,parentId:22,name:'@',type:'A',value:'192.0.2.10',owner:'demo-user',status:'Aktif'}];
    data.databases=data.databases.map(r=>({...r,username:r.name,type:'MariaDB',charset:'utf8mb4'}));
    const schedules=[['0','3','*','*','*'],['*/5','*','*','*','*'],['0','8','*','*','1']];
    data.cron=data.cron.map((r,i)=>({...r,...Object.fromEntries(['minute','hour','day','month','weekday'].map((k,n)=>[k,schedules[i][n]])),command:'/usr/bin/php /home/demo/web/example.com/public_html/cron.php'}));
    data.firewall=data.firewall.map((r,i)=>({...r,action:'ACCEPT',protocol:'TCP',port:['443','80','22'][i],ip:i===2?'192.0.2.0/24':'0.0.0.0/0'}));
    data.ipsets=[{...defaults('ipsets'),id:301,name:'trusted',source:'192.0.2.0/24',version:'IPv4',status:'Aktif'}];
    data.bans=[{...defaults('bans'),id:311,name:'192.0.2.123',jail:'sshd',reason:'Örnek başarısız girişler',status:'Engelli'}];
    data.ips=[{...defaults('ips'),id:321,name:'192.0.2.10',owner:'demo-admin',shared:true,status:'Aktif'}];
    data.sshKeys=[{id:331,name:'Demo workstation',publicKey:'ssh-ed25519 DEMO-PUBLIC-KEY-PLACEHOLDER',owner:'demo-admin',status:'Örnek'}];
    data.accessKeys=[{id:341,name:'Salt okunur raporlama',permissions:'list',owner:'demo-admin',status:'Örnek'}];
    data.files=data.files.map(r=>({...r,kind:r.detail==='Klasör'?'Klasör':'Dosya',permissions:r.status,status:'Aktif',path:'/',content:r.name==='index.html'?'<!doctype html>\n<title>Example</title>\n<h1>Merhaba!</h1>':''}));
    data.files.push({...defaults('files'),id:84,name:'index.php',kind:'Dosya',path:'/public_html/',permissions:'0644',content:'<?php echo "Example";',owner:'demo-user',status:'Aktif'});
    data.ftp=[{...defaults('ftp'),id:351,name:'demo_deploy',parentId:1,owner:'demo-user',status:'Aktif'}];data.apps=[];
    data.server=data.services.map((r,i)=>({...r,id:361+i,status:'Çalışıyor',memory:['46 MB','182 MB','356 MB','68 MB'][i],uptime:'28 gün',content:'# '+r.name+' — örnek yapılandırma\n# Önizlemede servis çalıştırılmaz.'}));
    data.logs=[{id:371,name:'Yedek oluşturuldu',detail:'demo-user · demo.2026-01-24.tar',value:'12:30',status:'Başarılı'},{id:372,name:'Oturum açıldı',detail:'demo-admin · 192.0.2.10',value:'12:24',status:'Başarılı'}];
    data.backups=data.backups.map(r=>({...r,owner:'demo-user'}));
    return data;
  }
  function settings(){
    const state=Object.fromEntries(window.STUDIO_SETTINGS.map(s=>[s.id,window.STUDIO_FIELD_DEFAULTS(s.groups)]));
    Object.assign(state.general,{hostname:'server.example.com',timezone:'Etc/UTC',theme:'studio',language:'Türkçe'});
    Object.assign(state.web,{phpDefault:'8.3',php83:true,php84:true});Object.assign(state.dns,{dnsServer:'BIND9'});
    Object.assign(state.mail,{mailServer:'Exim + Dovecot',antivirusService:'ClamAV',spamService:'SpamAssassin',webmailAlias:'webmail'});
    Object.assign(state.databases,{mysqlHost:'localhost',pmaAlias:'phpmyadmin',pmaSSO:true});
    Object.assign(state.backup,{localBackup:true,backupDirectory:'/backup'});
    Object.assign(state.ssl,{certificateHost:'server.example.com',issuer:'Örnek sertifika'});
    Object.assign(state.security,{apiAccess:'Yalnızca yöneticiler',passwordReset:true,sessionTimeout:60,csrf:'Etkin',protectAdmin:true});
    Object.assign(state.policies,{editDetails:true,viewLogs:true,enforceOwnership:true});Object.assign(state.plugins,{appInstaller:true,fileManager:true,resources:true,diskQuota:true,firewall:true});
    Object.assign(state.updates,{version:'1.10.9',release:'Kararlı',automaticUpdates:true,updateEmail:true});
    Object.assign(state.branding,{appName:'Hestia Control Panel',pageTitle:'Hestia Control Panel',senderName:'Hestia',senderEmail:'panel@example.com'});
    return state;
  }
  const ipv4=v=>/^(?:\d{1,3}\.){3}\d{1,3}$/.test(v)&&v.split('.').every(n=>+n<=255);
  const ipv6=v=>{if(!v.includes(':')||!/^[\da-f:]+$/i.test(v))return false;const groups=v.split(':');return v.includes('::')?v.indexOf('::')===v.lastIndexOf('::')&&groups.length<=9&&groups.filter(Boolean).length<8&&groups.every(g=>g.length<=4):groups.length===8&&groups.every(g=>g.length>=1&&g.length<=4)};
  const ip=v=>ipv4(v)||ipv6(v);
  const cidr=v=>{const [addr,prefix,...rest]=v.split('/');return !rest.length&&ip(addr)&&(prefix===undefined||/^\d+$/.test(prefix)&&+prefix<=(ipv4(addr)?32:128))};
  const domain=v=>/^(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d-]{2,63}$/i.test(v)&&v.length<=253;
  const email=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const list=(v,fn)=>v.split(/[\s,]+/).filter(Boolean).every(fn);
  function cronValid(value,key){const [min,max]={minute:[0,59],hour:[0,23],day:[1,31],month:[1,12],weekday:[0,7]}[key]||[0,59];return value.split(',').every(part=>{const m=part.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);if(!m||m[2]&&(+m[2]<1||+m[2]>max+1))return false;if(m[1]==='*')return true;const n=m[1].split('-').map(Number);return n.every(x=>x>=min&&x<=max)&&(n.length===1||n[0]<=n[1])})}
  const validators={domain,domains:v=>list(v,domain),ip,cidr,iplist:v=>list(v,cidr),emails:v=>list(v,email),username:v=>/^[a-z][a-z\d_-]{0,31}$/i.test(v),mailbox:v=>/^[a-z\d._+-]+$/i.test(v),dbname:v=>/^[a-z\d_]{1,64}$/i.test(v),url:v=>{try{return ['http:','https:'].includes(new URL(v).protocol)}catch{return false}},ports:v=>v.split(',').every(p=>{if(!/^\d+(?::\d+)?$/.test(p))return false;let n=p.split(':').map(Number);return n.every(x=>x<=65535)&&(n.length===1||n[0]<=n[1])}),ssh:v=>/^(ssh-ed25519|ssh-rsa|ecdsa-sha2-\S+) [A-Za-z\d+/=]+(?: .*)?$/.test(v),filename:v=>!/[\\/\x00-\x1f]/.test(v)&&!['.','..'].includes(v),permissions:v=>/^0?[0-7]{3}$/.test(v)};
  window.extendStudio=app=>{
    const originalInit=app.init;
    return Object.defineProperties(app,Object.getOwnPropertyDescriptors({
      nav,context:null,filePath:'/',selected:[],editor:{},editId:null,editType:'sites',errors:{},pending:null,detailType:'sites',settingsTab:'general',settingsSaved:settings(),settingsDraft:settings(),settingsErrors:{},accountDraft:{},accountErrors:{},exclusions:defaults('exclusions'),
      isMobile:false,
      init(){this.demo=fixtures(window.STUDIO_DEMO);this.accountDraft=clone(this.demo.users[0]);originalInit.call(this);const media=window.matchMedia?.('(max-width:760px)');if(media){this.isMobile=media.matches;media.addEventListener('change',e=>{this.isMobile=e.matches;if(!e.matches)this.mobile=false});this.$watch('mobile',open=>{if(open)this.$nextTick(()=>document.querySelector('.mobile-side-close')?.focus())})}},
      get resource(){return this.context?.type||this.page},
      get title(){return this.context?entities[this.context.type][0]:this.nav.find(n=>n.id===this.page)?.name||'Genel bakış'},
      get currentIcon(){return entities[this.resource]?.[2]||this.nav.find(n=>n.id===this.page)?.icon||'settings'},
      get subtitle(){return this.context?this.context.name+' için yönetim':{overview:'Sunucunuzun bugünkü durumuna bir göz atın.',users:'Hesaplar, yetkiler ve hosting paketleri.',packages:'Kaynak kotaları, servis limitleri ve varsayılanlar.',settings:'Sunucunuzun tüm yapılandırması, düzenli bir çalışma alanında.',account:'Profiliniz, oturum güvenliğiniz ve kişisel tercihleriniz.',mail:'Önce alan adınızı, ardından posta hesaplarınızı yönetin.',dns:'DNS bölgeleri, kayıtlar ve DNSSEC tercihleri.',server:'Servislerin durumu ve yapılandırma dosyaları.',backups:'Yedek arşivleri, geri yükleme ve hariç tutulan içerikler.',files:'Örnek dosyaları ve klasörleri inceleyin.',stats:'Örnek kaynak kullanımı ve hesap kotaları.'}[this.page]||'Kayıtlarınızı görüntüleyin, ekleyin ve düzenleyin.'},
      get addLabel(){return entities[this.page==='overview'?'sites':this.resource]?.[1]||''},
      get canAdd(){return !!this.addLabel},
      get isResource(){return !['overview','settings','account','stats'].includes(this.page)},
      get sourceRows(){let rows=this.demo[this.resource]||[];if(this.context?.parentId!==undefined)rows=rows.filter(r=>r.parentId===this.context.parentId);if(this.resource==='files')rows=rows.filter(r=>(r.path||'/')===this.filePath);return rows},
      get rows(){const needle=this.query.toLocaleLowerCase('tr');return this.sourceRows.filter(r=>Object.values(r).filter(v=>typeof v==='string').join(' ').toLocaleLowerCase('tr').includes(needle)&&(this.filter==='Tümü'||r.status===this.filter))},
      get columns(){return {users:['KULLANICI','ROL / PAKET','KULLANIM'],packages:['PAKET','WEB / DNS / E-POSTA','DİSK / TRAFİK'],sites:['ALAN ADI','PHP / SSL','DİSK / TRAFİK'],mail:['ALAN ADI','POSTA HESAPLARI','GÜVENLİK'],mailAccounts:['POSTA HESABI','KOTA','YÖNLENDİRME'],dns:['DNS BÖLGESİ','KAYITLAR','TTL / DNSSEC'],dnsRecords:['KAYIT','TÜR / ÖNCELİK','DEĞER'],databases:['VERİTABANI','TÜR / KULLANICI','BOYUT'],cron:['GÖREV','ZAMANLAMA','KOMUT'],firewall:['KURAL','PROTOKOL / PORT','KAYNAK'],ips:['IP ADRESİ','ARAYÜZ / MASKE','ATAMA'],server:['SERVİS','BELLEK','ÇALIŞMA SÜRESİ'],files:['DOSYA','TÜR / İZİNLER','BOYUT'],accessKeys:['AÇIKLAMA','İZİN PROFİLİ','KAPSAM'],sshKeys:['AÇIKLAMA','TÜR','KAPSAM']}[this.resource]||['AD','AYRINTI','DEĞER']},
      rowDescription(r,type=this.resource){return {users:r.contact+' · '+r.email,sites:r.owner,mail:'Webmail: '+r.webmail,dns:r.soa,mailAccounts:this.context?.name,dnsRecords:'TTL '+r.ttl,packages:'Hosting kaynak planı',files:r.path||'/',server:r.detail}[type]||''},
      rowInfo(r,type=this.resource){switch(type){case'users':return [r.role+' · '+r.package,r.disk||'0 MB'];case'packages':return [r.webDomains+' / '+r.dnsDomains+' / '+r.mailDomains,r.quota+' MB / '+r.bandwidth+' MB'];case'sites':return ['PHP '+r.php+' · SSL '+(r.ssl?'açık':'kapalı'),r.disk+' / '+r.traffic];case'mail':return [this.demo.mailAccounts.filter(x=>x.parentId===r.id).length+' hesap',[r.dkim?'DKIM':'',r.antispam?'Antispam':'',r.antivirus?'AV':''].filter(Boolean).join(' · ')||'Kapalı'];case'mailAccounts':return [(r.used||'0 MB')+' / '+r.quota+' MB',r.forward||'—'];case'dns':return [this.demo.dnsRecords.filter(x=>x.parentId===r.id).length+' kayıt',r.ttl+' sn · '+(r.dnssec?'DNSSEC açık':'DNSSEC kapalı')];case'dnsRecords':return [r.type+(r.type==='MX'?' · '+r.priority:''),r.value];case'databases':return [r.type+' · '+r.username,r.value||'0 MB'];case'cron':return [[r.minute,r.hour,r.day,r.month,r.weekday].join(' '),r.command];case'firewall':return [r.protocol+' · '+r.port,r.ip];case'ips':return [r.networkInterface+' · '+r.netmask,r.shared?'Paylaşılan':r.owner];case'files':return [r.kind+' · '+r.permissions,r.value||(r.kind==='Klasör'?'Klasör':r.content.length+' karakter')];case'server':return [r.memory,r.uptime];case'accessKeys':return [r.permissions,'Geçerli anahtar içermez'];case'sshKeys':return [r.publicKey.split(' ')[0],'Genel anahtar'];case'ftp':return [r.path,r.email||'—'];case'ipsets':return [r.version,r.source];case'bans':return [r.jail,r.reason||'—'];default:return [r.detail||r.title||'—',r.value||'—']}},
      go(id){this.close();this.page=id;this.context=null;this.selected=[];this.query='';this.filter='Tümü';this.filePath='/';document.title=this.title+' · Hestia Studio';window.scrollTo({top:0,behavior:'smooth'});},
      openChildren(type,row){this.closeDetail();this.page={mailAccounts:'mail',dnsRecords:'dns',ftp:'sites',apps:'sites'}[type]||this.page;this.context={type,parentId:row.id,name:row.name};this.query='';this.filter='Tümü';this.selected=[];},
      section(type){this.context=type===this.page?null:{type,name:'Güvenlik duvarı'};this.selected=[];this.query='';this.filter='Tümü';},
      back(){this.context=null;this.selected=[];this.query='';this.filter='Tümü'},
      enterFolder(row){this.closeDetail();this.filePath+=row.name+'/';this.selected=[];this.query='';},
      parentFolder(){this.filePath=this.filePath.replace(/[^/]+\/$/,'');this.selected=[];this.query='';},
      get formSchema(){return window.STUDIO_FORMS[this.editType]||{title:'Kayıt',groups:[]}},
      get editorTitle(){return this.formSchema.title+(this.editId!==null?' düzenle':' ekle')},
      get activeSetting(){return window.STUDIO_SETTINGS.find(s=>s.id===this.settingsTab)},
      get settingsSections(){return window.STUDIO_SETTINGS},
      get settingsDirty(){return JSON.stringify(this.settingsDraft[this.settingsTab])!==JSON.stringify(this.settingsSaved[this.settingsTab])},
      get settingsDirtyCount(){return window.STUDIO_SETTINGS.filter(s=>JSON.stringify(this.settingsDraft[s.id])!==JSON.stringify(this.settingsSaved[s.id])).length},
      get accountGroups(){return window.STUDIO_FORMS.users.groups.map(g=>({...g,fields:g.fields.filter(f=>!['name','role','package','welcome','loginDisabled'].includes(f.key))}))},
      visible(field,values,editing=false){return !(field.createOnly&&editing)&&(!field.when||(field.when==='manualSSL'?values.ssl&&!values.letsencrypt:field.when==='backblaze'?values.remoteBackup&&values.backupProtocol==='Backblaze B2':field.when==='remoteHost'?values.remoteBackup&&values.backupProtocol!=='Backblaze B2':field.when==='remoteLogin'?values.remoteBackup&&['FTP','SFTP'].includes(values.backupProtocol):!!values[field.when]))},
      options(field){return field.source?(this.demo[field.source]||[]).filter(r=>r.status!=='Askıda').map(r=>r.name):field.options||[]},
      onField(field,values){if(field.key==='preset'){const preset={'Her 5 dakika':['*/5','*','*','*','*'],'Saat başı':['0','*','*','*','*'],'Her gün 03:00':['0','3','*','*','*'],'Her pazar 08:00':['0','8','*','*','0']}[values.preset];if(preset)['minute','hour','day','month','weekday'].forEach((k,i)=>values[k]=preset[i])}},
      openModal(type){this.profileOpen=false;this.notifications=false;if(type==='add'){this.editRecord(this.page==='overview'?'sites':this.resource);return}this.modal=type;this.command='';this.focusModal()},
      focusModal(){this.$nextTick(()=>{const el=this.$refs?.modal;Array.from(el?.querySelectorAll('input,select,textarea,button')||[]).find(n=>n.getClientRects().length&&!n.disabled)?.focus()})},
      editRecord(type,row=null){this.closeDetail();this.editType=type;this.editId=row?.id??null;this.editor={...defaults(type),...(row?clone(row):{})};this.formSchema.groups.flatMap(g=>g.fields).filter(f=>f.secret).forEach(f=>this.editor[f.key]='');this.errors={};this.modal='editor';this.focusModal()},
      validate(groups,values,editing=false){const errors={};for(const f of groups.flatMap(g=>g.fields)){if(f.readonly||!this.visible(f,values,editing))continue;const v=String(values[f.key]??'').trim();if((f.required||f.key==='password'&&!editing)&&!v){errors[f.key]='Bu alanı doldurun.';continue}if(!v||f.unlimited&&v==="unlimited")continue;if(f.type==='number'&&( !Number.isFinite(Number(v))||!Number.isInteger(+v)||+v<(f.min??0)||f.max!==undefined&&+v>f.max))errors[f.key]='Geçerli aralıkta bir tam sayı girin.';if(f.type==='email'&&!email(v)||f.validate==='cron'&&!cronValid(v,f.key)||validators[f.validate]&&!validators[f.validate](v))errors[f.key]='Geçerli bir değer girin.';if(f.source&&!this.options(f).includes(v))errors[f.key]='Listeden geçerli bir seçenek belirleyin.';if(f.key==='password'&&v.length<8)errors[f.key]='En az 8 karakter kullanın.';}return errors},
      clean(groups,values){const result=clone(values);groups.flatMap(g=>g.fields).forEach(f=>{if(f.secret)delete result[f.key];else if(typeof result[f.key]==='string')result[f.key]=result[f.key].trim()});return result},
      focusError(scope){this.$nextTick(()=>{const field=document.querySelector(scope+' [aria-invalid="true"]');field?.closest('details')?.setAttribute('open','');field?.focus()})},
      saveRecord(){
        const type=this.editType,groups=this.formSchema.groups;this.errors=this.validate(groups,this.editor,this.editId!==null);
        const value=this.clean(groups,this.editor);if(['sites','mail','dns'].includes(type))value.name=value.name.toLowerCase();
        if(type==='databases'){for(const k of ['name','username'])if(!value[k].startsWith('demo_'))value[k]='demo_'+value[k]}
        const existing=(this.demo[type]||[]).find(r=>r.id===this.editId);
        if(existing)groups.flatMap(g=>g.fields).filter(f=>f.immutable).forEach(f=>value[f.key]=existing[f.key]);
        const parentId=existing?.parentId??this.context?.parentId;
        if(this.demo[type]?.some(r=>r.id!==this.editId&&r.name.toLowerCase()===value.name?.toLowerCase()&&(type==='dnsRecords'?r.parentId===parentId&&r.type===value.type&&r.value===value.value:['mailAccounts','ftp','apps'].includes(type)?r.parentId===parentId:type==='files'?r.path===this.filePath:true)))this.errors.name='Bu kayıt zaten var.';
        if(type==='dnsRecords'&&((value.type==='A'&&!ipv4(value.value))||(value.type==='AAAA'&&!ipv6(value.value))))this.errors.value='Kayıt türüne uygun bir IP adresi girin.';
        if(type==='users'&&existing?.protected&&(value.role!=='Yönetici'||value.loginDisabled))this.errors.role='Ana yöneticinin yetkileri ve girişi korunur.';
        if(type==='restore'&&!Object.values(value).some(Boolean))this.errors._form='Geri yüklenecek en az bir bölüm seçin.';
        if(Object.keys(this.errors).length){this.focusError('#record-editor');return false}
        if(type==='exclusions'){this.exclusions=value;this.log('Yedekleme istisnaları güncellendi','Örnek hesap');}
        else if(type==='restore'){this.log('Geri yükleme simüle edildi',this.restoreName+' · '+Object.keys(value).filter(k=>value[k]).join(', '));}
        else if(type==='serviceConfig'){const service=this.demo.server.find(r=>r.id===this.serviceId);if(service)service.content=value.content;this.log('Servis ayarları güncellendi','Örnek yapılandırma');}
        else {
          const record={...(existing||{id:this.nextId(),status:'Aktif',owner:'demo-user'}),...value};if(parentId!==undefined){record.parentId=parentId;const parentType={mailAccounts:'mail',dnsRecords:'dns',ftp:'sites',apps:'sites'}[type];if(parentType)record.owner=this.demo[parentType].find(r=>r.id===parentId)?.owner||record.owner;}
          if(type==='files')record.path=existing?.path||this.filePath;
          if(type==='sites'){Object.assign(record,{stack:'PHP '+value.php,disk:existing?.disk||'0 MB',traffic:existing?.traffic||'0 MB',color:existing?.color||'green',letter:value.name[0].toUpperCase()});if(!existing){for(const [flag,target]of [['createDns','dns'],['createMail','mail']])if(value[flag]&&!this.demo[target].some(r=>r.name===value.name))this.demo[target].push({...defaults(target),id:this.nextId(),name:value.name,owner:record.owner,status:'Aktif'});}}
          if(type==='firewall')record.status=value.action==='ACCEPT'?'İzin ver':'Engelli';if(type==='bans')record.status='Engelli';
          if(type==='sshKeys'||type==='accessKeys'){record.status='Örnek';record.owner='demo-admin'}
          if(type==='users')record.disk=existing?.disk||'0 MB';
          if(existing)this.demo[type].splice(this.demo[type].indexOf(existing),1,record);else this.demo[type].push(record);
          this.log(this.formSchema.title+(existing?' güncellendi':' eklendi'),record.name);
        }
        this.editor={};this.modal=null;this.notify(type==='restore'?'Geri yükleme önizlemede simüle edildi.':'Değişiklikler önizlemeye kaydedildi.');return true;
      },
      nextId(){this._nextId=(this._nextId||1000)+1;return this._nextId},
      log(name,detail){this.demo.logs.unshift({id:this.nextId(),name,detail,value:'Şimdi',status:'Başarılı'});this.demo.activity.unshift({title:name,detail,time:'Şimdi',icon:'check'});this.demo.activity=this.demo.activity.slice(0,8)},
      saveSettings(){this.settingsErrors=this.validate(this.activeSetting.groups,this.settingsDraft[this.settingsTab],true);if(Object.keys(this.settingsErrors).length){this.focusError('#settings-form');return false}this.settingsSaved[this.settingsTab]=this.clean(this.activeSetting.groups,this.settingsDraft[this.settingsTab]);this.settingsDraft[this.settingsTab]=clone(this.settingsSaved[this.settingsTab]);this.log('Sunucu ayarı güncellendi',this.activeSetting.name);this.notify(this.activeSetting.name+' ayarları önizlemeye kaydedildi.');return true},
      discardSettings(){this.settingsDraft[this.settingsTab]=clone(this.settingsSaved[this.settingsTab]);this.settingsErrors={}},
      changeSettings(id){this.settingsTab=id;this.settingsErrors={}},
      saveAccount(){this.accountErrors=this.validate(this.accountGroups,this.accountDraft,true);if(Object.keys(this.accountErrors).length){this.focusError('#account-form');return false}const i=this.demo.users.findIndex(u=>u.id===71);this.demo.users[i]={...this.demo.users[i],...this.clean(this.accountGroups,this.accountDraft)};this.accountDraft=clone(this.demo.users[i]);this.notify('Hesap tercihleri önizlemeye kaydedildi.');return true},
      openDetail(row,type=this.resource){this.detailType=type;this.detail=row;this.$nextTick(()=>this.$refs?.detail?.querySelector('button')?.focus())},
      closeDetail(){this.detail=null},
      get detailPairs(){if(!this.detail)return [];const r=this.detail;const schema=window.STUDIO_FORMS[this.detailType];return (schema?.groups.flatMap(g=>g.fields)||[]).filter(f=>!f.secret&&this.visible(f,r,true)&&r[f.key]!==undefined&&r[f.key]!==''&&f.key!=='content').map(f=>[f.label,typeof r[f.key]==='boolean'?(r[f.key]?'Etkin':'Kapalı'):r[f.key]])},
      get canEditDetail(){return !!window.STUDIO_FORMS[this.detailType]},
      get canSuspendDetail(){return ['users','sites','mail','mailAccounts','dns','dnsRecords','databases','cron'].includes(this.detailType)&&!this.detail?.protected},
      get canDeleteDetail(){return !['server','logs'].includes(this.detailType)&&!this.detail?.protected},
      requestAction(action,rows,type=this.resource){const ids=rows.map(r=>r.id);this.pending={action,ids,type,names:rows.map(r=>r.name).join(', ')};this.closeDetail();this.modal='confirm';this.focusModal()},
      confirmAction(){const {action,ids,type}=this.pending;let affected=(this.demo[type]||[]).filter(r=>ids.includes(r.id));let skipped=0;for(const r of affected){if(r.protected||type==='packages'&&this.demo.users.some(u=>u.package===r.name)){skipped++;continue}if(action==='delete'){this.demo[type]=this.demo[type].filter(x=>x.id!==r.id);const child={mail:['mailAccounts'],dns:['dnsRecords'],sites:['ftp','apps']}[type]||[];child.forEach(k=>this.demo[k]=this.demo[k].filter(x=>x.parentId!==r.id));if(type==='files'&&r.kind==='Klasör'){const prefix=(r.path||'/')+r.name+'/';this.demo.files=this.demo.files.filter(x=>!x.path?.startsWith(prefix));}if(type==='users')for(const [k,list]of Object.entries(this.demo))if(Array.isArray(list)&&k!=='users')this.demo[k]=list.filter(x=>x.owner!==r.name)}else if(action==='restart'){r.status='Çalışıyor';r.uptime='Az önce'}else if(action==='stop'){r.status='Durduruldu'}else if(action==='start'){r.status='Çalışıyor';r.uptime='Az önce'}else r.status=action==='suspend'?'Askıda':'Aktif';}
        this.log('Toplu işlem: '+this.actionLabel(action),`${affected.length-skipped} kayıt`);this.modal=null;this.pending=null;this.selected=[];this.notify(skipped?'Korunan veya kullanımda olan '+skipped+' kayıt atlandı.':'İşlem önizlemede tamamlandı.');},
      actionLabel(action){return {delete:'Sil',suspend:'Askıya al',activate:'Etkinleştir',restart:'Yeniden başlat',stop:'Durdur',start:'Başlat'}[action]||action},
      toggleSelected(row){this.selected=this.selected.includes(row.id)?this.selected.filter(id=>id!==row.id):[...this.selected,row.id]},
      toggleAll(){const ids=this.rows.filter(r=>!r.protected).map(r=>r.id);this.selected=ids.every(id=>this.selected.includes(id))?[]:ids},
      bulk(action){this.requestAction(action,this.sourceRows.filter(r=>this.selected.includes(r.id)))},
      backup(){this.demo.backups.unshift({id:this.nextId(),owner:'demo-user',name:'demo.preview-'+(this.demo.backups.length+1)+'.tar',detail:'Tam yedek · Yerel depolama',value:'6.42 GB',status:'Tamamlandı'});this.log('Yedek oluşturma simüle edildi','Örnek hesap');this.notify('Örnek yedek kaydı oluşturuldu.');},
      restore(row){this.restoreName=row.name;this.editRecord('restore')},
      configureService(row){this.serviceId=row.id;this.editRecord('serviceConfig',{id:row.id,content:row.content})},
      close(){const wasMobile=this.mobile;this.modal=null;this.detail=null;this.editor={};this.pending=null;this.notifications=false;this.mobile=false;this.profileOpen=false;if(wasMobile)this.$nextTick(()=>this.$refs?.mobileTrigger?.focus())},
      resetPreview(){this.close();this.demo=fixtures(window.STUDIO_DEMO);this.settingsSaved=settings();this.settingsDraft=settings();this.settingsTab='general';this.settingsErrors={};this.accountDraft=clone(this.demo.users[0]);this.accountErrors={};this.exclusions=defaults('exclusions');this.go('overview');this.notify('Örnek çalışma alanı sıfırlandı.')},
      downloadReport(){const safe={notice:'Fictional demonstration data. Not a server report.',users:this.demo.users.map(({name,role,package:plan,status})=>({name,role,package:plan,status})),sites:this.demo.sites.map(({name,status,ssl,disk,traffic})=>({name,status,ssl,disk,traffic})),counts:Object.fromEntries(Object.entries(this.demo).filter(([,v])=>Array.isArray(v)).map(([k,v])=>[k,v.length]))};const url=URL.createObjectURL(new Blob([JSON.stringify(safe,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='hestia-studio-demo-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);this.notify('Örnek rapor indirildi.');}
    }));
  };
})();
