/* ---------- Dosierung bei Niereninsuffizienz, Dialyse und Adipositas (Daten: data/dosierung.json, EU-Fachinformationen) ---------- */
var DS={n:'',cl:'',mode:'cl'};
function crclFromRen(){var R=LG.ren;function num(x){return parseFloat(String(x).replace(',','.'));}
  var age=num(R.age),kg=num(R.kg),scr=num(R.scr);if(!(age>=18&&age<=110&&kg>=25&&kg<=300&&scr>0))return null;
  var mg=R.unit==='mgdl'?scr:scr/88.4;if(mg<0.1||mg>20)return null;
  return Math.round((140-age)*kg/(72*mg)*(R.sex==='w'?0.85:1));}
function renderDs(){var el=document.getElementById('dxDs');if(!el)return;
  if(DS.cl===''){var c=crclFromRen();if(c!==null)DS.cl=String(c);}
  var h='<div class="dxq">Substanz</div><div class="dxchips">'+DOS.s.map(function(d){return dxChip('dsn',d.n,esc(d.n),DS.n===d.n);}).join('')+'</div>'
   +'<div class="dxq">Situation</div><div class="dxchips">'+dxChip('dsm','cl','Kreatinin-Clearance',DS.mode==='cl')+dxChip('dsm','hd','Hämodialyse',DS.mode==='hd')+dxChip('dsm','crrt','CRRT',DS.mode==='crrt')+dxChip('dsm','adip','Adipositas',DS.mode==='adip')+'</div>';
  if(DS.mode==='cl')h+='<div class="dxgrid"><label>CrCl<input class="dxin" inputmode="numeric" data-f="cl" value="'+DS.cl+'" placeholder="ml/min"></label></div>';
  h+='<div class="dxres" id="dxDsOut"></div>';
  el.innerHTML=h;renderDsOut();}
function renderDsOut(){var o=document.getElementById('dxDsOut');if(!o)return;
  var d=DOS.s.filter(function(x){return x.n===DS.n;})[0];
  if(!d){o.innerHTML='<div class="dxnote">Substanz wählen. Die Kreatinin-Clearance wird aus dem Tool Kreatinin-Clearance übernommen, wenn dort Werte eingetragen sind.</div>';return;}
  var cl=parseFloat(String(DS.cl).replace(',','.'));var has=DS.mode==='cl'&&cl>=0&&cl<=300;
  var h='<div class="dxq">Standarddosis: <b>'+esc(d.std)+'</b></div>';
  if(DS.mode==='cl'){
    var hit=has?d.r.filter(function(r){return cl>=r[0]&&cl<=r[1];})[0]:null;
    if(hit)h+='<div class="dxverdict" style="background:'+(hit[2].indexOf('keine Anpassung')===0||hit[2]==='100 %'?'var(--ok)':/nicht (anwenden|empfohlen)/.test(hit[2])?'var(--bad)':'var(--mid)')+'">CrCl '+Math.round(cl)+' ml/min: '+esc(hit[2])+'</div>';
    h+='<div class="dstab">'+d.r.slice().sort(function(a,b){return b[0]-a[0];}).map(function(r){var on=hit===r;
      var lab=r[1]>=999?'≥'+r[0]:r[0]===0?'≤'+r[1]:r[0]+'–'+r[1];
      return '<div class="dsrow'+(on?' on':'')+'"><span class="dsk">'+lab+' ml/min</span><span>'+esc(r[2])+'</span></div>';}).join('')+'</div>';
  }else h+='<div class="dxverdict" style="background:var(--alt)">'+{hd:'Hämodialyse',crrt:'CRRT',adip:'Adipositas'}[DS.mode]+'</div><div class="dxnote" style="color:var(--tx)">'+esc(d[DS.mode])+'</div>';
  h+='<div class="dxnote">Quelle: '+esc(d.q)+'</div><div class="dxnote">'+esc(DOS.hinweis)+'</div>';
  if(DS.mode==='adip')h+='<div class="dxnote">Adjustiertes Gewicht = IBW + 0,4 × (Körpergewicht − IBW); IBW Männer 50 kg, Frauen 45,5 kg + 0,9 kg je cm über 152 cm.</div>';
  o.innerHTML=h;}
TOOLKEY.dsn=function(v){DS.n=DS.n===v?'':v;renderDs();};
TOOLKEY.dsm=function(v){DS.mode=v;renderDs();};
regTool({id:'dosierung',grp:'med',t:'Dosierung Niere & Gewicht',s:'Niereninsuffizienz, Dialyse, Adipositas',c:'var(--oral)',dom:'dxDs',render:renderDs,
  oninput:function(t){DS.cl=t.value;renderDsOut();},
  src:'EU-Fachinformationen (SmPC 4.2, Stand der jeweiligen Fassung) · AWMF S3 067-009 (2025) · SBUH Antimicrobial Dosing Guide for Patients with Obesity (01/2025)',
  ic:'<path d="M5 8h14M5 12h14M5 16h9"/><circle cx="18" cy="17" r="2.5"/>'});
