/* ---------- Therapie & Prophylaxe: Empirische Therapie, perioperative Prophylaxe, Resistenzlage ----------
   Empirik: PRO-IMPLANT Pocket Guides PJI v11, FRI v4, SA v2, SI v4; Diabetischer Fuß: IWGDF/IDSA 2023.
   Prophylaxe: AWMF S3 067-009 (2025), ASAP-Studie (NEJM 2023), EAST (offene Frakturen). */
function thBlock(t,c,lines){if(!lines||!lines.length)return'';
  return '<div class="thb"><div class="thb-h" style="color:'+c+'">'+t+'</div><ul class="dxwhy">'+lines.map(function(l){return '<li>'+l+'</li>';}).join('')+'</ul></div>';}
function thChoice(key,q,opts,cur,col){return '<div class="dxp"><div class="dxp-n">'+q+'</div><div class="dxchips'+(col?' dxcol':'')+'">'
  +opts.map(function(o){var on=cur===o[0];return '<button class="'+(col?'dxopt':'clschip dxc')+(on?' on':'')+'" data-k="'+key+'" data-v="'+o[0]+'" aria-pressed="'+on+'">'+o[1]+(o[2]?'<span>'+o[2]+'</span>':'')+'</button>';}).join('')+'</div></div>';}

/* ===== Empirische Therapie ===== */
var EM={sit:'',v:'',all:'kein',vanco:false,f:{}};
var EMSIT=[
  ['pji','Protheseninfekt (PJI)','alle Formen, Erreger noch unbekannt'],
  ['fri','Frakturassoziierte Infektion (FRI)',''],
  ['sa','Septische Arthritis, natives Gelenk',''],
  ['sab','Septische Arthritis nach Bandplastik',''],
  ['si','Spondylodiszitis, hämatogen','ohne Implantat'],
  ['sip','Spondylodiszitis, postinterventionell','± Implantat'],
  ['dfo','Diabetischer Fuß','Weichteilinfekt oder Osteomyelitis']
];
var EMVAR={
  fri:['Vorgeschichte',[['std','Standard'],['g3','3° offene Fraktur im Vorfeld']]],
  sa:['Primärfokus',[['nofok','ohne Primärfokus'],['gi','urogenital / gastrointestinal']]],
  sab:['Spülungen',[['first','1. Spülung'],['prev','bereits vorherige Spülungen']]],
  si:['Primärfokus',[['nofok','ohne Primärfokus'],['endo','Endokarditisverdacht'],['gi','urogenital / gastrointestinal']]],
  sip:['Voroperationen',[['first','erste Revision'],['multi','multiple Voroperationen']]],
  dfo:['Schweregrad (IWGDF/IDSA)',[['mild','leichter Weichteilinfekt'],['mod','mittel / schwer'],['osteo','Osteomyelitis']]]
};
var VANCO='Vancomycin 15–20 mg/kg i.v. alle 12 h (PIF: 2 × 1 g), AUC-gesteuert';
var DAPTO='Daptomycin 8 mg/kg i.v. 1×/d';
var FOSFO='Fosfomycin 3 × 5 g i.v. (nicht überall verfügbar, Elektrolyte kontrollieren)';
function emPlan(){var s=EM.sit,v=EM.v,a=EM.all,P={f:[],alt:[],add:[],cn:[],dur:[],pre:[],note:[]};
  var t1=a==='t1',nt1=a==='nt1';
  P.pre.push('Vor der ersten Gabe Proben sichern (Punktat, Gewebe, ggf. Sonikation, Blutkulturen) – bei Sepsis sofort beginnen.');
  if(s==='pji'||s==='fri'){
    if(t1)P.f.push(VANCO,'oder '+DAPTO);
    else if(nt1)P.f.push('Cefazolin 2 g i.v. alle 8 h');
    else if(s==='fri'&&v==='g3')P.f.push('Piperacillin/Tazobactam 4,5 g i.v. alle 8 h');
    else P.f.push('Ampicillin/Sulbactam 3 g i.v. alle 8 h');
    if(EM.vanco&&!t1)P.add.push('+ '+VANCO+' (septisch, MRSA-Träger, multiple Voroperationen oder V. a. Low-grade-Infekt)');
    P.cn=['Ampicillin/Sulbactam 3 g i.v. alle 8 h'+(s==='pji'?' (± Vancomycin)':'')+' für 2 Wochen','dann Rifampicin 450 mg p.o. 2×/d + Levofloxacin 500 mg p.o. 2×/d'];
    P.dur=s==='pji'?['12 Wochen gesamt, davon ca. 2 Wochen i.v.']:['Débridement und Erhalt: 12 Wochen oder Suppression bis zur Konsolidierung','Entfernung: 6 Wochen · einzeitiger Wechsel: 12 Wochen · zweizeitig: je 6 Wochen nach 1. und 2. OP'];
    P.note.push('Gramnegative Erreger sind bei Ampicillin/Sulbactam die Schwachstelle – lokale Resistenzrate beachten (Tool Resistenzlage).');
    if(t1)P.note.push('PIF empfiehlt bei Typ-1-Allergie Vancomycin/Daptomycin. Cefazolin hat eine eigene Seitenkette und ist nach Penicillin-Anaphylaxie meist möglich (Tool Beta-Laktam-Allergie).');
  }else if(s==='sa'||s==='sab'){
    if(s==='sa'){
      if(t1){P.f.push('Vancomycin 15 mg/kg i.v. alle 12 h ± '+FOSFO);P.alt.push(DAPTO+' ± Fosfomycin');}
      else if(nt1){P.f.push('Cefuroxim 1,5 g i.v. alle 8 h');P.alt.push('Cefazolin 2 g i.v. alle 8 h');}
      else if(v==='gi'){P.f.push('Piperacillin/Tazobactam 4,5 g i.v. alle 8 h');P.alt.push('Meropenem 1 g i.v. alle 8 h');}
      else{P.f.push('Ampicillin/Sulbactam 3 g i.v. alle 8 h');P.alt.push('Cefuroxim 1,5 g i.v. alle 8 h');}
      if((t1||nt1)&&v==='gi')P.note.push('Allergie und urogenitaler/GI-Fokus: gramnegative Abdeckung mit Infektiologie festlegen.');
      P.cn=['Ampicillin/Sulbactam 3 g i.v. alle 8 h für 2 Wochen','dann Cotrimoxazol 960 mg + Amoxicillin 1 g p.o. je 3×/d','oder Levofloxacin 500 mg 2×/d + Clindamycin 600 mg 3×/d p.o.'];
      P.dur=['In der Regel 4 Wochen','Streptokokken 1–2 (3–4) Wochen · Gonokokken 1–2 Wochen i.v. · Pilze 6 Wochen','Begleitende Osteomyelitis oder Fremdmaterial: 6 Wochen'];
    }else{
      if(t1){P.f.push('Vancomycin 15 mg/kg i.v. alle 12 h');P.alt.push(DAPTO);}
      else if(v==='prev'){P.f.push('Piperacillin/Tazobactam 4,5 g i.v. alle 8 h + Vancomycin 15 mg/kg i.v. alle 12 h');P.alt.push('Fosfomycin 5 g i.v. alle 8 h + '+DAPTO);}
      else if(nt1){P.f.push('Cefuroxim 1,5 g i.v. alle 8 h + Vancomycin 15 mg/kg i.v. alle 12 h');}
      else{P.f.push('Ampicillin/Sulbactam 3 g i.v. alle 8 h + Vancomycin 15 mg/kg i.v. alle 12 h');P.alt.push('Cefuroxim 1,5 g i.v. alle 8 h + Vancomycin 15 mg/kg i.v. alle 12 h');}
      P.cn=['Ampicillin/Sulbactam 3 g i.v. alle 8 h für 2 Wochen','dann Rifampicin 450 mg p.o. 2×/d + Levofloxacin 500 mg p.o. 2×/d'];
      P.dur=['6 Wochen (Fremdmaterial)'];
      P.note.push('Rifampicin bereits i.v.-begleitend, sobald die Wunde trocken ist bzw. Drainagen gezogen sind; >75 J.: 2 × 300 mg.');
    }
  }else if(s==='si'||s==='sip'){
    if(s==='si'){
      if(t1){P.f.push('Vancomycin 1 g i.v. alle 12 h + '+FOSFO);P.alt.push(DAPTO+' + Fosfomycin');}
      else if(nt1){P.f.push('Cefuroxim 1,5 g i.v. alle 8 h');P.alt.push('Meropenem 1 g i.v. alle 8 h');}
      else if(v==='endo'){P.f.push('Ampicillin/Sulbactam 3 g i.v. alle 6 h + Gentamicin 240 mg i.v. 1×/d');P.alt.push('Ampicillin/Sulbactam 3 g i.v. alle 6 h + Fosfomycin 5 g i.v. alle 8 h');}
      else if(v==='gi'){P.f.push('Piperacillin/Tazobactam 4,5 g i.v. alle 8 h');P.alt.push('Meropenem 1 g i.v. alle 8 h');}
      else{P.f.push('Ampicillin/Sulbactam 3 g i.v. alle 8 h');P.add.push('schwere Infektion: + '+FOSFO);}
      P.pre.push('Erregersicherung per CT-gesteuerter oder offener Biopsie anstreben, wenn klinisch vertretbar.');
      P.dur=['Ohne Implantat: 6 Wochen (2 Wochen i.v., 4 Wochen oral)'];
    }else{
      if(v==='multi'){P.f.push('Piperacillin/Tazobactam 4,5 g i.v. alle 8 h + '+FOSFO);P.alt.push('Vancomycin 1 g i.v. alle 12 h + Fosfomycin');}
      else{P.f.push('Ampicillin/Sulbactam 3 g i.v. alle 8 h + '+FOSFO);P.alt.push('Cefuroxim 1,5 g i.v. alle 8 h + Vancomycin 1 g i.v. alle 12 h');}
      if(t1)P.note.push('Typ-1-Allergie: Vancomycin oder Daptomycin statt Beta-Laktam (PIF SI v4).');
      P.cn=['Ampicillin/Sulbactam 3 g i.v. alle 8 h für 2 Wochen','dann Rifampicin 450 mg p.o. 2×/d + Levofloxacin 500 mg p.o. 2×/d'];
      P.dur=['Implantat entfernt: 6 Wochen','Implantat erhalten oder einzeitiger Wechsel: 12 Wochen (2 Wochen i.v., 10 Wochen biofilmaktiv oral)'];
    }
  }else if(s==='dfo'){var F=EM.f;
    P.pre=['Knochenprobe (intraoperativ oder perkutan) statt Abstrich, wenn Osteomyelitis vermutet wird (bedingt; moderat).','Gewebeprobe statt Wundabstrich; konventionelle Kultur als Erstdiagnostik.','Bei mittel/schwer: pAVK abklären (Doppler, Knöchel- und Zehendruck), WIfI-Klassifikation.'];
    if(v==='mild'){
      if(t1||nt1)P.f.push('Beta-Laktam-Allergie: Clindamycin, Levofloxacin/Moxifloxacin, Cotrimoxazol oder Doxycyclin');
      else if(F.ab)P.f.push('Kürzliche Antibiotika (grampositive + gramnegative Erreger): Amoxicillin/Clavulansäure bzw. Ampicillin/Sulbactam','oder Levofloxacin/Moxifloxacin bzw. Cotrimoxazol');
      else P.f.push('Nur grampositive Erreger (Streptokokken, S. aureus): Flucloxacillin oder Cefalexin p.o.','Gilt ohne kürzliche Antibiotika-Vortherapie in Westeuropa/Nordamerika.');
      if(F.mrsa)P.add.push('MRSA-Risiko hoch (frühere MRSA-Infektion/-Kolonisation): Linezolid, Cotrimoxazol, Clindamycin, Doxycyclin oder Levofloxacin');
      P.dur=['1–2 Wochen oral','Nach chirurgischem Débridement: 10 Tage'];
      P.note.push('Keine topischen Antiinfektiva beim leichten Infekt.');
    }else{
      if(F.isch)P.f.push('Ischämie, Nekrose oder Gasbildung (+ Anaerobier): Ampicillin/Sulbactam bzw. Amoxicillin/Clavulansäure oder Piperacillin/Tazobactam','Alternativ Ertapenem bzw. Meropenem, oder Cefuroxim/Ceftriaxon + Clindamycin oder Metronidazol');
      else if(F.ab)P.f.push('Kürzliche Antibiotika: Piperacillin/Tazobactam, Cefuroxim/Ceftriaxon oder Ertapenem (je nach Vortherapie)');
      else P.f.push('Ohne Komplikationen: Ampicillin/Sulbactam bzw. Amoxicillin/Clavulansäure','oder Cefuroxim bzw. Ceftriaxon');
      if(t1||nt1)P.note.push('Allergie: Alternative über das Tool Beta-Laktam-Allergie wählen.');
      if(F.pae)P.add.push('Mazeriertes Ulkus oder Pseudomonas-Nachweis am Ort in den letzten Wochen: Piperacillin/Tazobactam, Flucloxacillin + Ceftazidim bzw. Ciprofloxacin, oder Meropenem');
      else P.add.push('Pseudomonas in gemäßigtem Klima nicht empirisch abdecken – nur bei Nachweis am Ort in den letzten Wochen');
      if(F.mrsa)P.add.push('MRSA-Risiko: Vancomycin bzw. Teicoplanin, Linezolid oder Daptomycin ergänzen bzw. ersetzen');
      if(F.esbl)P.add.push('Risiko resistenter Gramnegativer (ESBL): Carbapenem; Ciprofloxacin oder Amikacin nach Antibiogramm');
      P.note.push('Schwerer Infekt: initial parenteral, oral erst als Switch.','Kein Tigecyclin (schlechter als Ertapenem).');
      if(v==='osteo'){P.dur=['Ohne OP oder mit totem Knochen: 6 Wochen','Positiver Resektionsrand (Kultur/Histologie): 3 Wochen','Débridement, nur Weichteilinfekt verbleibend: 1–2 Wochen','Infizierter Knochen vollständig reseziert: 2–5 Tage','Remission frühestens 6 Monate nach Therapieende beurteilen'];
        P.note.push('Bei Osteomyelitis im oberen Dosisbereich dosieren; oral mit hoher Bioverfügbarkeit möglich.','Konservativ (nur Antibiotika) möglich bei Vorfuß-Osteomyelitis ohne pAVK, ohne freiliegenden Knochen und ohne akute OP-Indikation; sonst Resektion erwägen.');}
      else P.dur=['2–4 Wochen (initial i.v., dann oral)','Nach chirurgischem Débridement: 10 Tage'];
    }
  }
  return P;}
