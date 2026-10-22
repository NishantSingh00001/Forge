/* ============================================================
   Forge — shared engine, chrome, motion, icons (multi-page)
   Text workbench. No emojis anywhere.
   ============================================================ */
'use strict';
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(hover:none)').matches;

/* ---------- icons ---------- */
const ICON={
  forge:'M3 6l9-3 9 3v6c0 5-4 8-9 10-5-2-9-5-9-10z M9 12l2 2 4-4',
  transform:'M4 7h11l-3-3M4 7l3 3M20 17H9l3 3M20 17l-3-3',
  analyze:'M4 20V10M10 20V4M16 20v-7M2 20h20',
  replace:'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3M9 11h4M11 9v4',
  encode:'M8 6l-5 6 5 6M16 6l5 6-5 6M13 4l-2 16',
  settings:'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  menu:'M3 6h18M3 12h18M3 18h18',
  sun:'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon:'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',
  copy:'M9 9h10a1 1 0 011 1v10a1 1 0 01-1 1H9a1 1 0 01-1-1V10a1 1 0 011-1zM5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1',
  download:'M12 4v12M7 11l5 5 5-5M4 20h16',
  upload:'M12 16V4M7 9l5-5 5 5M4 20h16',
  close:'M6 6l12 12M18 6L6 18',
  check:'M5 13l4 4L19 7',
  chevron:'M9 6l6 6-6 6',
  more:'M5 12h.01M12 12h.01M19 12h.01',
  trash:'M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13',
  bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
  terminal:'M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM7 9l3 3-3 3M13 15h4',
  save:'M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z',
  swap:'M7 4v13M7 4L4 7M7 4l3 3M17 20V7M17 20l-3-3M17 20l3-3',
  hash:'M9 4L7 20M17 4l-2 16M4 9h16M3 15h16'
};
function icon(n,sz){sz=sz||16;const p=ICON[n]||'';const round=(n==='more')?' stroke-width="2.6" stroke-linecap="round"':' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';return '<svg class="ic ic-'+n+'" width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="none" stroke="currentColor"'+round+' aria-hidden="true"><path d="'+p+'"/></svg>';}
function logoMark(){return '<span class="mk"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5l8-2 8 2v6c0 5-4 8-8 9-4-1-8-4-8-9z"/><path d="M9 11l2 2 4-4"/></svg></span>';}

