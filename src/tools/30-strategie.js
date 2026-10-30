/* ---------- Strategie: DAIR oder Wechsel (PRO-IMPLANT Pocket Guide PJI v11, 11/2023) ---------- */
var ST={};
var STQ=[
  {k:'typ',q:'Infektionsform',o:[['po-a','Perioperativ, <4 Wochen nach OP'],['po-c','Perioperativ, ≥4 Wochen nach OP'],['he-a','Hämatogen/per continuitatem, Symptome <3 Wochen'],['he-c','Hämatogen/per continuitatem, Symptome ≥3 Wochen']]},
  {k:'stab',q:'Prothese',o:[['ja','fest'],['nein','gelockert']]},
  {k:'wt',q:'Weichteile und Knochen',o:[['ok','gut'],['schlecht','schlecht']]},
  {k:'fist',q:'Fistel',o:[['nein','nein'],['ja','ja']]},
  {k:'rev',q:'Multiple Revisionen',o:[['nein','nein'],['ja','ja']]},
  {k:'err',q:'Erreger',o:[['gut','kein Problemerreger'],['dtt','Problemerreger'],['unb','unbekannt']],h:'Problemerreger (PIF v11): Rifampicin-resistente Staphylokokken, Ciprofloxacin-resistente gramnegative Bakterien, Pilze (Candida).'},
  {k:'op',q:'Eradikation operativ möglich',o:[['ja','ja'],['nein','nein']]}
];
var STAB={
  dair:'Antibiotika gesamt 12 Wochen: 2 Wochen i.v., dann 10 Wochen oral biofilmaktiv.',
  one:'Antibiotika gesamt 12 Wochen: 2 Wochen i.v., dann 10 Wochen oral biofilmaktiv.',
  short:'Antibiotika gesamt 12 Wochen: 2 Wochen i.v. nach Explantation, Reimplantation, 1 Woche i.v., dann 9 Wochen oral biofilmaktiv.',
  long:'Antibiotika: 2 Wochen i.v., 4 Wochen oral ohne Biofilmaktivität bis zur Reimplantation, dann 1 Woche i.v. und 5 Wochen oral biofilmaktiv.',
  three:'Dreizeitig: 3 Wochen bis Spacerwechsel, 3 Wochen bis Reimplantation, dann 1 Woche i.v. und 5 Wochen biofilmaktiv (falls verfügbar, sonst Suppression).'
};
function renderStrat(){var el=document.getElementById('dxSt');if(!el)return;
  var h='';
  STQ.forEach(function(x){h+='<div class="dxp"><div class="dxp-n">'+x.q+'</div>'+(x.h?'<div class="dxp-h">'+x.h+'</div>':'')+'<div class="dxchips'+(x.k==='typ'?' dxcol':'')+'">'
    +x.o.map(function(o){var on=ST[x.k]===o[0];return '<button class="'+(x.k==='typ'?'dxopt':'clschip dxc')+(on?' on':'')+'" data-k="st" data-v="'+x.k+':'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>';}).join('')+'</div></div>';});
  var miss=STQ.filter(function(x){return !ST[x.k];});
  var r=null;
  if(ST.op==='nein'){
    r=['Antibiotische Langzeitsuppression','var(--mid)',
      ['Wenn eine Eradikation nicht möglich ist (PIF v11). Erreger muss bekannt sein.',
       'Orale Substanz je nach Erreger: Staphylokokken – Cotrimoxazol, Doxycyclin, Clindamycin; Streptokokken/Enterokokken – Amoxicillin, Doxycyclin; gramnegativ – Ciprofloxacin, Cotrimoxazol; Candida – Fluconazol.',
       'Kein Rifampicin in der Langzeitsuppression.']];
  }else if(!miss.length){
    var akut=ST.typ==='po-a'||ST.typ==='he-a';
    if(akut&&ST.stab==='ja'&&ST.wt==='ok'&&ST.err!=='dtt'){
      r=['Débridement und Erhalt, Wechsel der mobilen Teile','var(--ok)',
        ['Akute Infektion, feste Prothese, gute Weichteile/Knochen, kein Problemerreger.',STAB.dair,
         'Mobile Teile immer wechseln; keine arthroskopische Spülung.',
         'ICM 2025 enger: beste Kandidaten bei Symptomen <7 Tagen bzw. <6 Wochen nach Implantation.']
         .concat(ST.fist==='ja'?['Fistel bei „akuter“ Präsentation: Klassifikation prüfen – Fistel spricht für reifen Biofilm.']:[])
         .concat(ST.err==='unb'?['Erreger unbekannt: Gewebeproben vor Antibiotikagabe; empirisch Ampicillin/Sulbactam 3×3 g i.v. (± Vancomycin).']:[])];
    }else{
      var why=[];if(!akut)why.push('chronische Infektion');else{if(ST.stab==='nein')why.push('Prothese gelockert');if(ST.wt==='schlecht')why.push('schlechte Weichteile/Knochen');if(ST.err==='dtt')why.push('Problemerreger');}
      var two=ST.err==='dtt'||ST.wt==='schlecht'||ST.fist==='ja'||ST.rev==='ja';
      var lines=['Prothesenwechsel: '+why.join(', ')+'.'];
      if(!two){r=['Einzeitiger Wechsel','var(--ok)',lines.concat(['Kein Problemerreger, gute Weichteile/Knochen, keine Fistel, keine multiplen Revisionen.',STAB.one,
        'RCT Fehring 2026: einzeitig nichtunterlegen (97 % vs. 91 %) bei chronischer PJI nach Primär-TEP mit bekanntem Erreger.'])
        .concat(ST.err==='unb'?['Erreger möglichst präoperativ sichern (Punktion, ggf. Biopsie).']:[])];}
      else if(ST.err==='dtt'||ST.wt==='schlecht'){r=['Zweizeitiger Wechsel, langes Intervall (6–8 Wochen)','var(--bad)',lines.concat([
        (ST.err==='dtt'?'Problemerreger':'Schlechte Weichteile/Knochen')+' → langes Intervall.',STAB.long,
        'Im Intervall keine biofilmaktiven Antibiotika; Rifampicin erst nach Wiederaufbau.',
        'Unbefriedigender Verlauf (Infektzeichen, CRP, Eiter, kompromittierte Weichteile): dreizeitiger Wechsel. '+STAB.three])];}
      else{r=['Zweizeitiger Wechsel, kurzes Intervall (2–3 Wochen)','var(--mid)',lines.concat([
        (ST.fist==='ja'?'Fistel':'Multiple Revisionen')+' ohne Problemerreger und ohne schlechte Weichteile → kurzes Intervall.',STAB.short,
        'Rifampicin erst nach Wiederaufbau der Prothese.'])];}
    }
  }
  h+='<div class="dxres">';
  if(r)h+='<div class="dxverdict" style="background:'+r[1]+'">'+r[0]+'</div><ul class="dxwhy">'+r[2].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>';
  else h+='<div class="dxverdict" style="background:var(--off)">Noch '+miss.length+' offen</div><div class="dxnote">'+miss.map(function(x){return x.q;}).join(' · ')+'</div>';
  h+='<div class="dxnote">Entscheidungshilfe nach dem Behandlungsalgorithmus des PRO-IMPLANT Pocket Guide PJI v11, keine Indikationsstellung. Antibiotika-Details beim Erreger.</div></div>';
  el.innerHTML=h;}
TOOLKEY.st=function(v){var p=v.split(':');ST[p[0]]=ST[p[0]]===p[1]?undefined:p[1];renderStrat();};
regTool({id:'strategie',grp:'dx',t:'DAIR oder Wechsel?',s:'PRO-IMPLANT-Algorithmus v11',c:'var(--alt)',dom:'dxSt',render:renderStrat,
  src:'PRO-IMPLANT Pocket Guide PJI v11 (11/2023): Behandlungsalgorithmus und chirurgisches Vorgehen · ICM 2025 (J Arthroplasty) · Fehring TK et al., JBJS 2026',
  ic:'<path d="M6 3v7a4 4 0 0 0 4 4h4"/><path d="M18 3v4"/><path d="M14 10l4 4-4 4"/><circle cx="6" cy="20" r="1.5"/>'});