function renderEm(){var el=document.getElementById('dxEm');if(!el)return;
  var h=thChoice('emsit','Situation',EMSIT,EM.sit,true);
  if(EM.sit&&EMVAR[EM.sit])h+=thChoice('emv',EMVAR[EM.sit][0],EMVAR[EM.sit][1],EM.v,false);
  if(EM.sit)h+=thChoice('emall','Beta-Laktam-Allergie',[['kein','keine'],['nt1','nicht Typ 1 (z. B. Exanthem)'],['t1','Typ 1 / Cephalosporin-Allergie']],EM.all,false);
  if(EM.sit==='dfo'&&EM.v){var DF=[['ab','Antibiotika in letzter Zeit']].concat(EM.v==='mild'?[['mrsa','Frühere MRSA-Infektion oder -Kolonisation']]:[['isch','Ischämie, Nekrose oder Gasbildung'],['pae','Mazeriertes Ulkus / Pseudomonas-Nachweis'],['mrsa','MRSA-Risikofaktoren (Hospitalisierung, Pflegeheim, Dialyse …)'],['esbl','Risiko für ESBL / resistente Gramnegative']]);
    h+='<div class="dxq">Zusatzfaktoren</div><div class="dxchips dxcol">'+DF.map(function(x){var on=!!EM.f[x[0]];return '<button class="dxchk'+(on?' on':'')+'" data-k="emf" data-v="'+x[0]+'" aria-pressed="'+on+'"><span class="dxbox">'+(on?'✓':'')+'</span>'+x[1]+'</button>';}).join('')+'</div>';}
  if(EM.sit==='pji'||EM.sit==='fri')h+='<div class="dxchips dxcol"><button class="dxchk'+(EM.vanco?' on':'')+'" data-k="emvan" data-v="1" aria-pressed="'+EM.vanco+'"><span class="dxbox">'+(EM.vanco?'✓':'')+'</span>Septisch, MRSA-Träger, multiple Voroperationen oder V. a. Low-grade-Infekt</button></div>';
  var need=EM.sit&&EMVAR[EM.sit]&&!EM.v;
  h+='<div class="dxres">';
  if(!EM.sit)h+='<div class="dxnote">Situation wählen – Empfehlung gilt, solange der Erreger unbekannt ist. Sobald er bekannt ist, gezielt deeskalieren (Suche).</div>';
  else if(need)h+='<div class="dxnote">'+EMVAR[EM.sit][0]+' wählen.</div>';
  else{var P=emPlan();
    h+=thBlock('1. Wahl','var(--teal)',P.f)+thBlock('Zusatz','var(--warn)',P.add)+thBlock('Alternative','var(--alt)',P.alt)
      +thBlock('Kulturnegativ – Fortsetzung','var(--oral)',P.cn)+thBlock('Dauer','var(--tx2)',P.dur)+thBlock('Vorher','var(--tx2)',P.pre)
      +thBlock('Beachten','var(--mid)',P.note);
    h+='<div class="dxnote">Dosen für normale Nierenfunktion – Anpassung im Tool Dosierung. Standarddosen der Pocket Guides als Einzeldosen ausgeschrieben (z. B. 3 × 3 g = 3 g alle 8 h).</div>';}
  el.innerHTML=h+'</div>';}
