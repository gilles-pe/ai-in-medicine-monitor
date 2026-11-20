// Deterministic raster companions for favicon.svg; no external packages.
// Coordinates and palette reproduce the 64x64 stethoscope / AI sparkle mark.
import { deflateSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
const BLUE = [30,58,138], WHITE = [247,246,242], AMBER = [245,158,11];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const segDist=(x,y,ax,ay,bx,by)=>{
  const t=clamp(((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2),0,1);
  return Math.hypot(x-ax-t*(bx-ax),y-ay-t*(by-ay));
};
const insidePoly=(x,y,p)=>{
 let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){
 const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;
 }return c;
};
const sparkle=[[48.5,9],[49.4,14.5],[56,16.5],[49.5,18],[48.5,24],[47.5,18],[41,16.5],[47.6,14.5]];
function sample(x,y){
  if(x<0||y<0||x>64||y>64)return null;
  const r=16,cx=clamp(x,r,64-r),cy=clamp(y,r,64-r);
  if(Math.hypot(x-cx,y-cy)>r)return null;
  let rgb=BLUE;
  const u=segDist(x,y,17,17,17,25.5)<=2.2 || segDist(x,y,32,25.5,32,17)<=2.2 ||
    (y>=25.5 && Math.abs(Math.hypot(x-24.5,y-25.5)-7.5)<=2.2);
  const v=segDist(x,y,24.5,33,24.5,40.5)<=2.2 || segDist(x,y,43.5,40.5,43.5,35)<=2.2 ||
    (y>=40.5 && Math.abs(Math.hypot(x-34,y-40.5)-9.5)<=2.2);
  if(u||v)rgb=WHITE;
  const d=Math.hypot(x-43.5,y-30.5);
  if(d<=4.5)rgb=BLUE;
  if(Math.abs(d-4.5)<=1.8)rgb=WHITE;
  if(d<=1.4)rgb=WHITE;
  if(insidePoly(x,y,sparkle))rgb=AMBER;
  return rgb;
}
function png(size){
  const pixels=Buffer.alloc(size*size*4);
  const sub=size<=48?4:2;
  for(let py=0;py<size;py++)for(let px=0;px<size;px++){
    let a=0,rr=0,gg=0,bb=0;
    for(let sy=0;sy<sub;sy++)for(let sx=0;sx<sub;sx++){
      const color=sample((px+(sx+.5)/sub)*64/size,(py+(sy+.5)/sub)*64/size);
      if(color){a++;rr+=color[0];gg+=color[1];bb+=color[2];}
    }
    const i=(py*size+px)*4;
    if(a){pixels[i]=Math.round(rr/a);pixels[i+1]=Math.round(gg/a);pixels[i+2]=Math.round(bb/a);pixels[i+3]=Math.round(255*a/(sub*sub));}
  }
  const raw=Buffer.alloc((size*4+1)*size);
  for(let row=0;row<size;row++)pixels.copy(raw,row*(size*4+1)+1,row*size*4,(row+1)*size*4);
  const chunk=(kind,data)=>{const type=Buffer.from(kind);const length=Buffer.alloc(4);length.writeUInt32BE(data.length);const sum=Buffer.concat([type,data]);const checksum=Buffer.alloc(4);checksum.writeUInt32BE(crc32(sum));return Buffer.concat([length,sum,checksum]);};
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;
  return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
function crc32(buf){let c=0xffffffff;for(const n of buf){c^=n;for(let k=0;k<8;k++)c=(c>>>1)^(c&1?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function ico(images){const h=Buffer.alloc(6+16*images.length);h.writeUInt16LE(1,2);h.writeUInt16LE(images.length,4);let offset=h.length;
  images.forEach(({size,data},i)=>{const q=6+i*16;h[q]=size===256?0:size;h[q+1]=size===256?0:size;h[q+2]=0;h[q+3]=0;h.writeUInt16LE(1,q+4);h.writeUInt16LE(32,q+6);h.writeUInt32LE(data.length,q+8);h.writeUInt32LE(offset,q+12);offset+=data.length;});
  return Buffer.concat([h,...images.map(x=>x.data)]);
}
export async function renderFavicons(out){
  const small=[16,32,48].map(size=>({size,data:png(size)}));
  for(const {size,data} of small)await writeFile(path.join(out,`favicon-${size}.png`),data);
  await writeFile(path.join(out,'favicon.ico'),ico(small));
  await writeFile(path.join(out,'apple-touch-icon.png'),png(180));
  await writeFile(path.join(out,'icon-192.png'),png(192));
}
