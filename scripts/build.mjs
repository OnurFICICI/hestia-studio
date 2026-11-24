import {readFile,writeFile,mkdir} from 'node:fs/promises';
await mkdir('release',{recursive:true});
let html=await readFile('dist/index.html','utf8');
for(const name of ['style.css','control.css']){
  const css=await readFile('dist/assets/'+name,'utf8');
  html=html.replace(`<link rel="stylesheet" href="assets/${name}">`,()=>`<style>\n${css}\n</style>`);
}
for(const name of ['demo-data.js','control-schema.js','control.js','app.js','alpine.min.js']){
  const js=await readFile('dist/assets/'+name,'utf8');
  html=html.replace(`<script defer src="assets/${name}"></script>`,'');
  html=html.replace('</body>',()=>`<script>\n${js.replace(/<\/script/gi,'<\\/script')}\n</script>\n</body>`);
}
const favicon=await readFile('dist/assets/favicon.svg','utf8');
html=html.replace('href="assets/favicon.svg"',()=>`href="data:image/svg+xml;base64,${Buffer.from(favicon).toString('base64')}"`);
await writeFile('release/Hestia-Studio-Preview.html',html);
console.log('Created offline preview ('+Buffer.byteLength(html)+' bytes).');