TOOLKEY.emsit=function(v){EM.sit=EM.sit===v?'':v;EM.v='';EM.f={};renderEm();};
TOOLKEY.emv=function(v){EM.v=v;renderEm();};
TOOLKEY.emall=function(v){EM.all=v;renderEm();};
TOOLKEY.emf=function(v){EM.f[v]=!EM.f[v];renderEm();};
TOOLKEY.emvan=function(){EM.vanco=!EM.vanco;renderEm();};
regTool({id:'empirik',grp:'th',t:'Empirische Therapie',s:'Erreger noch unbekannt',c:'var(--teal)',dom:'dxEm',render:renderEm,
  src:'PRO-IMPLANT Pocket Guides PJI v11, FRI v4, SA v2, SI v4 · IWGDF/IDSA 2023 (Senneville et al., Diabetes Metab Res Rev 2024;40:e3687, Tab. 4 und 5)',
  ic:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/><path d="M11 8v6M8 11h6"/>'});

/* ===== Perioperative Prophylaxe ===== */
var PR={op:'',kg:'',all:'kein',mrsa:false};
var PROP=[
  ['tep','Primär-Endoprothese','Hüfte, Knie, Schulter'],['rev','Aseptische Revision',''],['osy','Osteosynthese, geschlossene Fraktur',''],
  ['of12','Offene Fraktur Gustilo I/II',''],['of3','Offene Fraktur Gustilo III',''],
  ['ak0','Knie-Arthroskopie','ohne Implantat, Knorpel- oder Knocheneingriff'],['ak1','Kreuzband, Knorpel- oder Knocheneingriff',''],
  ['sch','Schulter, arthroskopisch oder offen',''],['ws','Wirbelsäule','mit oder ohne Instrumentation'],['reimp','Reimplantation nach PJI','2. Stufe']
];
function renderPr(){var el=document.getElementById('dxPr');if(!el)return;
  var h=thChoice('prop','Eingriff',PROP,PR.op,true)
   +'<div class="dxgrid"><label>Gewicht<input class="dxin" inputmode="decimal" data-f="kg" value="'+PR.kg+'" placeholder="kg"></label></div>'
   +thChoice('prall','Beta-Laktam-Allergie',[['kein','keine'],['pen','Penicillin (auch Soforttyp)'],['schwer','schwere Hautreaktion / Cephalosporin-Allergie']],PR.all,false)
   +'<div class="dxchips dxcol"><button class="dxchk'+(PR.mrsa?' on':'')+'" data-k="prmrsa" data-v="1" aria-pressed="'+PR.mrsa+'"><span class="dxbox">'+(PR.mrsa?'✓':'')+'</span>MRSA-Kolonisation bekannt</button></div>'
   +'<div class="dxres" id="dxPrOut"></div>';
  el.innerHTML=h;renderPrOut();}
function renderPrOut(){var o=document.getElementById('dxPrOut');if(!o)return;
  if(!PR.op){o.innerHTML='<div class="dxnote">Eingriff wählen.</div>';return;}
  if(PR.op==='ak0'){o.innerHTML='<div class="dxverdict" style="background:var(--ok)">Keine Prophylaxe</div><div class="dxnote">Knie-Arthroskopie ohne Kreuzband-, Knorpel- oder Knocheneingriff (AWMF S3, Empf. 90).</div>';return;}
  var kg=parseFloat(String(PR.kg).replace(',','.'));var hasKg=kg>=25&&kg<=350;
  var cz=hasKg&&kg>120?'3 g':hasKg&&kg>100?'2–3 g (S3: 3 g ab 100–120 kg)':'2 g';
  var vd=hasKg?Math.min(2000,Math.round(kg*15/250)*250)+' mg (15 mg/kg)':'15 mg/kg';
  var sub=[],add=[],tm=[],re=[],du=[],nt=[];
  if(PR.all==='schwer'){sub.push('Vancomycin '+vd+' i.v.','Clindamycin nur bei nachgewiesener Sensibilität – höhere Resistenzraten (AWMF S3).');}
  else{sub.push('Cefazolin '+cz+' i.v.');if(PR.all==='pen')nt.push('Cefazolin hat eine eigene Seitenkette und ist auch nach Penicillin-Soforttypreaktion meist einsetzbar (Tool Beta-Laktam-Allergie).');}
  if(PR.mrsa){if(PR.all!=='schwer')add.push('+ Vancomycin '+vd+' i.v. (AWMF S3, Empf. 114)');
    add.push('Präoperativ dekolonisieren: Mupirocin nasal + antiseptische Ganzkörperwaschung (AWMF S3, Empf. 115–117)');}
  if(PR.op==='of3')add.push('+ gramnegative Abdeckung, z. B. Gentamicin 5 mg/kg i.v. 1×/d (EAST)','Erd- oder Fäkalkontamination: zusätzlich hochdosiert Penicillin (Clostridien)');
  if(PR.op==='of12'||PR.op==='of3')add.push('Tetanusschutz prüfen (siehe C. tetani)');
  if(PR.all!=='schwer')tm.push('Cefazolin 30–60 min vor Schnitt (AWMF S3)');
  if(PR.all==='schwer'||PR.mrsa)tm.push('Vancomycin früher starten: Infusion über ≥60 min, Beginn 60–120 min vor Schnitt');
  if(PR.all!=='schwer')re.push('Cefazolin erneut bei OP-Dauer > 2 Halbwertszeiten (≈ 4 h) oder Blutverlust > 1,5 l (AWMF S3, Empf. 124/125)');
  if(PR.all==='schwer'||PR.mrsa)re.push('Vancomycin: wegen langer Halbwertszeit in der Regel keine Nachdosierung; bei Blutverlust > 1,5 l erwägen (AWMF S3, Empf. 125)');
  var D={tep:'Einmalgabe (AWMF S3, Empf. 93/94)',rev:'Einmalgabe, höchstens 24 h',osy:'Einmalgabe',of12:'Präemptiv, höchstens 24 h (AWMF S3, Empf. 88)',
    of3:'72 h präemptiv (AWMF S3, Empf. 89) bzw. ≤24 h nach Weichteildeckung (EAST) – länger bringt nichts',ak1:'Einmalgabe',sch:'Einmalgabe',ws:'Einmalgabe',reimp:'Siehe Wechselschema'};
  du.push(D[PR.op]);
  if(PR.op==='of12'||PR.op==='of3')du.push('So früh wie möglich nach dem Trauma beginnen (AWMF S3, Empf. 87).');
  if(PR.op==='ak1')nt.push('Kreuzbandtransplantat zusätzlich in Vancomycinlösung einlegen (AWMF S3, Empf. 91).');
  if(PR.op==='rev')nt.push('Vor jeder Revision PJI ausschließen (Tool PJI-Diagnose). Gewebeproben intraoperativ immer entnehmen.');
  if(PR.op==='reimp'){sub=['Keine reine Prophylaxe-Situation: erregergerichtete Therapie nach Wechselschema fortführen (Tool DAIR oder Wechsel?).','Zusätzliche Prophylaxe muss den bekannten Erreger abdecken (z. B. Vancomycin bei MRSA).'];add=PR.mrsa?add.filter(function(x){return x.indexOf('dekolon')>=0;}):[];}
  nt.push('Vancomycin routinemäßig zusätzlich zu Cefazolin (ohne MRSA) senkt Wundinfekte nicht, am Knie eher mehr, mehr Überempfindlichkeitsreaktionen (ASAP, NEJM 2023).');
  nt.push('Verlängerte Prophylaxe über das OP-Ende hinaus bringt keinen Vorteil – Ausnahme offene Frakturen (AWMF S3, Empf. 119).');
  o.innerHTML=thBlock('Substanz','var(--teal)',sub)+thBlock('Zusatz','var(--warn)',add)+thBlock('Zeitpunkt','var(--alt)',tm)
    +(PR.op!=='reimp'?thBlock('Nachdosierung','var(--alt)',re):'')+thBlock('Dauer','var(--oral)',du)+thBlock('Beachten','var(--mid)',nt);}
TOOLKEY.prop=function(v){PR.op=PR.op===v?'':v;renderPr();};
TOOLKEY.prall=function(v){PR.all=v;renderPr();};
TOOLKEY.prmrsa=function(){PR.mrsa=!PR.mrsa;renderPr();};
regTool({id:'prophylaxe',grp:'th',t:'Perioperative Prophylaxe',s:'Substanz, Dosis, Dauer',c:'var(--alt)',dom:'dxPr',render:renderPr,
  oninput:function(t){PR.kg=t.value;renderPrOut();},
  src:'AWMF S3-Leitlinie Perioperative und periinterventionelle Antibiotikaprophylaxe 067-009 (2025) · Peel et al., NEJM 2023 (ASAP) · EAST Practice Management Guideline, J Trauma 2011',
  ic:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'});

/* ===== Resistenzlage ===== */
function resTable(R){return '<div class="restab">'+R.rows.map(function(r){
  return '<div class="resrow"><div><b>'+esc(r[0])+'</b> · '+esc(r[1])+(r[3]?'<div class="dxtx">'+esc(r[3])+'</div>':'')+'</div><span class="resv">'+esc(r[2])+'</span></div>';}).join('')+'</div>';}
function renderRes(){var el=document.getElementById('dxRes');if(!el)return;var N=RES.national,L=RES.lokal;
  var h='<div class="dxq">'+esc(N.titel)+' · '+esc(N.jahr)+'</div>'+resTable(N)+'<div class="dxnote">'+esc(N.luecken)+'</div>';
  h+='<div class="dxq" style="margin-top:14px">Lokal'+(L.titel?' · '+esc(L.titel)+' · '+esc(L.jahr):'')+'</div>';
  h+=L.rows.length?resTable(L)+'<div class="dxnote">Quelle: '+esc(L.quelle)+'</div>':'<div class="dxnote">Noch keine lokalen Daten hinterlegt. Lokale Antibiogramm-Statistik hat Vorrang vor den nationalen Zahlen.</div>';
  h+='<div class="dxnote">Konsequenz für die Empirik: MRSA-Anteil niedrig → Vancomycin nicht routinemäßig, nur bei Risikofaktoren. Bei gramnegativem Verdacht (urogenitaler/GI-Fokus) Resistenzen gegen Fluorchinolone und Cephalosporine der 3. Generation mitdenken.</div>';
  el.innerHTML=h;}
regTool({id:'resistenz',grp:'th',t:'Resistenzlage',s:'Österreich und lokal',c:'var(--bad)',dom:'dxRes',render:renderRes,
  src:'NRZ Antibiotikaresistenz, EARS-Net 2024 Österreich (BMSGPK, vorläufige Daten)',
  ic:'<path d="M4 19h16"/><path d="M7 16V9M12 16V5M17 16v-4"/>'});