/* ---------- state ---------- */
const LS='forge_mp';
const ACCS=[['#00e5ff','#ff2d95'],['#2cffb0','#00e5ff'],['#7c4dff','#ff2d95'],['#ffce5c','#ff2d95'],['#ff5d7a','#7c4dff']];
const DEF={snippets:[],history:[],last:'',settings:{theme:'dark',accent:'#00e5ff',accent2:'#ff2d95'}};
function loadS(){try{const s=JSON.parse(localStorage.getItem(LS)||'null');return s&&s.settings?Object.assign({},DEF,s):JSON.parse(JSON.stringify(DEF));}catch(e){return JSON.parse(JSON.stringify(DEF));}}
let S=loadS();
function save(){localStorage.setItem(LS,JSON.stringify(S));}
function esc(s){return(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

/* ---------- text engine ---------- */
function titleCase(s){return s.replace(/\w\S*/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase());}
function sentenceCase(s){return s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g,c=>c.toUpperCase());}
function words(s){return(s.match(/[A-Za-z0-9]+/g)||[]);}
function toCamel(s){const w=s.toLowerCase().match(/[a-z0-9]+/g)||[];return w.map((x,i)=>i?x.charAt(0).toUpperCase()+x.slice(1):x).join('');}
function toSnake(s){return(s.match(/[A-Za-z0-9]+/g)||[]).map(x=>x.toLowerCase()).join('_');}
function toKebab(s){return(s.match(/[A-Za-z0-9]+/g)||[]).map(x=>x.toLowerCase()).join('-');}
function toConstant(s){return(s.match(/[A-Za-z0-9]+/g)||[]).map(x=>x.toUpperCase()).join('_');}
function slugify(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
function lines(s){return s.split(/\r?\n/);}
const TRANSFORMS=[
 {cat:'Case',ops:[
  {id:'upper',label:'UPPERCASE',fn:s=>s.toUpperCase()},
  {id:'lower',label:'lowercase',fn:s=>s.toLowerCase()},
  {id:'title',label:'Title Case',fn:titleCase},
  {id:'sentence',label:'Sentence case',fn:sentenceCase},
  {id:'camel',label:'camelCase',fn:toCamel},
  {id:'snake',label:'snake_case',fn:toSnake},
  {id:'kebab',label:'kebab-case',fn:toKebab},
  {id:'constant',label:'CONSTANT_CASE',fn:toConstant},
  {id:'capwords',label:'Capitalize Words',fn:s=>s.replace(/\b\w/g,c=>c.toUpperCase())},
  {id:'swapcase',label:'sWAP cASE',fn:s=>s.replace(/[a-z]/gi,c=>c===c.toLowerCase()?c.toUpperCase():c.toLowerCase())}
 ]},
 {cat:'Lines',ops:[
  {id:'sortA',label:'Sort A → Z',fn:s=>lines(s).sort((a,b)=>a.localeCompare(b)).join('\n')},
  {id:'sortZ',label:'Sort Z → A',fn:s=>lines(s).sort((a,b)=>b.localeCompare(a)).join('\n')},
  {id:'sortLen',label:'Sort by length',fn:s=>lines(s).sort((a,b)=>a.length-b.length).join('\n')},
  {id:'revLines',label:'Reverse line order',fn:s=>lines(s).reverse().join('\n')},
  {id:'shuffle',label:'Shuffle lines',fn:s=>{const a=lines(s);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.join('\n');}},
  {id:'dedup',label:'Deduplicate lines',fn:s=>[...new Set(lines(s))].join('\n')},
  {id:'number',label:'Number lines',fn:s=>lines(s).map((l,i)=>(i+1)+'. '+l).join('\n')},
  {id:'removeBlank',label:'Remove blank lines',fn:s=>lines(s).filter(l=>l.trim()).join('\n')}
 ]},
 {cat:'Whitespace & text',ops:[
  {id:'trim',label:'Trim each line',fn:s=>lines(s).map(l=>l.trim()).join('\n')},
  {id:'collapse',label:'Collapse spaces',fn:s=>s.replace(/[ \t]+/g,' ')},
  {id:'revChars',label:'Reverse characters',fn:s=>[...s].reverse().join('')},
  {id:'noPunct',label:'Remove punctuation',fn:s=>s.replace(/[^\w\s]|_/g,'')},
  {id:'stripHtml',label:'Strip HTML tags',fn:s=>s.replace(/<[^>]*>/g,'')},
  {id:'slug',label:'Slugify',fn:slugify}
 ]}
];
const TFMAP={};TRANSFORMS.forEach(c=>c.ops.forEach(o=>TFMAP[o.id]=o));
function analyzeText(s){const w=words(s);const ln=s.length?lines(s):[];const sent=(s.match(/[^.!?]+[.!?]+/g)||(s.trim()?[s]:[])).length;
  const paras=s.split(/\n\s*\n/).filter(p=>p.trim()).length;const uniq=new Set(w.map(x=>x.toLowerCase())).size;
  const avg=w.length?(w.reduce((a,x)=>a+x.length,0)/w.length):0;const longest=w.reduce((a,x)=>x.length>a.length?x:a,'');
  const syll=w.reduce((a,x)=>a+Math.max(1,(x.toLowerCase().match(/[aeiouy]+/g)||[]).length),0);
  const flesch=w.length&&sent?Math.max(0,Math.min(100,206.835-1.015*(w.length/sent)-84.6*(syll/w.length))):0;
  const tokens=Math.ceil(s.length/4);
  return {chars:s.length,words:w.length,sentences:sent,paragraphs:paras,lines:s?ln.length:0,tokens,reading:Math.max(1,Math.round(w.length/200)),unique:uniq,avg:avg.toFixed(1),longest,flesch:Math.round(flesch)};}
function wordFreq(s,n){const f={};words(s).forEach(w=>{w=w.toLowerCase();f[w]=(f[w]||0)+1;});return Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,n||15);}
const CONV={
  b64enc:s=>{try{return btoa(unescape(encodeURIComponent(s)));}catch(e){return'[cannot encode]';}},
  b64dec:s=>{try{return decodeURIComponent(escape(atob(s.trim())));}catch(e){return'[invalid base64]';}},
  urlenc:s=>encodeURIComponent(s),urldec:s=>{try{return decodeURIComponent(s);}catch(e){return'[invalid]';}},
  htmlenc:s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  htmldec:s=>s.replace(/&(amp|lt|gt|quot|#39);/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[m])),
  jsonpretty:s=>{try{return JSON.stringify(JSON.parse(s),null,2);}catch(e){return'[invalid JSON]';}},
  jsonmin:s=>{try{return JSON.stringify(JSON.parse(s));}catch(e){return'[invalid JSON]';}},
  rot13:s=>s.replace(/[a-z]/gi,c=>String.fromCharCode((c<='Z'?90:122)>=(c.charCodeAt(0)+13)?c.charCodeAt(0)+13:c.charCodeAt(0)-13)),
  tobin:s=>[...s].map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '),
  frombin:s=>{try{return s.trim().split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join('');}catch(e){return'[invalid binary]';}},
  tohex:s=>[...s].map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join(' '),
  fromhex:s=>{try{return s.trim().split(/\s+/).map(h=>String.fromCharCode(parseInt(h,16))).join('');}catch(e){return'[invalid hex]';}}
};
function pushHistory(label){S.history.unshift({label,when:Date.now()});S.history=S.history.slice(0,40);save();}

/* ---------- io ---------- */
function dl(name,mime,data){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:mime}));a.download=name;a.click();}
function copyText(t,msg){if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast(msg||'Copied'),()=>toast('Copy failed'));else toast('Clipboard unavailable');}

