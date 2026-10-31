/* ---------- Diagnose: PJI nach EBJIS 2021, FRI nach Konsensus-Definition ---------- */
/* Stufen je Parameter: 0 = negativ, 1 = verdächtig (EBJIS „infection likely“), 2 = beweisend */
var EB={};
var EBP=[
  {k:'clin',n:'Klinik',o:[[0,'unauffällig'],[1,'verdächtig'],[2,'Fistel / Prothese sichtbar']],
   h:'Verdächtig: radiologische Lockerung <5 J. nach Implantation, Wundheilungsstörung, kürzliches Fieber/Bakteriämie, Eiter um die Prothese.'},
  {k:'crp',n:'CRP',o:[[0,'≤10 mg/l'],[1,'>10 mg/l']],h:'Nicht verwertbar bei Kristallarthropathie, aktiver entzündlicher Gelenkerkrankung, periprothetischer Fraktur, in den ersten postoperativen Wochen.'},
  {k:'wbc',n:'Synovia: Leukozyten',o:[[0,'≤1500/µl'],[1,'>1500/µl'],[2,'>3000/µl']]},
  {k:'pmn',n:'Synovia: Granulozyten',o:[[0,'≤65 %'],[1,'>65 %'],[2,'>80 %']]},
  {k:'ad',n:'Alpha-Defensin',o:[[0,'negativ'],[2,'positiv']],h:'Falsch positiv bei Metallose, Gicht, entzündlicher Grunderkrankung. Negativ schließt nicht aus. Lateral-Flow-Test weniger sensitiv als ELISA.'},
  {k:'cult',n:'Kultur (Punktat / intraoperativ)',o:[[0,'negativ'],[1,'1 positive Probe'],[2,'≥2 Proben, gleicher Erreger']],
   h:'PIF v11: bei hochvirulenten Erregern (S. aureus, E. coli, Streptokokken) oder unter Antibiotika ist schon 1 positive Probe relevant; bei niedrig-virulenten (KNS, C. acnes) erst ≥2.'},
  {k:'son',n:'Sonikation',o:[[0,'kein Wachstum'],[1,'>1 KBE/ml'],[2,'>50 KBE/ml']],h:'Grenzwerte für nicht zentrifugiertes Verfahren; mit Zentrifugation beweisend ab 200 KBE/ml.'},
  {k:'his',n:'Histologie (400×)',o:[[0,'negativ'],[1,'≥5 Granulozyten in 1 HPF'],[2,'≥5 Gran. in ≥5 HPF / Erreger sichtbar']],h:'SLIM-Klassifikation (Krenn/Morawietz) Typ II oder III gilt laut PIF v11 als gleichwertig.'},
  {k:'nuc',n:'Nuklearmedizin',o:[[0,'3-Phasen-Szinti negativ'],[1,'Leukozyten-Szinti positiv']],h:'3-Phasen-Skelettszintigrafie erst >2 J. (Hüfte) bzw. >5 J. (Knie) nach Implantation verwertbar.'}
];
var EBNAME={clin:'Klinik',crp:'CRP',wbc:'Synovia-Leukozyten',pmn:'Synovia-Granulozyten',ad:'Alpha-Defensin',cult:'Kultur',son:'Sonikation',his:'Histologie',nuc:'Nuklearmedizin'};
function lvCls(lv){return lv===2?' lv-bad':lv===1?' lv-mid':' lv-ok';}
function renderEbjis(){var el=document.getElementById('dxEb');if(!el)return;
  var h='<div class="dxnote" style="margin:0 0 6px">Nur erhobene Befunde antippen; nicht Erhobenes leer lassen. Gilt für Hüfte und Knie. Bewertung: '+(SET.ebjis==='pif'?'PIF v11 (modifiziert)':'EBJIS 2021 (Original)')+' – umstellbar in den Einstellungen.</div>';
  EBP.forEach(function(p){var cur=EB[p.k];
    h+='<div class="dxp"><div class="dxp-n">'+p.n+'</div>'+(p.h?'<div class="dxp-h">'+p.h+'</div>':'')+'<div class="dxchips">'
      +p.o.map(function(o){var on=cur===o[0];return '<button class="clschip dxc'+(on?lvCls(o[0]):'')+'" data-k="eb" data-v="'+p.k+':'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>';}).join('')
      +'</div></div>';});
  var done=Object.keys(EB).filter(function(k){return EB[k]!==undefined;});
  var conf=done.filter(function(k){return EB[k]===2;});
  var lik=done.filter(function(k){return EB[k]===1;});
  var trig=lik.filter(function(k){return k==='clin'||k==='crp';});
  var other=lik.filter(function(k){return k!=='clin'&&k!=='crp';});
  var v,c,txt,why=[];
  if(!done.length){v='Noch keine Befunde';c='var(--off)';txt='Befunde oben eintragen.';}
  else if(conf.length){v='Infektion bestätigt';c='var(--bad)';why=conf;txt='Ein beweisendes Kriterium reicht.';}
  else if(trig.length&&other.length){v='Infektion wahrscheinlich';c='var(--mid)';why=trig.concat(other);txt='Klinisches Zeichen oder CRP plus ein weiterer positiver Test. Weitere Abklärung (Punktion, Gewebeproben) einleiten; mehrere verdächtige Befunde beweisen die Infektion nicht.';}
  else if(lik.length){v='Einzelne verdächtige Befunde';c='var(--mid)';why=lik;txt='Kriterium „wahrscheinlich“ nicht erfüllt: dafür braucht es ein klinisches Zeichen oder CRP >10 mg/l zusammen mit einem positiven Synovia-, Mikrobiologie-, Histologie- oder Nuklearbefund. Infektion damit nicht ausgeschlossen.';}
  else{v='Infektion unwahrscheinlich';c='var(--ok)';txt='Alle erhobenen Befunde negativ. Kein Test schließt eine Infektion sicher aus – Aussagekraft hängt davon ab, was erhoben wurde ('+done.length+' von '+EBP.length+' Parametern).';}
  var dom=[EB.clin===1||EB.clin===2,EB.crp===1,EB.wbc>=1||EB.pmn>=1,EB.cult>=1||EB.son>=1,EB.his>=1].filter(Boolean).length;
  var pif=conf.length?'bestätigt':dom>=2?'wahrscheinlich':null;
  if(SET.ebjis==='pif'&&!conf.length&&done.length){if(dom>=2){v='Infektion wahrscheinlich';c='var(--mid)';why=lik;txt='PIF v11 (modifizierte EBJIS-Kriterien): ≥2 Kriterien aus Klinik/CRP, Zellzahl, Mikrobiologie, Histologie. Mehrere verdächtige Befunde beweisen die Infektion nicht.';}}
  h+='<div class="dxres"><div class="dxverdict" style="background:'+c+'">'+v+'</div><div class="dxnote">'+txt+'</div>'
    +(SET.ebjis==='orig'&&done.length&&!conf.length&&pif==='wahrscheinlich'&&v!=='Infektion wahrscheinlich'?'<div class="dxnote"><b>PIF v11 (modifizierte EBJIS-Kriterien):</b> wahrscheinlich – dort genügen ≥2 Kriterien aus Klinik/CRP, Zellzahl, Mikrobiologie, Histologie.</div>':'')
    +(why.length?'<ul class="dxwhy">'+why.map(function(k){return '<li>'+EBNAME[k]+': '+EBP.filter(function(p){return p.k===k;})[0].o.filter(function(o){return o[0]===EB[k];})[0][1]+'</li>';}).join('')+'</ul>':'')
    +'<div class="dxnote">Leukozyten >3000/µl und Granulozyten >80 % sind laut EBJIS-Tabelle jeweils für sich beweisend (der Fließtext formuliert „und“). Zellzahl nur bei klarem Punktat ohne Spülung, EDTA-Röhrchen, Analyse <1 h; bei blutigem Punktat korrigieren.</div>'
    +'<div class="dxnote">Synovia-Grenzwerte gelten nicht für die obere Extremität und sind früh postoperativ, bei Metallose, Kristallarthropathie, entzündlicher Grunderkrankung und periprothetischer Fraktur eingeschränkt verwertbar. Die Definition gibt keine Therapie vor.</div>'
    +'<div class="dxnote"><b>Probenentnahme:</b> ≥5 Gewebeproben mit getrennten Instrumenten (bevorzugt Knochen-Implantat-Grenzschicht), ≥3 für Histologie, 2 Wochen antibiotikafrei (Prophylaxe trotzdem geben), Bebrütung ≥14 Tage oder Anreicherung/Sonikation.</div></div>';
  el.innerHTML=h;}
TOOLKEY.eb=function(v){var p=v.split(':'),k=p[0],n=+p[1];EB[k]=EB[k]===n?undefined:n;renderEbjis();};

var FR={};
var FRC=[['fist','Fistel, Sinus oder Wunddehiszenz mit Verbindung zu Knochen/Implantat'],['pus','Eitrige Sekretion aus der Wunde oder Eiter intraoperativ'],
  ['cult2','Gleicher Erreger in ≥2 getrennten tiefen Gewebe-/Implantatproben'],['histo','Erreger in tiefem Gewebe histologisch nachgewiesen (Spezialfärbung)'],
  ['pmn','Histologie >5 Granulozyten/HPF – nur chronische/späte FRI (z. B. Pseudarthrose)']];
var FRS=[['clin','Lokale Rötung, Schwellung, Überwärmung oder Fieber ≥38,3 °C'],['drain','Anhaltende, zunehmende oder neue Wundsekretion nach den ersten postoperativen Tagen'],
  ['rad','Radiologisch: Implantatlockerung, Osteolyse, ausbleibende Heilung, Sequester, Periostreaktion'],['cult1','Erreger in einer einzelnen tiefen Probe'],
  ['lab','Erhöhte Entzündungswerte (CRP, Leukozyten, BSG)'],['nuc','Nuklearmedizin positiv (Leukozyten-Szinti, FDG-PET – PET nicht <1 Monat postoperativ)']];
function frChk(k,t){var on=!!FR[k];return '<button class="dxchk'+(on?' on':'')+'" data-k="fr" data-v="'+k+'" aria-pressed="'+on+'"><span class="dxbox">'+(on?'✓':'')+'</span>'+t+'</button>';}
function renderFri(){var el=document.getElementById('dxFr');if(!el)return;
  var h='<div class="dxsec">Beweisend</div><div class="dxchips dxcol">'+FRC.map(function(x){return frChk(x[0],x[1]);}).join('')+'</div>'
   +'<div class="dxsec">Hinweisend</div><div class="dxchips dxcol">'+FRS.map(function(x){return frChk(x[0],x[1]);}).join('')+'</div>';
  var c1=FRC.filter(function(x){return FR[x[0]];}),s1=FRS.filter(function(x){return FR[x[0]];});
  var v,c,t;
  if(c1.length){v='FRI bestätigt';c='var(--bad)';t='Mindestens ein beweisendes Kriterium – Therapie einleiten.';}
  else if(s1.length){v='FRI möglich';c='var(--mid)';t='Hinweisende Kriterien sind nicht beweisend, sollen aber eine gezielte Abklärung auslösen (tiefe Gewebeproben, ggf. Histologie).';}
  else{v='Keine Kriterien angekreuzt';c='var(--off)';t='Zutreffendes oben antippen.';}
  h+='<div class="dxres"><div class="dxverdict" style="background:'+c+'">'+v+'</div><div class="dxnote">'+t+'</div>'
    +'<div class="dxnote">CRP, Leukozyten und BSG reichen weder zum Beweis noch zum Ausschluss einer chronischen FRI. Drei-Phasen-Skelettszintigrafie wird nicht empfohlen.</div>'
    +'<div class="dxnote"><b>Probenentnahme:</b> ≥5 tiefe Gewebeproben, bevorzugt Knochen-Implantat-Grenzfläche, je Probe frisches Instrument; keine Abstriche, keine Fistelproben, keine Nadelbiopsie; möglichst 2 Wochen antibiotikafrei; Bebrütung 10–14 Tage.</div></div>';
  el.innerHTML=h;}
TOOLKEY.fr=function(v){FR[v]=!FR[v];renderFri();};

regTool({id:'pji-dx',grp:'dx',t:'PJI-Diagnose',s:'EBJIS 2021',c:'var(--teal)',dom:'dxEb',render:renderEbjis,
  src:'McNally M et al. The EBJIS definition of periprosthetic joint infection. Bone Joint J 2021;103-B:18–25 · PRO-IMPLANT Pocket Guide PJI v11 (modifizierte EBJIS-Kriterien)',
  ic:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>'});
regTool({id:'fri-dx',grp:'dx',t:'FRI-Diagnose',s:'Konsensus-Definition',c:'var(--pi)',dom:'dxFr',render:renderFri,
  src:'Metsemakers WJ et al. Injury 2018;49:505–10 · Govaert GAM et al. J Orthop Trauma 2020;34:8–17 (Update: Histologie, Nuklearmedizin)',
  ic:'<path d="M5 19l5-5M14 10l5-5"/><path d="M9 7l2-2 3 3-2 2zM12 14l2-2 3 3-2 2z"/><path d="M4 20l1-1"/>'});
