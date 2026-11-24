<?php
// Render upstream VIEW files with fictional data. Never include controllers/main.php.
// Usage: php tests/render-native.php PATH_TO_OFFICIAL_SOURCE
error_reporting(E_ERROR); ini_set('display_errors', '1');
$reference = str_replace('\\', '/', $argv[1] ?? '');
$fixtureLanguage = $argv[2] ?? 'en';
if (!in_array($fixtureLanguage, ['en', 'tr', 'ar'], true)) { exit("Unsupported fixture locale\n"); }
if (!is_file($reference . '/web/templates/includes/panel.php')) { exit("Official Hestia source required\n"); }
define('DEFAULT_PHP_VERSION', '8.3');
function tohtml($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }
function show_alert_message($v) {}
function detect_user_language() { return 'en'; }
function ipUsed($v=null) { return false; }
function humanize_usage_size($v, $round=2) { return $v==='unlimited'?'∞':number_format((float)$v>1024?(float)$v/1024:(float)$v,$round); }
function humanize_usage_measure($v) { return $v==='unlimited'?'':((float)$v>1024?'gb':'mb'); }
function humanize_time($v) { return round((float)$v/60).' hours'; }
function translate_date($v) { return $v; }
if(!function_exists('_')){function _($v){return $v;}}
if(!function_exists('ngettext')){function ngettext($a,$b,$n){return $n===1?$a:$b;}}
$out=dirname(__DIR__).'/.review/native';if(!is_dir($out))mkdir($out,0777,true);
// Faithful native frontend modules needed by list selection, sorting and forms.
$runtime='';
foreach(['alpineInit','listSorting','listUnitSelect','toggleAdvanced','tabPanels','unlimitedInput'] as $module){
    $js=file_get_contents($reference.'/web/js/src/'.$module.'.js');
    if(preg_match('/^import /m',$js))throw new Exception('Unexpected module dependency');
    $runtime.=str_replace(['export default ','export '],'',$js)."\n";
}
$runtime.="handleListSorting();handleListUnitSelect();handleToggleAdvanced();handleTabPanels();document.addEventListener('alpine:init',()=>{alpineInit();Alpine.store('globals',{UNLIMITED:'Unlimited'});handleUnlimitedInput();});";
file_put_contents($out.'/runtime.js',$runtime);
copy($reference.'/web/webfonts/fa-solid-900.woff2',$out.'/fa-solid-900.woff2');
$font="@font-face{font-family:FixtureIcons;src:url(fa-solid-900.woff2)}.fas{font-family:FixtureIcons!important;font-weight:900;font-style:normal}.fas:before{content:var(--fixture-icon)}";
foreach(['gear'=>'f013','circle-user'=>'f2bd','user-tie'=>'f508','hard-drive'=>'f0a0','right-left'=>'f362','bell'=>'f0f3','chart-line'=>'f201','circle-question'=>'f059','right-from-bracket'=>'f2f5','binoculars'=>'f1e5','arrow-right'=>'f061','magnifying-glass'=>'f002','chart-bar'=>'f080','server'=>'f233','chart-area'=>'f1fe','arrows-rotate'=>'f021','shield-halved'=>'f3ed','arrow-rotate-left'=>'f0e2','circle-plus'=>'f055','box-open'=>'f49e','arrow-down-a-z'=>'f15d','circle-check'=>'f058','circle-xmark'=>'f057','pen'=>'f304','trash'=>'f1f8','pause'=>'f04c','play'=>'f04b','stop'=>'f04d','key'=>'f084','floppy-disk'=>'f0c7','arrow-left'=>'f060','users'=>'f0c0','earth-americas'=>'f57d','book-atlas'=>'f558','envelopes-bulk'=>'f674','database'=>'f1c0','clock'=>'f017','file-zipper'=>'f1c6']as $name=>$point){$font.='.fa-'.$name.'{--fixture-icon:"\\'.$point.'"}';}
file_put_contents($out.'/icons.css',$font);
$pages=['list_log','list_user','list_web','list_dns','list_mail','list_db','list_cron','list_packages','list_services','list_stats','list_ip','list_firewall','add_user','edit_user','edit_server','add_package','edit_web','edit_mail','add_dns','add_db','add_cron'];
foreach($pages as $page){
 try{
  $template=$reference.'/web/templates/pages/'.$page.'.php';
  $source=file_get_contents($template);if(preg_match('/\b(exec|shell_exec|system|passthru|file_put_contents)\s*\(/',$source))throw new Exception('not a pure view');
  $all=$source.file_get_contents($reference.'/web/templates/includes/panel.php');
  preg_match_all('/\$(v_\w+)/',$source,$matches);foreach(array_unique($matches[1])as $var)$$var='';
  $_SESSION=[];preg_match_all('/\$_SESSION\[["\x27]([^"\x27]+)["\x27]\]/',$all,$matches);foreach($matches[1]as $key)$_SESSION[$key]='';
  $_SESSION=array_merge($_SESSION,['user'=>'demo-admin','userContext'=>'admin','ROOT_USER'=>'demo-admin','look'=>'','token'=>'FIXTURE-ONLY','LANGUAGE'=>'en','language'=>'en','THEME'=>'studio','userTheme'=>'studio','APP_NAME'=>'Hestia Control Panel','WEB_SYSTEM'=>'nginx','DNS_SYSTEM'=>'bind9','MAIL_SYSTEM'=>'exim4','DB_SYSTEM'=>'mysql','CRON_SYSTEM'=>'cron','BACKUP_SYSTEM'=>'yes','API_SYSTEM'=>'2','FIREWALL_SYSTEM'=>'iptables','POLICY_USER_VIEW_LOGS'=>'yes','POLICY_USER_EDIT_DETAILS'=>'yes','POLICY_USER_CHANGE_THEME'=>'yes','userSortOrder'=>'name']);
  $_SESSION['LANGUAGE']=$_SESSION['language']=$fixtureLanguage;
  $_SESSION['hestia_studio_landing_seen']=true;
  $_SERVER['HESTIA']=$reference;$_GET=[];$_POST=[];
  $user=$user_plain='demo-admin';$i=0;
  preg_match_all('/\$(?:data\[\$key\]|panel\[\$user\])\[["\x27]([^"\x27]+)["\x27]\]/',$all,$matches);$item=array_fill_keys(array_unique($matches[1]),'0');
  $item=array_merge($item,['NAME'=>'Demo Admin','CONTACT'=>'admin@example.com','ROLE'=>'admin','PACKAGE'=>'default','SUSPENDED'=>'no','DATE'=>'2026-11-01','TIME'=>'09:00:00','U_USERS'=>'2','SUSPENDED_USERS'=>'0','U_DISK'=>'42600','DISK_QUOTA'=>'unlimited','U_BANDWIDTH'=>'107500','BANDWIDTH'=>'unlimited','U_WEB_DOMAINS'=>'3','WEB_DOMAINS'=>'unlimited','U_DNS_DOMAINS'=>'2','DNS_DOMAINS'=>'unlimited','U_MAIL_DOMAINS'=>'1','MAIL_DOMAINS'=>'unlimited','U_DATABASES'=>'3','DATABASES'=>'unlimited','U_CRON_JOBS'=>'4','CRON_JOBS'=>'unlimited','U_BACKUPS'=>'2','BACKUPS'=>'7','U_MAIL_ACCOUNTS'=>'2','MAIL_ACCOUNTS'=>'unlimited','WEB_ALIASES'=>'unlimited','DNS_RECORDS'=>'unlimited','U_DISK_WEB'=>'35000','U_DISK_DB'=>'4200','U_DISK_MAIL'=>'1800','U_DISK_DIRS'=>'1600','IP'=>'192.0.2.10','SSL'=>'yes','STATS'=>'awstats','TPL'=>'default','ALIASES'=>'www.example.com','ACTION'=>'ACCEPT','PROTOCOL'=>'TCP','PORT'=>'443','COMMENT'=>'Example rule','STATE'=>'running','SYSTEM'=>'web server','RTIME'=>'7200','MEM'=>'384','CPU'=>'12','MIN'=>'*/15','HOUR'=>'*','DAY'=>'*','MONTH'=>'*','WDAY'=>'*','CMD'=>'/usr/bin/true','TYPE'=>'mysql','DBUSER'=>'demo_app','HOST'=>'localhost','MAX_DB'=>'500','IP_OWNED'=>'1']);
  $panel=[$user=>$item];$data=['example.com'=>$item];$TAB=strtoupper(explode('_',$page)[1]);
  if($page==='list_user')$data=[$user=>$item,'demo-user'=>array_merge($item,['NAME'=>'Demo User','CONTACT'=>'user@example.com','ROLE'=>'user','U_DISK'=>'6400'])];
  if($page==='list_web')$data=['example.com'=>$item,'example.org'=>array_merge($item,['SUSPENDED'=>'yes']),'example.net'=>$item];
  if($page==='list_stats')$data=['2026-11-01'=>$item,'2026-10-01'=>array_merge($item,['U_DISK'=>'31000','U_BANDWIDTH'=>'89000']),'2026-09-01'=>array_merge($item,['U_DISK'=>'25000','U_BANDWIDTH'=>'73000'])];
  if($page==='list_services'){$TAB='SERVER';$data=[];foreach(['apache2'=>'web server','bind9'=>'dns server','clamav-daemon'=>'email anti-virus','cron'=>'job scheduler','dovecot'=>'imap/pop3 server','exim4'=>'mail server','fail2ban'=>'brute-force protection','iptables'=>'firewall','mariadb'=>'database server','nginx'=>'reverse proxy','php8.3-fpm'=>'php interpreter','spamd'=>'email spam filter','ssh'=>'ssh server','vsftpd'=>'ftp server'] as $service=>$description){$data[$service]=array_merge($item,['SYSTEM'=>$description,'STATE'=>$service==='vsftpd'?'stopped':'running']);}}
  if($page==='list_log'){$data=[];foreach(['Web domain added: example.net','User settings updated','Backup completed'] as $key=>$message)$data[$key]=['LEVEL'=>'Info','DATE'=>'2026-11-24','TIME'=>'09:'.(30-$key*10).':00','CATEGORY'=>'System','MESSAGE'=>$message];}
  if($page==='list_ip')$data=['192.0.2.10'=>$item];
  if($page==='list_packages')$data=['default'=>$item];
  $sys=['sysinfo'=>['HOSTNAME'=>'server.example.com','HESTIA'=>'1.10.9','RELEASE'=>'release','OS'=>'Ubuntu','VERSION'=>'24.04','ARCH'=>'x86_64','LOADAVERAGE'=>'0.25 / 0.41 / 0.37','UPTIME'=>'2400']];$phpfpm=['php8.3-fpm'];$users=['demo-admin','demo-user'];
  $v_username=$v_user='demo-user';$v_name='Demo User';$v_email='hello@example.com';$v_domain='example.com';$v_ip='192.0.2.10';$v_ns1='ns1.example.com';$v_ns2='ns2.example.com';$v_role='user';$v_language='en';$v_package='default';$v_mysql='yes';$v_pgsql='yes';$v_backup='yes';$v_ftp=[];$v_hostname='server.example.com';$v_timezone='Etc/UTC';$v_php_default_version='8.3';$v_backup_dir='/backup';$v_backup_mode='zstd';$v_backup_gzip='3';
  $languages=['en'=>'English','tr'=>'Türkçe'];$theme=['default','studio'];$v_timezones=['Etc/UTC'];$shells=['nologin','bash'];$web_templates=$proxy_templates=$dns_templates=['default'];$backend_templates=['PHP-8_3'];$php_versions=$php_cli_versions=$v_php_versions=['8.3'];$v_web_stats=['awstats'];$v_ips=['192.0.2.10'];$ips=['192.0.2.10'=>['IP'=>'192.0.2.10']];
  ob_start();include $template;$body=ob_get_clean();
  ob_start();include $reference.'/web/templates/includes/panel.php';$panelHtml=ob_get_clean();
  $route='/'.str_replace('_','/',$page).'/';$route=str_replace(['/list/services/','/list/packages/'],['/list/server/','/list/package/'],$route);
  $panelHtml=str_replace('<main class="app-content">','<main class="app-content" data-studio-fixture-path="'.$route.'">',$panelHtml);
  ob_start();include dirname(__DIR__).'/theme/studio.php';$metadata=ob_get_clean();
  if($page==='list_services'){$metadata=preg_replace_callback('/(id="studio-context">)(.*?)(<\/script>)/',function($m){$context=json_decode($m[2],true);$context['metrics']=['sampledAt'=>time(),'cpu'=>24.6,'cores'=>4,'memory'=>['total'=>8589934592,'used'=>4080218931],'disk'=>['total'=>171798691840,'used'=>45741401702]];return $m[1].json_encode($context,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).$m[3];},$metadata);}
  $metadata=str_replace(['/css/themes/custom/studio.css','/js/custom_scripts/studio.js'],['../../theme/studio.css','../../theme/studio.js'],$metadata);
  $html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Native fixture — '.$page.'</title><link rel="stylesheet" href="../default.css"><link rel="stylesheet" href="../../theme/studio.css">'.$metadata.'<script defer src="../../dist/assets/alpine.min.js"></script><script defer src="../../theme/studio.js"></script></head><body class="page-'.strtolower($TAB).'"><div class="app">'.$panelHtml.$body.'</main><footer class="app-footer">Hestia Control Panel v1.10.9</footer></div></body></html>';
  $html=str_replace('<script defer src="../../dist/assets/alpine.min.js">','<link rel="stylesheet" href="icons.css"><script defer src="runtime.js"></script><script defer src="../../dist/assets/alpine.min.js">',$html);
  $html=str_replace('<html lang="en">','<html lang="'.$fixtureLanguage.'">',$html);
  $html=str_replace('<meta charset="utf-8">','<meta charset="utf-8"><script src="fixture-requests.js"></script>',$html);
  $suffix=$fixtureLanguage==='en'?'':'_'.$fixtureLanguage;
  file_put_contents($out.'/'.$page.$suffix.'.html',$html);echo $page.$suffix.': '.preg_match_all('/<(input|select|textarea)\b/',$body).' controls'.PHP_EOL;
 }catch(Throwable $e){if(ob_get_level())ob_end_clean();echo 'FAILED '.$page.': '.$e->getMessage().PHP_EOL;}
}
// This request adapter exists only in synthetic view fixtures, never the theme.
file_put_contents($out.'/fixture-requests.js',<<<'JS'
(()=>{const nativeFetch=window.fetch.bind(window);window.fetch=(path,options)=>{if(new URLSearchParams(location.search).has('unavailable'))return Promise.reject(new Error('Synthetic unavailable data'));const routes={'/list/server/?studio=overview':'list_services.html','/list/web/':'list_web.html','/list/log/':'list_log.html'};if(path==='/list/rrd/ajax.php'){const request=JSON.parse(options.body);return nativeFetch('rrd-'+request.service+'.json');}if(routes[path])return nativeFetch(routes[path]);return nativeFetch(path,options);};})();
JS);
foreach(['la','mem'] as $metric){$points=[];for($i=0;$i<288;$i++)$points[]=[$i>140&&$i<146?null:round(($metric==='la'?0.6:3600)+(sin($i/13)+cos($i/5))*($metric==='la'?0.12:200),2),0,0];file_put_contents($out.'/rrd-'.$metric.'.json',json_encode(['meta'=>['start'=>strtotime('2026-11-24 00:00:00'),'step'=>300],'data'=>$points]));}