/* ---------- theme ---------- */
function applyTheme(){document.documentElement.setAttribute('data-theme',S.settings.theme);document.documentElement.style.setProperty('--acc',S.settings.accent);document.documentElement.style.setProperty('--acc2',S.settings.accent2);const b=$('themeBtn');if(b)b.innerHTML=icon(S.settings.theme==='dark'?'sun':'moon');}
function toggleTheme(){S.settings.theme=S.settings.theme==='dark'?'light':'dark';save();applyTheme();}
function setAccent(a,b){S.settings.accent=a;S.settings.accent2=b;save();applyTheme();document.querySelectorAll('.ad').forEach(x=>x.classList.toggle('on',x.dataset.a===a));}

/* ---------- chrome ---------- */
const NAVLINKS=[['index.html','forge','Forge'],['transform.html','transform','Transform'],['analyze.html','analyze','Analyze'],['replace.html','replace','Replace'],['encode.html','encode','Encode'],['settings.html','settings','Settings']];
function buildChrome(){
  const here=(location.pathname.split('/').pop()||'index.html')||'index.html';
  const bar=$('topbar');
  if(bar){bar.className='bar';bar.innerHTML='<div class="in">'+
    '<a class="logo" href="index.html" data-mag>'+logoMark()+'Forge</a>'+
    '<button class="iconbtn navtoggle" id="navToggle" data-press aria-label="Menu">'+icon('menu')+'</button>'+
    '<nav class="nav" id="nav">'+NAVLINKS.map(([h,ic,label])=>'<a href="'+h+'" class="'+(h===here?'on':'')+'">'+label+'</a>').join('')+'</nav>'+
    '<div class="spacer"></div>'+
    '<div class="accents" id="accents">'+ACCS.map(([a,b])=>'<button class="ad'+(a===S.settings.accent?' on':'')+'" data-a="'+a+'" data-press style="background:linear-gradient(135deg,'+a+','+b+')" aria-label="Accent"></button>').join('')+'</div>'+
    '<button class="iconbtn" id="themeBtn" data-press title="Theme (T)" aria-label="Theme"></button>'+
    '<a class="pill primary" href="transform.html" data-press>'+icon('bolt',14)+' Launch</a>'+
    '</div>';
    $('themeBtn').onclick=toggleTheme;
    document.querySelectorAll('#accents .ad').forEach(b=>b.onclick=()=>setAccent(b.dataset.a,ACCS.find(x=>x[0]===b.dataset.a)[1]));
    $('navToggle').onclick=()=>$('nav').classList.toggle('open');
  }
  if(!$('toast'))document.body.insertAdjacentHTML('beforeend','<div class="toast" id="toast"></div>');
  if(!document.getElementById('forge-grid')){const c=document.createElement('canvas');c.id='forge-grid';document.body.prepend(c);}
  if(!document.querySelector('.vig'))document.body.insertAdjacentHTML('afterbegin','<div class="vig"></div><div class="scan"></div>');
  if(!document.querySelector('.cur-ring'))document.body.insertAdjacentHTML('beforeend','<div class="cur-ring"></div><div class="cur-dot"></div>');
  applyTheme();initCursor();initGrid();
  addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(e.key==='t'||e.key==='T')toggleTheme();});
}
let tt;function toast(m){const t=$('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1800);}
function closeAll(){document.querySelectorAll('.scrim').forEach(s=>s.classList.remove('on'));document.querySelectorAll('.menupop').forEach(m=>m.remove());}
addEventListener('pointerdown',e=>{const t=e.target.closest('[data-press]');if(t)t.classList.add('press');});
['pointerup','pointercancel','pointerleave'].forEach(ev=>addEventListener(ev,()=>document.querySelectorAll('.press').forEach(e=>e.classList.remove('press'))));

function initCursor(){if(reduce||touch)return;document.body.classList.add('cur');const ring=document.querySelector('.cur-ring'),dot=document.querySelector('.cur-dot');if(!ring)return;let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';const tText=e.target.closest('input[type=text],input:not([type]),textarea,input[type=password]');const tHov=e.target.closest('button,a,.op,.tile,.ad,.chip,.toggle,label,[data-press]');ring.classList.toggle('txt',!!tText);ring.classList.toggle('hov',!!tHov&&!tText);},{passive:true});
  addEventListener('pointerdown',()=>ring.classList.add('down'));addEventListener('pointerup',()=>ring.classList.remove('down'));
  (function loop(){rx+=(mx-rx)*.22;ry+=(my-ry)*.22;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  addEventListener('pointermove',e=>{document.querySelectorAll('[data-mag],.pill.primary').forEach(el=>{const r=el.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy);if(d<60)el.style.transform='translate('+dx*.14+'px,'+dy*.2+'px)';else el.style.transform='';});},{passive:true});
}
/* techno node-grid: points light up near cursor, subtle drift */
function initGrid(){const cv=document.getElementById('forge-grid');if(!cv)return;if(reduce){cv.style.display='none';return;}
  const ctx=cv.getContext('2d');let W,H,DPR=Math.min(2,devicePixelRatio||1);let mx=-999,my=-999;
  function hx(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
  function sz(){W=cv.width=innerWidth*DPR;H=cv.height=innerHeight*DPR;}sz();addEventListener('resize',sz);
  addEventListener('pointermove',e=>{mx=e.clientX*DPR;my=e.clientY*DPR;},{passive:true});
  addEventListener('pointerleave',()=>{mx=my=-999;});
  const gap=42*DPR;let t=0;
  function frame(){t+=.012;ctx.clearRect(0,0,W,H);const light=document.documentElement.getAttribute('data-theme')==='light';
    const a1=hx(getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||'#00e5ff');
    const a2=hx(getComputedStyle(document.documentElement).getPropertyValue('--acc2').trim()||'#ff2d95');
    const R=200*DPR;
    for(let x=gap;x<W;x+=gap)for(let y=gap;y<H;y+=gap){
      const ox=Math.sin(t+y*.01)*2*DPR,oy=Math.cos(t+x*.01)*2*DPR;const px=x+ox,py=y+oy;
      const dm=Math.hypot(px-mx,py-my);const near=dm<R?(1-dm/R):0;
      const base=light?.05:.08;const a=base+near*.75;const sz2=DPR*(.8+near*2.2);
      const mix=near;const r=Math.round(a1[0]+(a2[0]-a1[0])*mix),g=Math.round(a1[1]+(a2[1]-a1[1])*mix),bl=Math.round(a1[2]+(a2[2]-a1[2])*mix);
      ctx.fillStyle='rgba('+r+','+g+','+bl+','+a+')';ctx.fillRect(px-sz2/2,py-sz2/2,sz2,sz2);
      if(near>.3){const rx=x+gap;if(rx<W){ctx.strokeStyle='rgba('+r+','+g+','+bl+','+(near*.25)+')';ctx.lineWidth=DPR*.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(rx,y);ctx.stroke();}}
    }
    requestAnimationFrame(frame);}
  frame();
}
function initReveals(){const els=document.querySelectorAll('.reveal');if(!els.length)return;if(!('IntersectionObserver'in window)||reduce){els.forEach(e=>e.classList.add('in'));return;}const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.12});els.forEach(e=>io.observe(e));}

const SAMPLE="The quick brown fox jumps over the lazy dog.\nForge transforms, analyzes and converts text — entirely in your browser.\nNo account. No server. No uploads.\nPaste anything and reshape it in a click.";
function ensureSeed(){if(!S.last&&!localStorage.getItem('forge_seeded')){localStorage.setItem('forge_seeded','1');S.last=SAMPLE;save();}}
function boot(){ensureSeed();buildChrome();if(window.initPage)window.initPage();initReveals();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));else setTimeout(boot,0);
