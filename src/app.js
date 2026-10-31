(function(){
"use strict";
var DB;
try{DB=JSON.parse(document.getElementById('DB').textContent);}
catch(dbErr){
  document.body.innerHTML='<div style="padding:28px;font:15px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#B00020;max-width:520px;margin:0 auto">'
    +'<div style="font-weight:700;font-size:17px;margin-bottom:8px">Datenbank konnte nicht geladen werden</div>'
    +'<div>Beim letzten Bearbeiten ist wahrscheinlich ein Syntaxfehler in die eingebettete JSON-Datenbank (Zeile mit <code>id="DB"</code>) gerutscht — z. B. ein fehlendes Komma oder Anführungszeichen.</div>'
    +'<div style="margin-top:14px;font-weight:600">Technische Meldung:</div>'
    +'<code style="display:block;white-space:pre-wrap;background:#F2F2F7;padding:10px;border-radius:8px;margin-top:4px;font-size:13px">'+esc(dbErr&&dbErr.message||dbErr)+'</code>'
    +'</div>';
  return;
}
var GCSETS={"light": {"Gram-positiv": "#AF52DE", "Gram-negativ": "#0A84FF", "Anaerobier": "#8E8E93", "Atypisch": "#FF9500", "Mykobakterien": "#FF3B30", "Pilze": "#FF375F", "Multiresistenz-Kategorien": "#FF6B22"}, "dark": {"Gram-positiv": "#BF5AF2", "Gram-negativ": "#0A84FF", "Anaerobier": "#98989D", "Atypisch": "#FF9F0A", "Mykobakterien": "#FF453A", "Pilze": "#FF375F", "Multiresistenz-Kategorien": "#FF9F0A"}};
/* ---------- Einstellungen (localStorage, pro Gerät) ---------- */
var SETDEF={theme:'auto',font:'1',start:'suche',syn:'PJI',vanco:'auc',ebjis:'orig',unit:'mgdl'};
var SET={};(function(){var s={};try{s=JSON.parse(localStorage.getItem('ari_settings')||'{}')||{};}catch(e){s={};}
  try{var old=localStorage.getItem('ari_theme');if(old&&!s.theme)s.theme=old==='dark'?'dark':'light';}catch(e){}
  for(var k in SETDEF)SET[k]=(s[k]!==undefined?s[k]:SETDEF[k]);})();
function saveSet(){try{localStorage.setItem('ari_settings',JSON.stringify(SET));}catch(e){}}
var MQD=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
function effTheme(){return SET.theme==='auto'?(MQD&&MQD.matches?'dark':'light'):SET.theme;}
function applyFont(){document.documentElement.style.zoom=SET.font==='1'?'':SET.font;}
var THEME=effTheme();
var GC=GCSETS[THEME];
var GORDER=['Gram-positiv','Gram-negativ','Anaerobier','Atypisch','Mykobakterien','Pilze','Multiresistenz-Kategorien'];
var RESERVE=['quinupristin','dalfopristin','colistin','tigecyclin','cefiderocol','aztreonam/avibactam','meropenem/vaborbactam','ceftazidim/avibactam','relebactam','chloramphenicol','minocyclin'];
var RENAL=['vancomycin','teicoplanin','gentamicin','tobramycin','amikacin','streptomycin','kanamycin','meropenem','imipenem','ertapenem','piperacillin','cefepim','ceftazidim','cefazolin','cefuroxim','ampicillin','amoxicillin','penicillin g','fluconazol','flucytosin','ciprofloxacin','levofloxacin','tmp/smx','cotrimoxazol','trimethoprim','colistin','daptomycin','ethambutol','fosfomycin','aciclovir','ganciclovir','clarithromycin'];
function isRenal(name){var n=name.toLowerCase();for(var i=0;i<RENAL.length;i++){if(n.indexOf(RENAL[i])>-1)return true;}return false;}
function anyRenal(e){var all=(e.f||[]).concat(e.a||[]).concat(e.o||[]);for(var i=0;i<all.length;i++){if(isRenal(all[i][0]))return true;}return false;}
function evLevel(e){ var EVM={'PIF':{t:'PIF-Protokoll',c:'var(--teal)'},'Leitlinie':{t:'Leitlinie',c:'var(--ok)'},'Fallserien':{t:'Fallserien',c:'var(--mid)'},'Fallbericht':{t:'Fallbericht',c:'var(--off)'},'Entwurf':{t:'Entwurf – PIF prüfen',c:'var(--bad)'}}; if(e.ev&&EVM[e.ev])return EVM[e.ev];
  if(hasPif(e))return {t:'PIF-Protokoll',c:'var(--teal)'};
  var n=e.note||'';
  if(/Fallbericht/i.test(n))return {t:'Fallbericht',c:'var(--off)'};
  if(/Fallserien/i.test(n))return {t:'Fallserien',c:'var(--mid)'};
  return {t:'Leitlinie',c:'var(--ok)'};
}
var RECENT=[];try{RECENT=JSON.parse(localStorage.getItem('ari_recent')||'[]');}catch(e){RECENT=[];}
var FAV=[];try{FAV=JSON.parse(localStorage.getItem('ari_fav')||'[]');}catch(e){FAV=[];}
function isFav(nm){return FAV.indexOf(nm)>-1;}
function toggleFav(nm){if(isFav(nm))FAV=FAV.filter(function(x){return x!==nm;});else FAV.unshift(nm);try{localStorage.setItem('ari_fav',JSON.stringify(FAV));}catch(e){}}
var ROUTING=false,NAVDEPTH=0;
function go(hash,replace){if(ROUTING)return;if(location.hash===hash)return;
  try{if(replace||!location.hash){history.replaceState(null,'',hash);}else{history.pushState(null,'',hash);NAVDEPTH++;}}catch(e){}}
function goBack(){if(NAVDEPTH>0){history.back();}else{home();}}
function pushRecent(nm){try{RECENT=RECENT.filter(function(x){return x!==nm;});RECENT.unshift(nm);RECENT=RECENT.slice(0,6);localStorage.setItem('ari_recent',JSON.stringify(RECENT));}catch(e){}}
function toBullets(t){if(!t)return [];t=String(t).trim();
  var ABBR=['vs','u.a','z.B','ca','d.h','bzw','inkl','ggf','evtl','sog','max','min','Nr','i.v','p.o','i.m','Z.n','o.g','u.U','etc','v.a','Wo','Mo','Std','mind','bzgl','ehem','ggf','Sy'];
  ABBR.forEach(function(a){t=t.split(a+'.').join(a+'\u0001');});
  t=t.replace(/\b([A-ZÄÖÜ])\.(?=\s)/g,'$1\u0001');
  var out=[],buf='',depth=0;
  for(var i=0;i<t.length;i++){var c=t[i];
    if(c==='(')depth++;else if(c===')')depth=depth>0?depth-1:0;
    if(depth===0){
      if(c===' '&&(t.substr(i,3)===' - '||t.substr(i,3)===' – ')){out.push(buf);buf='';i+=2;continue;}
      if(c===','||c===';'){out.push(buf);buf='';continue;}
      if(c==='.'&&(i+1>=t.length||t[i+1]===' ')){out.push(buf);buf='';continue;}}
    buf+=c;}
  if(buf)out.push(buf);
  return out.map(function(s){return s.replace(/\u0001/g,'.').trim();}).filter(function(s){return s.length>1;});}
function bulletList(t){var b=toBullets(t);if(b.length<=1)return null;return '<ul class="blist">'+b.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';}
var ABCLASSES=[
 ['Penicilline',['Penicillin G','Penicillin V','Ampicillin','Amoxicillin','Flucloxacillin','Oxacillin','Piperacillin']],
 ['β-Laktam + Inhibitor',['Amoxicillin/Clavulansäure','Ampicillin/Sulbactam','Piperacillin/Tazobactam','Ceftazidim/Avibactam','Ceftolozan/Tazobactam','Meropenem/Vaborbactam','Imipenem/Relebactam','Aztreonam/Avibactam']],
 ['Cephalosporine',['Cefazolin (1. Gen)','Cefalexin (1. Gen, oral)','Cefuroxim (2. Gen)','Ceftriaxon (3. Gen)','Cefotaxim (3. Gen)','Ceftazidim (3. Gen, Pseudomonas)','Cefixim (3. Gen, oral)','Cefpodoxim (3. Gen, oral)','Cefepim (4. Gen)','Ceftarolin (5. Gen, MRSA)','Ceftobiprol (5. Gen, MRSA)','Cefiderocol (Siderophor)']],
 ['Carbapeneme',['Meropenem','Imipenem/Cilastatin','Ertapenem','Doripenem']],
 ['Monobactame',['Aztreonam']],
 ['Aminoglykoside',['Gentamicin','Tobramycin','Amikacin','Streptomycin','Netilmicin']],
 ['Glykopeptide',['Vancomycin','Teicoplanin']],
 ['Lipoglykopeptide',['Dalbavancin','Oritavancin','Telavancin']],
 ['Lipopeptide',['Daptomycin']],
 ['Fluorchinolone',['Ciprofloxacin','Levofloxacin','Moxifloxacin','Ofloxacin','Delafloxacin']],
 ['Makrolide',['Azithromycin','Clarithromycin','Erythromycin','Roxithromycin']],
 ['Lincosamide',['Clindamycin']],
 ['Oxazolidinone',['Linezolid','Tedizolid']],
 ['Tetracycline',['Doxycyclin','Minocyclin','Tetracyclin']],
 ['Glycylcycline',['Tigecyclin','Eravacyclin']],
 ['Nitroimidazole',['Metronidazol','Tinidazol']],
 ['Folatantagonisten',['Trimethoprim/Sulfamethoxazol (Cotrimoxazol)','Trimethoprim','Sulfadiazin']],
 ['Polymyxine',['Colistin (Polymyxin E)','Polymyxin B']],
 ['Ansamycine (Rifamycine)',['Rifampicin','Rifabutin','Rifaximin','Rifapentin']],
 ['Fosfomycine',['Fosfomycin']],
 ['Nitrofurane',['Nitrofurantoin']],
 ['Streptogramine',['Quinupristin/Dalfopristin']],
 ['Phenicole',['Chloramphenicol']],
 ['Fusidane',['Fusidinsäure']],
 ['Pleuromutiline',['Lefamulin']],
 ['Antituberkulotika',['Isoniazid','Rifampicin','Pyrazinamid','Ethambutol','Streptomycin','Bedaquilin','Delamanid','Clofazimin','Cycloserin','Pretomanid']]
];
var AFCLASSES=[
 ['Azole (Triazole)',['Fluconazol','Itraconazol','Voriconazol','Posaconazol','Isavuconazol']],
 ['Echinocandine',['Caspofungin','Micafungin','Anidulafungin','Rezafungin']],
 ['Polyene',['Amphotericin B liposomal','Amphotericin B Deoxycholat','Nystatin (topisch)']],
 ['Pyrimidin-Analoga',['Flucytosin (5-FC)']],
 ['Allylamine',['Terbinafin']],
 ['Weitere',['Griseofulvin','Imidazole topisch: Clotrimazol / Miconazol / Ketoconazol']]
];
var ABSEL=0,AFSEL=0,ABOPEN=false,AFOPEN=false,CLSQ='',CLSEXP=null,CLSSEC='ab';
var SYND={
  PJI:{label:'PJI',full:'Periprothetische Gelenkinfektion',src:'PIF Pocket Guide PJI v11 (2023)',ctx:'Gesamtdauer 12 Wochen, davon ~2 Wochen i.v. Akut &lt;4 Wochen postoperativ bzw. &lt;3 Wochen bei hämatogener Infektion.'},
  FRI:{label:'FRI',full:'Fraktur-assoziierte Infektion / Osteomyelitis',src:'PIF Pocket Guide FRI v4',ctx:'Klassifikation abweichend: früh &lt;6 Wochen, spät &gt;6 Wochen. Eradikation 12 Wochen, Débridement &amp; Entfernung 6 Wochen. Bei Staphylokokken ist Flucloxacillin die PIF-Primärwahl (nicht Cefazolin wie bei PJI). Intramedullärer Nagel: kein Erhalt möglich, Wechsel erforderlich.'},
  SA:{label:'SA',full:'Septische Arthritis (natives Gelenk)',src:'PIF Pocket Guide SA v2 (2021)',ctx:'Gesamtdauer in der Regel 4 Wochen (koreanische Kohorte 2023: erhöhtes Rezidivrisiko bei &lt;4 Wochen). Ausnahmen laut PIF SA v2: Streptokokken 1-2 Wochen (3-4 bei Komorbidität/langsamem Ansprechen), Gonokokken 1-2 Wochen, Pilze 6 Wochen, begleitende Osteomyelitis oder Fremdmaterial 6 Wochen, Endokarditis 4-6 Wochen i.v. Bei Staphylokokken Flucloxacillin. Rifampicin nur bei großen Gelenken und wenn in 12 Monaten keine Prothese geplant ist.'},
  SI:{label:'SI',full:'Spondylodiszitis / Wirbelsäule',src:'PIF Pocket Guide SI v4 (2021)',ctx:'Antibiotikatabelle wie PJI-Schema (Cefazolin bei Staphylokokken). Dauer: nativ 6 Wochen (länger bei nicht drainierten Abszessen), implantatassoziiert 12 Wochen. Längere i.v.-Phase (3-4 Wochen) bei S. agalactiae, S. dysgalactiae und Enterokokken.'}
};
function synDelta(e,syn){var n=e.n.toLowerCase();var isStaph=n.indexOf('staphylococcus')===0||n.indexOf('koagulase-negative')===0;
  if(isStaph&&(syn==='FRI'||syn==='SA'))return 'Flucloxacillin 4×2 g i.v. statt Cefazolin — PIF-Primärwahl in FRI v4 / SA v2.';
  if(syn==='SA'&&e.impl.rif==='ja')return 'Rifampicin nur bei großen Gelenken und wenn in 12 Monaten keine Prothese geplant ist (PIF SA v2).';return '';}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function norm(s){return String(s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
function lev(a,b){if(a===b)return 0;var m=a.length,n=b.length;if(!m)return n;if(!n)return m;var prev=[],cur=[],i,j;
  for(j=0;j<=n;j++)prev[j]=j;for(i=1;i<=m;i++){cur[0]=i;for(j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur.slice();}return prev[n];}
DB.forEach(function(e,i){e._i=i;e._n=norm(e.n);e._s=(e.syns||[]).map(norm);e._tok=e._n.split(' ').concat(e._s.join(' ').split(' ')).filter(function(t){return t.length>1;});});
var DIDX={};
DB.forEach(function(e){
  function idx(arr,role){(arr||[]).forEach(function(p){var k=norm(p[0]);(DIDX[k]=DIDX[k]||[]).push({i:e._i,role:role,dose:p[1]||''});});}
  idx(e.f,'f');idx(e.a,'a');idx(e.o,'o');
});
function classBase(n){return n.replace(/\s*\([^)]*\)\s*$/,'').trim();}
function classMatches(substanceName){
  var key=norm(classBase(substanceName));
  if(DIDX[key])return DIDX[key];
  var toks=key.split(' ').filter(Boolean);if(!toks.length)return null;
  var first=toks[0],second=toks[1],found=null;
  Object.keys(DIDX).some(function(k){
    var kt=k.split(' '),kf=kt[0],ks=kt[1];
    var m0=kf===first||(kf.length>=5&&first.length>=5&&(kf.indexOf(first)===0||first.indexOf(kf)===0));
    if(!m0)return false;
    if(second||ks){var m1=second&&ks&&(ks.indexOf(second)===0||second.indexOf(ks)===0);if(!m1)return false;}
    found=DIDX[k];return true;
  });
  return found;
}
function validateDB(db){
  var issues=[],seen={};
  var PJI_OK={'ja':1,'nein':1,'selten':1},DAIR_OK={'-':1,'—':1,'möglich':1,'erschwert (DTT)':1,'Wechsel bevorz.':1},RIF_OK={'ja':1,'nein':1,'bedingt':1,'—':1};
  function bad(label,msg){issues.push(label+': '+msg);}
  function checkPairs(label,field,arr){if(arr===undefined)return;if(!Array.isArray(arr)){bad(label,'"'+field+'" ist kein Array');return;}
    arr.forEach(function(p,i){if(!Array.isArray(p)||p.length!==2||typeof p[0]!=='string'||!p[0].trim()){bad(label,'"'+field+'"['+i+'] ist kein gültiges [Name, Dosis]-Paar');}});}
  function checkStrArr(label,field,arr){if(arr===undefined)return;if(!Array.isArray(arr)||arr.some(function(x){return typeof x!=='string';})){bad(label,'"'+field+'" sollte ein Array von Texten sein');}}
  db.forEach(function(e,i){
    var label=(e&&typeof e.n==='string'&&e.n.trim())?e.n:'Eintrag #'+i;
    if(!e||typeof e.n!=='string'||!e.n.trim()){bad('Eintrag #'+i,'Name ("n") fehlt oder ist leer');return;}
    if(seen[e._n]){bad(label,'Name doppelt vergeben (Kollision mit vorhandenem Eintrag)');}seen[e._n]=1;
    if(GORDER.indexOf(e.g)===-1)bad(label,'unbekannte Gruppe "'+e.g+'" (nicht in GORDER)');
    if(!e.impl||typeof e.impl!=='object')bad(label,'"impl" fehlt');
    else{
      if(!PJI_OK[e.impl.pji])bad(label,'unerwarteter Wert impl.pji="'+e.impl.pji+'"');
      if(!DAIR_OK[e.impl.dair])bad(label,'unerwarteter Wert impl.dair="'+e.impl.dair+'"');
      if(!RIF_OK[e.impl.rif])bad(label,'unerwarteter Wert impl.rif="'+e.impl.rif+'"');
    }
    checkPairs(label,'f',e.f);checkPairs(label,'a',e.a);checkPairs(label,'o',e.o);
    checkStrArr(label,'syns',e.syns);
    if(e.w!==undefined&&typeof e.w!=='number')bad(label,'"w" sollte eine Zahl sein');
    if(e.pig&&typeof e.pig==='object'){['iv','oral','bio','surg','dur','cave'].forEach(function(k){checkStrArr(label,'pig.'+k,e.pig[k]);});}
    if(e.syn&&typeof e.syn==='object'){Object.keys(e.syn).forEach(function(k){if(['PJI','FRI','SA','SI'].indexOf(k)===-1)bad(label,'unbekannter Syndrom-Schlüssel in "syn": '+k);});}
  });
  return issues;
}
function showDataWarning(issues){
  var bar=document.createElement('div');
  bar.setAttribute('style','position:sticky;top:0;z-index:9999;background:#FFF3CD;color:#7A5200;border-bottom:1px solid #E8C468;padding:10px 14px;font:13px/1.4 -apple-system,BlinkMacSystemFont,sans-serif');
  bar.innerHTML='<b>⚠ '+issues.length+' Datenproblem'+(issues.length===1?'':'e')+' in der eingebetteten Datenbank gefunden</b>'
    +' <button id="dbWarnToggle" style="margin-left:8px;border:1px solid #E8C468;background:#fff;border-radius:6px;padding:2px 8px;cursor:pointer">Details</button>'
    +' <button id="dbWarnClose" style="margin-left:4px;border:none;background:transparent;cursor:pointer;font-size:15px" aria-label="Schließen">✕</button>'
    +'<ul id="dbWarnList" hidden style="margin:8px 0 0;padding-left:18px">'+issues.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';
  document.body.insertBefore(bar,document.body.firstChild);
  bar.querySelector('#dbWarnToggle').addEventListener('click',function(){var l=bar.querySelector('#dbWarnList');l.hidden=!l.hidden;});
  bar.querySelector('#dbWarnClose').addEventListener('click',function(){bar.remove();});
  issues.forEach(function(x){console.warn('[ARI Datenprüfung]',x);});
}
function search(raw){var q=norm(raw);if(!q)return[];var out=[];
  DB.forEach(function(e){var best=0,why='';
    if(e._n===q){best=1000;why='Name';}else if(e._n.indexOf(q)===0){best=900;why='Name';}
    for(var i=0;i<e._s.length;i++){var s=e._s[i];
      if(s===q&&best<980){best=980;why=e.syns[i];}else if(s.indexOf(q)===0&&best<880){best=880;why=e.syns[i];}
      else if(q.length>=3&&s.indexOf(q)>-1&&best<760){best=760;why=e.syns[i];}}
    if(best<820&&e._n.indexOf(q)>-1){best=Math.max(best,820);why='Name';}
    if(best<700&&q.length>=3){for(var t=0;t<e._tok.length;t++){if(e._tok[t].indexOf(q)===0){best=700;why='Wortanfang';break;}}}
    if(best===0&&q.length>=4){for(var k=0;k<e._tok.length;k++){var tk=e._tok[k];if(Math.abs(tk.length-q.length)>2)continue;var d=lev(q,tk);if(d<=(q.length>=7?2:1)){var sc=560-d*60;if(sc>best){best=sc;why='≈ '+tk;}}}}
    if(best>0)out.push({e:e,sc:best,why:why});});
  out.sort(function(a,b){return b.sc-a.sc||(b.e.w||1)-(a.e.w||1)||a.e.n.length-b.e.n.length;});return out.slice(0,9);}
function weeks(s){if(!s)return null;var m=s.match(/(\d+)\s*(?:-\s*(\d+))?\s*(?:Wo|Woche|Wochen)\b/i);if(m)return parseFloat(m[2]||m[1]);m=s.match(/(\d+)\s*(?:-\s*(\d+))?\s*(?:Mo\b|Monat|Monate)/i);if(m)return parseFloat(m[2]||m[1])*4.345;return null;}
function timeline(e,syn){var g=e.pig||{};var durTxt=(g.dur&&g.dur[0])||e.syn[syn]||e.dur||'';var total=weeks(durTxt);if(syn==='SA'&&!total)total=4;if(!total||total<1)return'';
  var ivTxt=(g.iv&&g.iv.join(' '))||'';var iv=null,m=ivTxt.match(/(?:für|x|über)?\s*(\d+)\s*(?:-\s*(\d+))?\s*Wochen?/i);if(m)iv=parseFloat(m[2]||m[1]);if(iv==null)iv=(e.g==='Pilze')?1.5:2;if(iv>=total)iv=Math.max(1,total*0.25);
  var pIv=Math.max(9,Math.min(58,iv/total*100));var hasRif=!!(e.impl&&(e.impl.rif==='ja'||e.impl.rif==='bedingt')&&g.bio&&g.bio.length&&!/kein rifampicin/i.test(g.bio.join(' ')));var rifPos=Math.min(pIv*0.55,22);
  var fmt=function(w){return w>=8?(Math.round(w/4.345*10)/10+' Mo.'):(Math.round(w*10)/10+' Wo.');};
  var h='<div class="tl"><div class="tl-bar"><div class="tl-iv tl-seg" style="width:'+pIv.toFixed(1)+'%"><span class="tl-lb">i.v.</span></div><div class="tl-po tl-seg" style="width:'+(100-pIv).toFixed(1)+'%"><span class="tl-lb">oral</span></div>'+'</div><div class="tl-ax"><span class="tl-tick" style="left:0;transform:none">0</span><span class="tl-tick" style="left:'+pIv.toFixed(1)+'%">'+fmt(iv)+'</span><span class="tl-tick" style="left:100%;transform:translateX(-100%)">'+fmt(total)+'</span></div>';
  if(hasRif)h+='<div class="tl-note"><b>▲</b><span>Rifampicin erst mit neuem/erhaltenem Implantat (beim zweizeitigen Wechsel erst nach Reimplantation), sobald Wunde trocken bzw. Drainagen gezogen — nie als Monotherapie. 2×450 mg, ab 75 J. 2×300 mg.</span></div>';return h+'</div>';}
function piField(label,cls,arr){if(!arr||!arr.length)return'';var v=arr.map(function(x){var s=esc(x).replace(/^(IV-Phase|IV|Oral-Switch|Oral|Rifampicin|Dauer|Cave|WICHTIG|oder|Alternative|Therapie)\s*:\s*/i,'');var isSub=/^(oder|Alternative)\s*:/i.test(x);return '<div'+(isSub?' class="sub"':'')+'>'+(isSub?'oder: ':'')+s+'</div>';}).join('');return '<div class="pf-row"><div class="pf-k '+cls+'">'+label+'</div><div class="pf-v">'+v+'</div></div>';}
function piPanel(e,syn){var g=e.pig||{},S=SYND[syn];var any=(g.iv&&g.iv.length)||(g.oral&&g.oral.length)||(g.bio&&g.bio.length)||(g.surg&&g.surg.length)||(g.dur&&g.dur.length);
  var h='<div class="pi"><div class="pi-h"><span class="pi-t">'+(e.ev&&e.ev!=='PIF'?'Implantat-Vorgehen (kein PIF-Protokoll)':'Pro-Implant Foundation')+' · '+esc(S.full)+'</span><span class="pi-src">'+(e.ev&&e.ev!=='PIF'?'':esc(S.src))+'</span></div>';
  if(g.head)h+='<div class="pi-lead">'+esc(g.head)+'</div>';
  if(!any){h+='<div class="pi-none">Für diesen Erreger enthält die Referenz kein Pro-Implant-Protokoll'+(e.impl.pji==='nein'?' — er ist kein typischer Erreger implantatassoziierter Infektionen.':' — Vorgehen nach Antibiogramm und Infektiologie.')+'</div>';return h+'</div>';}
  h+=timeline(e,syn);
  h+='<div class="pf">'+piField('i.v.','k-iv',g.iv)+piField('BIOFILM','k-bio',g.bio)+piField('ORAL','k-oral',g.oral)+piField('OP','k-surg',g.surg)+piField('DAUER','k-dur',g.dur)+piField('CAVE','k-cave',g.cave)+'</div>';
  var d=synDelta(e,syn);
  if(syn!=='PJI'){h+='<div class="pi-flag"><b>'+esc(S.label)+':</b> '+S.ctx+(d?'<br><b>Für diesen Erreger:</b> '+esc(d):'<br>Für diesen Erreger ist keine syndromspezifische Abweichung dokumentiert — die PJI-Linie gilt sinngemäß.')+'</div>';}
  else if(d){h+='<div class="pi-flag">'+esc(d)+'</div>';}
  return h+'</div>';}
function fmtName(n){return esc(n).replace(/\(([^)]*)\)/g,'<span class="par">($1)</span>')+(RESERVE.some(function(r){return n.toLowerCase().indexOf(r)>-1;})?'<span class="tag">RESERVE</span>':'')+(isRenal(n)?'<span class="tag tag-ren">Niere</span>':'');}
function col(label,color,arr,olab){var h='<div class="col-h">'+esc(label)+'</div><div class="col">';if(!arr||!arr.length)h+='<div class="drug"><span class="dd">—</span></div>';
  arr.forEach(function(d){h+='<div class="drug"><span class="dn" style="color:'+color+'">'+fmtName(d[0])+'</span>'+(d[1]?'<span class="dd">'+esc(d[1])+'</span>':'')+'</div>';});
  if(olab)h+='<div class="olab">⚠ '+esc(olab)+'</div>';return h+'</div>';}
var LOK={{LOK}};
function lokalPanel(e){var c=e.lk&&LOK.kat[e.lk];if(!c)return '';
  var pm=c.pmma&&LOK.pmma[c.pmma];
  var h='<div class="col-h">LOKALE ANTIBIOTIKA</div><div class="col lok">';
  h+='<div class="drug"><span class="dn">PMMA-Zement <span class="par">pro 40 g</span></span>';
  if(pm){h+='<span class="lok-s">'+esc(pm.s)+'</span>'
    +'<div class="lok-kv"><span class="lok-k">Fixation</span><span class="lok-v">'+esc(pm.fix)+'</span>'
    +'<span class="lok-k">Spacer</span><span class="lok-v">'+esc(pm.sp)+'</span></div>';}
  if(c.pmma_n)h+='<span class="lok-w">'+esc(c.pmma_n)+'</span>';
  h+='<details class="lok-d"><summary>Regeln (PIF v11)</summary><ul class="blist">'+LOK.pmma_regeln.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></details></div>';
  ['stim','cer'].forEach(function(k){var T=LOK.traeger[k];
    h+='<div class="drug"><span class="dn">'+esc(T.t)+'</span><span class="lok-w">'+esc(c[k])+'</span>'
      +'<details class="lok-d"><summary>Hinweise zum Träger</summary><ul class="blist">'+T.h.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></details></div>';});
  h+='<div class="olab lok-n">Lokale Träger ergänzen die systemische Therapie. Ausnahme mit Evidenz: SOLARIO (siehe Info).</div></div>'
    +'<div class="tl-src" style="margin:8px 32px 0">'+esc(LOK.quellen)+'</div>';
  return h;}
var LAST=home,CSYN='PJI';
function detail(e,syn){CSYN=syn||'PJI';LAST=function(){detail(e,CSYN);};pushRecent(e.n);
  var eh='#/e/'+encodeURIComponent(e.n);go(eh+'/'+CSYN,location.hash.indexOf(eh+'/')===0);
  var gc=GC[e.g]||'var(--tx2)';
  var dc={'möglich':'var(--ok)','erschwert (DTT)':'var(--mid)','Wechsel bevorz.':'var(--bad)'}[e.impl.dair]||'var(--off)';
  var pc={'ja':'var(--pji-ja)','selten':'var(--mid)'}[e.impl.pji]||'var(--off)';
  var rc={'ja':'var(--ok)','bedingt':'var(--mid)'}[e.impl.rif]||'var(--off)';
  var ev=evLevel(e);
  var fav=isFav(e.n);
  var h='<div class="navbar"><button class="backBtn" id="backBtn" aria-label="Zurück"><svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2L2 10l8 8"/></svg>Zurück</button><button class="favBtn" id="favBtn" aria-pressed="'+fav+'" aria-label="'+(fav?'Aus Favoriten entfernen':'Zu Favoriten hinzufügen')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8z"/></svg></button></div>';
  h+='<div class="card"><div class="chd"><div class="cname">'+esc(e.n)+'</div><div class="cgrp" style="color:'+gc+'">'+esc(e.g)+'</div></div>';
  h+='<div class="impl"><span class="evbadge" style="color:'+ev.c+';border-color:'+ev.c+'">'+ev.t+'</span>';
  h+='<span class="ichip"><span class="dot" style="background:'+pc+'"></span><span class="k">PJI</span><span class="v" style="color:'+pc+'">'+esc(e.impl.pji)+'</span></span>';
  if(e.impl.pji!=='nein'){h+='<span class="ichip"><span class="dot" style="background:'+dc+'"></span><span class="k">DAIR</span><span class="v" style="color:'+dc+'">'+esc(e.impl.dair)+'</span></span><span class="ichip"><span class="dot" style="background:'+rc+'"></span><span class="k">Rifampicin</span><span class="v" style="color:'+rc+'">'+esc(e.impl.rif)+'</span></span>';}
  h+='</div>';
  h+='<div class="syn">'+['PJI','FRI','SA','SI'].map(function(k){return '<button class="stab'+(k===CSYN?' on':'')+'" data-syn="'+k+'">'+SYND[k].label+'</button>';}).join('')+'</div>';
  var qa='';
  if(e.f&&e.f.length){var d0=e.f[0];
    var drugC='<span class="qa-v">'+fmtName(d0[0])+'</span>'+(d0[1]?'<span class="qa-dose">'+esc(d0[1])+'</span>':'');
    var durC=e.syn[CSYN]?'<span class="qa-v">'+esc(e.syn[CSYN])+'</span>':(e.dur?(bulletList(e.dur)||'<span class="qa-v">'+esc(e.dur)+'</span>'):'');
    qa='<div class="qa"><div class="qa-row"><span class="qa-k">1. WAHL</span><div class="qa-c">'+drugC+'</div></div>'
      +(durC?'<div class="qa-row"><span class="qa-k">DAUER</span><div class="qa-c">'+durC+'</div></div>':'')+'</div>';}
  h+='<div class="body">'+qa+piPanel(e,CSYN)+'<div class="cols">'+col(e.route||'ERSTLINIE I.V.','var(--teal)',e.f,'')+col('ALTERNATIVEN','var(--alt)',e.a,'')+col('ORAL / STEP-DOWN','var(--oral)',e.o,e.olabel)+'</div>';
  if(anyRenal(e))h+='<div class="renal-note"><span class="tag tag-ren">Niere</span> Dosis/Intervall nach GFR anpassen (v.a. Vancomycin – '+(SET.vanco==='tal'?'Talspiegel 15–20 µg/ml':'AUC 400–600 mg·h/l')+', Aminoglykoside, Carbapeneme, Azole).</div>';
  if(e.dur){var db=bulletList(e.dur);
    h+='<div class="row r-dur"><span class="r-k">THERAPIEDAUER</span>'+(e.syn[CSYN]?'<span class="dur-cur">'+esc(e.syn[CSYN])+'</span>':'')
      +(db||'<span class="dur-txt">'+esc(e.dur)+'</span>')+'</div>';}
  if(e.note||e.wu){var cv='<div class="row r-cave">';
    if(e.note)cv+='<span class="r-k">CAVE</span>'+esc(e.note);
    if(e.wu){var wb=bulletList(e.wu);cv+='<div class="wu'+(e.note?' wu-sep':'')+'"><span class="wu-k">ABKLÄRUNG</span>'+(wb||esc(e.wu))+'</div>';}
    h+=cv+'</div>';}
  h+=lokalPanel(e);
  h+='</div></div>';
  var v=document.getElementById('view');v.innerHTML=h;
  var bb=document.getElementById('backBtn');if(bb)bb.addEventListener('click',goBack);
  var fb=document.getElementById('favBtn');if(fb)fb.addEventListener('click',function(){toggleFav(e.n);var on=isFav(e.n);fb.setAttribute('aria-pressed',on);fb.setAttribute('aria-label',on?'Aus Favoriten entfernen':'Zu Favoriten hinzufügen');});
  v.querySelectorAll('.stab').forEach(function(b){b.addEventListener('click',function(){detail(e,b.dataset.syn);});});
  window.scrollTo({top:0,behavior:'smooth'});}
var GSHORT={'Gram-positiv':'Gram+','Gram-negativ':'Gram−','Anaerobier':'Anaerob','Atypisch':'Atypisch','Mykobakterien':'Myko','Pilze':'Pilze','Multiresistenz-Kategorien':'MRGN'};
var FILT={g:null,pji:null,dair:null,rif:false,pif:false,wu:false};
function hasPif(e){var g=e.pig||{};return !!((g.iv&&g.iv.length)||(g.oral&&g.oral.length)||(g.bio&&g.bio.length)||(g.surg&&g.surg.length)||(g.dur&&g.dur.length));}
function passes(e){
  if(FILT.g&&e.g!==FILT.g)return false;
  if(FILT.pji&&e.impl.pji!==FILT.pji)return false;
  if(FILT.dair){var dd=e.impl.dair||'';
    if(FILT.dair==='moeglich'&&dd!=='möglich')return false;
    if(FILT.dair==='dtt'&&dd.indexOf('DTT')<0)return false;
    if(FILT.dair==='wechsel'&&dd.indexOf('Wechsel')<0)return false;}
  if(FILT.rif&&e.impl.rif!=='ja')return false;
  if(FILT.pif&&!hasPif(e))return false;
  if(FILT.wu&&!e.wu)return false;
  return true;
}
function fchip(active,label,dim,val){return '<button class="fchip'+(active?' on':'')+'" data-dim="'+dim+'" data-val="'+val+'">'+esc(label)+'</button>';}
var FOPEN=true;
function filtSummary(){var p=[];
  if(FILT.g)p.push(GSHORT[FILT.g]);
  if(FILT.pji)p.push({ja:'relevant',selten:'nur selten',nein:'kein PJI'}[FILT.pji]);
  if(FILT.dair)p.push({moeglich:'möglich',dtt:'DTT',wechsel:'Wechsel'}[FILT.dair]);
  if(FILT.rif)p.push('Rifampicin');if(FILT.pif)p.push('PIF');if(FILT.wu)p.push('Abklärung');
  return p.join(' · ');}
function browse(){LAST=browse;go('#/filter');
  var anyFilt=FILT.g||FILT.pji||FILT.dair||FILT.rif||FILT.pif||FILT.wu;
  var items=DB.filter(passes);
  items.sort(function(a,b){return (b.w||1)-(a.w||1)||GORDER.indexOf(a.g)-GORDER.indexOf(b.g)||a.n.localeCompare(b.n);});
  var h='';
  if(FOPEN){
    h+='<div class="fbar">';
    h+='<div class="frow"><span class="frow-lbl">Gruppe</span><div class="fchips">'+fchip(!FILT.g,'Alle','g','');
    GORDER.forEach(function(g){h+=fchip(FILT.g===g,GSHORT[g],'g',g);});
    h+='</div></div>';
    h+='<div class="frow"><span class="frow-lbl">PJI</span><div class="fchips">'+fchip(!FILT.pji,'Alle','pji','');
    [['ja','relevant'],['selten','nur selten'],['nein','kein PJI']].forEach(function(o){h+=fchip(FILT.pji===o[0],o[1],'pji',o[0]);});
    h+='</div></div>';
    h+='<div class="frow"><span class="frow-lbl">DAIR</span><div class="fchips">'+fchip(!FILT.dair,'Alle','dair','');
    [['moeglich','möglich'],['dtt','DTT'],['wechsel','Wechsel']].forEach(function(o){h+=fchip(FILT.dair===o[0],o[1],'dair',o[0]);});
    h+='</div></div>';
    h+='<div class="frow"><span class="frow-lbl">Weitere</span><div class="fchips">'
      +fchip(FILT.rif,'Rifampicin','rif','t')+fchip(FILT.pif,'PIF-Protokoll','pif','t')+fchip(FILT.wu,'Abklärung','wu','t')+'</div></div>';
    h+='<div class="fbar-foot">'+(anyFilt?'<button class="freset">Zurücksetzen</button>':'<span></span>')
      +'<button class="fdone" id="fdone">Fertig</button></div>';
    h+='</div>';
  }
  h+='<div class="fcount"><span>'+items.length+' Erreger'+(anyFilt?' <span class="fcount-sum">· '+esc(filtSummary())+'</span>':'')+'</span>'
    +(anyFilt&&!FOPEN?'<button class="freset">Zurücksetzen</button>':'')+'</div>';
  if(!items.length){h+='<div class="empty">Keine Erreger mit dieser Kombination.</div>';}
  else{h+='<div class="lst">';
    items.forEach(function(e){var pc={'ja':'var(--pji-ja)','selten':'var(--mid)'}[e.impl.pji]||'var(--off)';
      h+='<div class="li" data-i="'+e._i+'"><span><span class="gdot" style="background:'+(GC[e.g]||'var(--tx2)')+'"></span>'+esc(e.n)+'</span><span class="pj" style="color:'+pc+'">PJI '+esc(e.impl.pji)+'</span></div>';});
    h+='</div>';}
  var v=document.getElementById('view');v.innerHTML=h;
  setActiveTab('Filter');
  var fd=document.getElementById('fdone');if(fd)fd.addEventListener('click',function(){FOPEN=false;browse();});
  v.querySelectorAll('.fchip').forEach(function(b){b.addEventListener('click',function(){
    var dim=b.dataset.dim,val=b.dataset.val;
    if(dim==='rif'||dim==='pif'||dim==='wu'){FILT[dim]=!FILT[dim];}
    else{FILT[dim]=(val===''?null:(FILT[dim]===val?null:val));}
    browse();});});
  v.querySelectorAll('.freset').forEach(function(rst){rst.addEventListener('click',function(){FILT={g:null,pji:null,dair:null,rif:false,pif:false,wu:false};browse();});});
  v.querySelectorAll('.li').forEach(function(li){li.addEventListener('click',function(){detail(DB[+li.dataset.i],SET.syn);});});
}
/*@TOOLS*/
var SUB={{SUB}};var CLSCMP=[];
function subOf(d){return SUB.s[d]||null;}
function classes(){LAST=classes;setActiveTab('Klassen');go('#/klassen');
  var ROLE={f:['Erstlinie','var(--teal)'],a:['Alternative','var(--alt)'],o:['Oral','var(--oral)']};
  var isAf=CLSSEC==='af',arr=isAf?AFCLASSES:ABCLASSES,sel=isAf?AFSEL:ABSEL;
  var groups=isAf?[['Antimykotika',AFCLASSES.map(function(c){return c[0];})]]:SUB.gruppen;
  function idxOf(name){for(var i=0;i<arr.length;i++)if(arr[i][0]===name)return i;return -1;}
  function matchPanel(m){
    return '<div class="cls-match">'+m.map(function(x){var e=DB[x.i],r=ROLE[x.role];
      return '<button class="cls-match-row" data-i="'+x.i+'"><span class="cls-match-role" style="background:'+r[1]+';color:var(--on-tx)">'+r[0]+'</span><span class="cls-match-n">'+esc(e.n)+'</span></button>';
    }).join('')+'</div>';}
  function row(k,v){return v&&v!=='–'?'<div class="kc-r"><span class="kc-k">'+k+'</span><span class="kc-v">'+esc(v)+'</span></div>':'';}
  function card(d,cls){
    var p=subOf(d),m=classMatches(d),n=m?m.length:0,res=RESERVE.some(function(r){return d.toLowerCase().indexOf(r)>-1;}),cmp=CLSCMP.indexOf(d)>-1;
    var h='<div class="kc'+(cmp?' sel':'')+'"><div class="kc-h"><span class="kc-n">'+fmtName(d)+'</span>'
      
      +'<button class="kc-cmp" data-cmp="'+esc(d)+'" aria-pressed="'+cmp+'" aria-label="Zum Vergleich">'+(cmp?'✓ Vergleich':'+ Vergleich')+'</button></div>'
      +(cls?'<div class="kc-cls">'+esc(cls)+'</div>':'');
    if(p)h+=row('Spektrum',p.sp)+row('Lücken',p.lu)+row('Knochen',p.kn)+row('Oral',p.bv)+row('Dosis',p.do)+row('Cave',p.cv);
    else h+='<div class="kc-r"><span class="kc-v" style="color:var(--tx2)">Noch kein Kurzprofil.</span></div>';
    if(n)h+='<button class="kc-hits" data-drug="'+esc(d)+'">'+(CLSEXP===d?'▾':'▸')+' In der Datenbank bei '+n+' Erregern</button>'+(CLSEXP===d?matchPanel(m):'');
    return h+'</div>';}
  var side='<nav class="kl-side" aria-label="Klassen">'+groups.map(function(g){
    return '<div class="kl-g">'+esc(g[0])+'</div>'+g[1].map(function(c){var i=idxOf(c);if(i<0)return '';
      return '<button class="kl-c'+(i===sel&&!CLSQ.trim()?' on':'')+'" data-ci="'+i+'">'+esc(c)+'</button>';}).join('');}).join('')+'</nav>';
  var q=CLSQ.trim(),main;
  if(q){var results=[];
    arr.forEach(function(c){var cm=norm(c[0]).indexOf(norm(q))>-1;c[1].forEach(function(d){if(cm||norm(d).indexOf(norm(q))>-1)results.push({d:d,cls:c[0]});});});
    main='<div class="kl-t">Suche: '+esc(q)+'</div>'+(results.length?results.map(function(r){return card(r.d,r.cls);}).join(''):'<div class="cls-empty">Keine Substanz gefunden.</div>');}
  else{main='<div class="kl-t">'+esc(arr[sel][0])+' <span>'+arr[sel][1].length+'</span></div>'+arr[sel][1].map(function(d){return card(d,'');}).join('');}
  var bar=CLSCMP.length?'<div class="kl-bar"><span>'+CLSCMP.length+' im Vergleich</span><button class="kl-bar-x" id="cmpClr">Leeren</button><button class="fdone" id="cmpGo"'+(CLSCMP.length<2?' disabled':'')+'>Vergleichen</button></div>':'';
  document.getElementById('view').innerHTML='<input class="cls-search" id="clsq" type="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Substanz oder Klasse suchen …" value="'+esc(CLSQ)+'">'
    +'<div class="kl">'+side+'<div class="kl-main">'+main+'</div></div>'+bar;
  var inp=document.getElementById('clsq');
  inp.addEventListener('input',function(){CLSQ=inp.value;var pos=inp.selectionStart;classes();var el=document.getElementById('clsq');if(el){el.focus();el.selectionStart=el.selectionEnd=pos;}});
  document.querySelectorAll('.kl-c').forEach(function(b){b.addEventListener('click',function(){if(isAf)AFSEL=+b.dataset.ci;else ABSEL=+b.dataset.ci;CLSQ='';CLSEXP=null;classes();window.scrollTo(0,0);});});
  document.querySelectorAll('.kc-hits').forEach(function(b){b.addEventListener('click',function(){var d=b.dataset.drug;CLSEXP=CLSEXP===d?null:d;classes();});});
  document.querySelectorAll('.cls-match-row').forEach(function(b){b.addEventListener('click',function(){detail(DB[+b.dataset.i],SET.syn);});});
  document.querySelectorAll('.kc-cmp').forEach(function(b){b.addEventListener('click',function(){var d=b.dataset.cmp,i=CLSCMP.indexOf(d);
    if(i>-1)CLSCMP.splice(i,1);else{if(CLSCMP.length>=3)CLSCMP.shift();CLSCMP.push(d);}classes();});});
  var cc=document.getElementById('cmpClr');if(cc)cc.addEventListener('click',function(){CLSCMP=[];classes();});
  var cg=document.getElementById('cmpGo');if(cg)cg.addEventListener('click',compare);
}
function compare(){LAST=compare;go('#/klassen/vergleich');
  var R=[['sp','Spektrum'],['lu','Lücken'],['kn','Knochen/Biofilm'],['bv','Oral'],['do','Dosis'],['cv','Cave']];
  var h='<div class="navbar"><button class="backBtn" id="backBtn"><svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2L2 10l8 8"/></svg>Klassen</button><span></span></div>'
    +'<div class="pg-h"><div class="pg-t sm">Vergleich</div></div><div class="cmp">';
  h+='<div class="cmp-row cmp-head" style="grid-template-columns:repeat('+CLSCMP.length+',minmax(0,1fr))">'+CLSCMP.map(function(d){return '<b>'+fmtName(d)+'</b>';}).join('')+'</div>';
  R.forEach(function(r){h+='<div class="cmp-k">'+r[1]+'</div><div class="cmp-row" style="grid-template-columns:repeat('+CLSCMP.length+',minmax(0,1fr))">'
    +CLSCMP.map(function(d){var p=subOf(d);return '<span>'+esc(p&&p[r[0]]||'–')+'</span>';}).join('')+'</div>';});
  h+='</div>';
  document.getElementById('view').innerHTML=h;window.scrollTo(0,0);
  document.getElementById('backBtn').addEventListener('click',function(){if(NAVDEPTH>0)history.back();else classes();});
}
function shortName(n){var paren=(n.match(/\(([^)]{1,7})\)/)||[])[1];var base=n.replace(/\s*\(.*$/,'').replace(/\s*\/.*$/,'').trim();var parts=base.split(' ');if(parts.length>=2&&/^[A-Z][a-zäöü]+$/.test(parts[0]))base=parts[0][0]+'. '+parts.slice(1).join(' ');return base+(paren?' ('+paren+')':'');}
function home(){LAST=home;setActiveTab('Suche');go('#/');var _q=document.getElementById('q');if(_q&&_q.value&&document.activeElement!==_q){_q.value='';var _c=document.getElementById('clr');if(_c)_c.hidden=true;var _a=document.getElementById('ac');if(_a){_a.className='';_a.innerHTML='';}}
  var rc='';
  if(RECENT.length){var chips=RECENT.map(function(nm){var e=DB.filter(function(x){return x.n===nm;})[0];return e?'<button class="rchip" data-i="'+e._i+'">'+esc(shortName(nm))+'</button>':'';}).join('');
    rc='<div class="recent"><div class="recent-h">Zuletzt angesehen</div><div class="recent-chips">'+chips+'</div></div>';}
  function sect(title,list){if(!list.length)return '';return '<div class="recent"><div class="recent-h">'+title+'</div><div class="recent-chips">'+list.map(function(e){return '<button class="rchip" data-i="'+e._i+'">'+esc(shortName(e.n))+'<span class="rg">'+esc(e.g)+'</span></button>';}).join('')+'</div></div>';}
  var favs=FAV.map(function(nm){return DB.filter(function(x){return x.n===nm;})[0];}).filter(Boolean);
  var top=DB.filter(function(x){return x.w===3&&x.impl&&x.impl.pji==='ja'&&!isFav(x.n);});
  var fv=sect('Favoriten',favs);
  if(!favs.length)fv='<div class="recent"><div class="recent-h">Favoriten</div><div class="recent-chips"><div class="rchip rhint" style="white-space:normal;color:var(--tx2);font-size:15px;cursor:default">Mit dem Stern in einer Erregerkarte hier ablegen.</div></div></div>';
  document.getElementById('view').innerHTML='<div class="empty"><div class="big">Keim suchen.</div>Tippfehler, Kürzel und alte Namen sind egal — <b>mrsa</b>, <b>propionibacterium</b>, <b>pseudomonas</b> oder <b>staph epi</b> führen alle ans Ziel.</div>'+fv+rc+sect('Häufige PJI-Erreger',top);
  document.querySelectorAll('.rchip').forEach(function(b){b.addEventListener('click',function(){detail(DB[+b.dataset.i],SET.syn);});});}
var q=document.getElementById('q'),ac=document.getElementById('ac'),clr=document.getElementById('clr'),sel=-1,cur=[];
function hl(name,term){var plain=esc(name);if(!term)return plain;try{return plain.replace(new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','i'),'<mark>$1</mark>');}catch(e){return plain;}}
function renderAC(){if(!cur.length){ac.innerHTML=q.value.trim()?'<div class="ac-empty">Kein Treffer. Anderer Name oder Kürzel?</div>':'';ac.className=q.value.trim()?'on':'';return;}
  ac.innerHTML=cur.map(function(r,i){return '<div class="ac-i'+(i===sel?' sel':'')+'" data-i="'+r.e._i+'" role="option"><span><span class="ac-n">'+hl(r.e.n,q.value.trim())+'</span>'+(r.why&&r.why!=='Name'?' <span class="ac-why">'+esc(r.why)+'</span>':'')+'</span><span class="ac-g" style="color:'+(GC[r.e.g]||'var(--tx2)')+'">'+esc(r.e.g)+'</span></div>';}).join('');
  ac.className='on';ac.querySelectorAll('.ac-i').forEach(function(el){el.addEventListener('mousedown',function(ev){ev.preventDefault();pick(+el.dataset.i);});});}
function pick(i){ac.className='';q.value=DB[i].n;sel=-1;detail(DB[i],SET.syn);q.blur();}
q.addEventListener('input',function(){clr.hidden=!q.value;sel=-1;cur=search(q.value);renderAC();});
q.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,cur.length-1);renderAC();}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,-1);renderAC();}else if(e.key==='Enter'){if(cur.length)pick(cur[sel<0?0:sel].e._i);}else if(e.key==='Escape'){ac.className='';q.blur();}});
q.addEventListener('focus',function(){if(cur.length)ac.className='on';});
document.addEventListener('click',function(e){if(!ac.contains(e.target)&&e.target!==q)ac.className='';});
clr.addEventListener('click',function(){q.value='';clr.hidden=true;cur=[];ac.className='';q.focus();home();});
function setActiveTab(n){['Suche','Filter','Klassen','Tools','Info','Einstellungen'].forEach(function(x){var t=document.getElementById('tab'+x);if(t)t.classList.toggle('on',x===n);});
  var sb=document.querySelector('.searchbox'),ks=document.getElementById('ksec');
  if(sb)sb.hidden=(n==='Klassen'||n==='Tools'||n==='Info'||n==='Einstellungen');
  if(ks)ks.hidden=(n!=='Klassen');
}
document.querySelectorAll('#ksec .stab').forEach(function(b){b.addEventListener('click',function(){
  CLSSEC=b.dataset.s;CLSQ='';CLSEXP=null;
  document.querySelectorAll('#ksec .stab').forEach(function(x){x.classList.toggle('on',x===b);});
  classes();
});});
document.getElementById('tabSuche').addEventListener('click',function(){home();window.scrollTo(0,1);});
document.getElementById('tabFilter').addEventListener('click',function(){if(LAST===browse){FOPEN=!FOPEN;}else{FOPEN=true;}browse();window.scrollTo(0,1);});
document.getElementById('tabKlassen').addEventListener('click',function(){classes();window.scrollTo(0,1);});
document.getElementById('tabTools').addEventListener('click',function(){tools();window.scrollTo(0,1);});
document.getElementById('tabInfo').addEventListener('click',function(){info();window.scrollTo(0,1);});
function setTheme(t){THEME=t;GC=GCSETS[t];document.documentElement.dataset.theme=t;
  document.querySelector('meta[name=theme-color]').setAttribute('content',t==='light'?'#F2F2F7':'#000000');LAST();}
document.getElementById('setBtn').addEventListener('click',function(){settings();window.scrollTo(0,1);});
if(MQD&&MQD.addEventListener)MQD.addEventListener('change',function(){if(SET.theme==='auto')setTheme(effTheme());});
window.addEventListener('scroll',function(){var hd=document.getElementById('hdr');if(hd)hd.classList.toggle('collapsed',(window.scrollY||window.pageYOffset||0)>34);},{passive:true});
var dbIssues=validateDB(DB);if(dbIssues.length)showDataWarning(dbIssues);
function route(){ROUTING=true;try{var p=(location.hash||'#/').slice(2).split('/');
    if(p[0]==='e'&&p[1]){var nm=decodeURIComponent(p[1]);var e=DB.filter(function(x){return x.n===nm;})[0];if(e){detail(e,p[2]||'PJI');window.scrollTo(0,0);}else home();}
    else if(p[0]==='filter')browse();else if(p[0]==='klassen'){if(p[1]==='vergleich'&&CLSCMP.length>1)compare();else classes();}else if(p[0]==='tools'||p[0]==='logik'){if(p[1])tool(p[1]);else tools();}else if(p[0]==='info')info();else if(p[0]==='einstellungen')settings();else home();
  }finally{ROUTING=false;}}
window.addEventListener('popstate',function(){if(NAVDEPTH>0)NAVDEPTH--;route();});
applyFont();ROUTING=true;setTheme(THEME);ROUTING=false;if(location.hash&&location.hash!=="#/")route();else if(SET.start==='tools')tools();else home();
setTimeout(function(){window.scrollTo(0,1);},0);
})();
