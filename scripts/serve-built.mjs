// Browser-test server for the exact production artifact, mounted as a Pages project.
import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const mount='/ai-in-medicine-monitor/';
await stat(path.join(root,'index.html'));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!pathname.startsWith(mount)){res.writeHead(404);res.end('Outside project path');return;}
    let filename=path.resolve(root,pathname.slice(mount.length));
    if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if((await stat(filename)).isDirectory())filename=path.join(filename,'index.html');
    const bytes=await readFile(filename);res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Production artifact available at http://127.0.0.1:4173'+mount));
