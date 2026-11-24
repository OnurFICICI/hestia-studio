/* Fictional preview fixtures. Never installed into HestiaCP. */
window.STUDIO_DEMO = {
  sites: [
    {id:1,name:'example.com',kind:'Kurumsal web sitesi',stack:'PHP 8.3',disk:'1.24 GB',traffic:'24.8 GB',status:'Aktif',ssl:true,color:'green',letter:'E'},
    {id:2,name:'shop.example.com',kind:'E-ticaret',stack:'PHP 8.3',disk:'3.82 GB',traffic:'68.2 GB',status:'Aktif',ssl:true,color:'purple',letter:'S'},
    {id:3,name:'docs.example.org',kind:'Dokümantasyon',stack:'Statik',disk:'420 MB',traffic:'12.4 GB',status:'Aktif',ssl:true,color:'blue',letter:'D'},
    {id:4,name:'staging.example.net',kind:'Geliştirme ortamı',stack:'PHP 8.2',disk:'860 MB',traffic:'2.1 GB',status:'Askıda',ssl:false,color:'orange',letter:'S'}
  ],
  mail:[{id:11,name:'hello@example.com',detail:'example.com',value:'128 MB / 1 GB',status:'Aktif'},{id:12,name:'support@example.com',detail:'example.com',value:'346 MB / 2 GB',status:'Aktif'},{id:13,name:'orders@shop.example.com',detail:'shop.example.com',value:'82 MB / 1 GB',status:'Aktif'}],
  dns:[{id:21,name:'example.com',detail:'A · 192.0.2.10',value:'TTL 3600',status:'Aktif'},{id:22,name:'shop.example.com',detail:'CNAME · example.com',value:'TTL 3600',status:'Aktif'},{id:23,name:'example.org',detail:'MX · mail.example.org',value:'Öncelik 10',status:'Aktif'}],
  databases:[{id:31,name:'demo_website',detail:'MariaDB · localhost',value:'248 MB',status:'Aktif'},{id:32,name:'demo_store',detail:'MariaDB · localhost',value:'1.12 GB',status:'Aktif'},{id:33,name:'demo_staging',detail:'MariaDB · localhost',value:'96 MB',status:'Aktif'}],
  cron:[{id:41,name:'Günlük bakım',detail:'0 3 * * *',value:'Her gün 03:00',status:'Aktif'},{id:42,name:'Kuyruk kontrolü',detail:'*/5 * * * *',value:'Her 5 dakika',status:'Aktif'},{id:43,name:'Haftalık rapor',detail:'0 8 * * 1',value:'Pazartesi 08:00',status:'Askıda'}],
  backups:[{id:51,name:'demo.2026-01-24.tar',detail:'Tam yedek · Yerel depolama',value:'6.42 GB',status:'Tamamlandı'},{id:52,name:'demo.2026-01-23.tar',detail:'Tam yedek · Yerel depolama',value:'6.38 GB',status:'Tamamlandı'},{id:53,name:'demo.2026-01-22.tar',detail:'Tam yedek · Yerel depolama',value:'6.35 GB',status:'Tamamlandı'}],
  firewall:[{id:61,name:'HTTPS',detail:'TCP · 443',value:'Tüm kaynaklar',status:'İzin ver'},{id:62,name:'HTTP',detail:'TCP · 80',value:'Tüm kaynaklar',status:'İzin ver'},{id:63,name:'SSH',detail:'TCP · 22',value:'192.0.2.0/24',status:'İzin ver'}],
  users:[{id:71,name:'demo-admin',detail:'Yönetici',value:'Standart paket',status:'Aktif'},{id:72,name:'demo-user',detail:'Kullanıcı',value:'Web hosting',status:'Aktif'}],
  files:[{id:81,name:'public_html',detail:'Klasör',value:'4 öğe',status:'0755'},{id:82,name:'private',detail:'Klasör',value:'2 öğe',status:'0750'},{id:83,name:'index.html',detail:'HTML belgesi',value:'12 KB',status:'0644'}],
  services:[{name:'Nginx',detail:'Web sunucusu',icon:'globe'},{name:'PHP-FPM',detail:'Uygulama sunucusu',icon:'code'},{name:'MariaDB',detail:'Veritabanı',icon:'database'},{name:'Exim / Dovecot',detail:'E-posta servisleri',icon:'mail'}],
  activity:[{title:'Otomatik yedek tamamlandı',detail:'6.42 GB · Yerel depolama',time:'12 dk önce',icon:'backup',color:'green'},{title:'SSL sertifikası yenilendi',detail:'example.com',time:'48 dk önce',icon:'shield',color:'blue'},{title:'Web sitesi eklendi',detail:'docs.example.org',time:'2 saat önce',icon:'globe',color:'purple'}]
};
