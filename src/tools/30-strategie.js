/* ---------- Strategie: DAIR oder Wechsel (PRO-IMPLANT-Algorithmus) ---------- */
var ST={};
var STQ=[
  {k:'typ',q:'Infektionsform',o:[['po-a','Postoperativ, OP <4 Wochen her'],['po-c','Postoperativ, OP ≥4 Wochen her'],['he-a','Hämatogen, Symptome <3 Wochen'],['he-c','Hämatogen, Symptome ≥3 Wochen']]},
  {k:'stab',q:'Implantat',o:[['ja','stabil'],['nein','gelockert']]},
  {k:'fist',q:'Fistel oder freiliegende Prothese',o:[['nein','nein'],['ja','ja']]},
  {k:'wt',q:'Knochen und Weichteile',o:[['ok','intakt / leicht beeinträchtigt'],['schlecht','kompromittiert / mehrfach voroperiert']]},
  {k:'err',q:'Erreger',o:[['gut','bekannt, gut behandelbar'],['dtt','Problemerreger'],['unb','unbekannt']],h:'Problemerreger (PIF v11): Rifampicin-resistente Staphylokokken, Ciprofloxacin-resistente Gramnegative, Candida.'},
  {k:'op',q:'Operation möglich',o:[['ja','ja'],['nein','nein (multimorbid, inoperabel)']]}
];
function renderStrat(){var el=document.getElementById('dxSt');if(!el)return;
  var h='';
  STQ.forEach(function(x){h+='<div class="dxp"><div class="dxp-n">'+x.q+'</div>'+(x.h?'<div class="dxp-h">'+x.h+'</div>':'')+'<div class="dxchips'+(x.k==='typ'?' dxcol':'')+'">'
    +x.o.map(function(o){var on=ST[x.k]===o[0];return '<button class="'+(x.k==='typ'?'dxopt':'clschip dxc')+(on?' on':'')+'" data-k="st" data-v="'+x.k+':'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>';}).join('')+'</div></div>';});
  var miss=STQ.filter(function(x){return !ST[x.k];});
  var r=null;
  if(ST.op==='nein'){
    r=['Keine kurative Operation','var(--mid)',
      ['Suppressionstherapie: nur bei bekanntem Erreger und ohne radiologische Lockerung. Nach Absetzen Rezidiv in >80 %.',
       'Alternative bei fehlendem Funktionsanspruch: Prothesenentfernung ohne Reimplantation oder iatrogene stabile Fistel (dann keine Antibiotika).',
       'Kein Rifampicin in der Langzeitsuppression.']];
  }else if(!miss.length){
    var akut=ST.typ==='po-a'||ST.typ==='he-a';
    if(akut&&ST.stab==='ja'&&ST.fist==='nein'&&ST.err!=='dtt'){
      r=['DAIR mit Wechsel der mobilen Teile','var(--ok)',
        ['Radikales Débridement, Synovektomie, Spülung; mobile Teile (Inlay, Kopf) immer wechseln – ohne Wechsel hohe Versagerrate.',
         'Keine arthroskopische Spülung.',
         'Antibiotika insgesamt 12 Wochen (PIF v11, ICM 2025).']
         .concat(ST.err==='unb'?['Erreger noch unbekannt: Gewebeproben vor Antibiotikagabe, Strategie nach Erregernachweis bestätigen.']:[])];
    }else{
      var why=[];if(!akut)why.push('Biofilm reif (chronisch)');if(ST.stab==='nein')why.push('Implantat gelockert');if(ST.fist==='ja')why.push('Fistel/freiliegende Prothese');if(ST.err==='dtt')why.push('Problemerreger');
      var lines=['Kein Implantaterhalt: '+why.join(', ')+'.'];
      if(ST.err==='dtt'){r=['Zweizeitiger Wechsel, langes Intervall','var(--bad)',lines.concat(['Intervall 4–6 Wochen; >8 Wochen vermeiden, vor allem mit Spacer.','Candida: ggf. mehrzeitig mit Spacerwechsel nach 2–4 Wochen.','Keine biofilmaktiven Antibiotika (Rifampicin, Ciprofloxacin) bei liegendem Spacer.'])];}
      else if(ST.wt==='schlecht'||ST.fist==='ja'){r=['Zweizeitiger Wechsel, kurzes Intervall','var(--mid)',lines.concat(['Intervall 2–4 Wochen, damit sich Weichteile erholen.','Keine Antibiotikapause vor Reimplantation nötig.','Nach Reimplantation weitere 6 Wochen (gesamt 12 Wochen ab Explantation); bei positiven Reimplantationskulturen 12 Wochen ab Reimplantation.'])];}
      else if(ST.err==='unb'){r=['Wechsel – Erreger zuerst klären','var(--mid)',lines.concat(['Einzeitiger Wechsel setzt einen bekannten Erreger voraus (OPTION, JBJS 2026).','Erregerdiagnostik vorziehen (Punktion, ggf. Biopsie); sonst zweizeitig.'])];}
      else{r=['Einzeitiger Wechsel','var(--ok)',lines.concat(['Bevorzugt bei intakten Weichteilen und bekanntem, gut behandelbarem Erreger.','OPTION (JBJS 2026): einzeitig nichtunterlegen bei chronischer PJI nach Primärprothese, bekanntem Erreger, ohne Immunsuppression.','Antibiotika insgesamt 12 Wochen.'])];}
    }
  }
  h+='<div class="dxres">';
  if(r)h+='<div class="dxverdict" style="background:'+r[1]+'">'+r[0]+'</div><ul class="dxwhy">'+r[2].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>';
  else h+='<div class="dxverdict" style="background:var(--off)">Noch '+miss.length+' offen</div><div class="dxnote">'+miss.map(function(x){return x.q;}).join(' · ')+'</div>';
  h+='<div class="dxnote">Entscheidungshilfe, keine Indikationsstellung. Wahl im Team mit Patient:in treffen; die Antibiotika-Details stehen beim Erreger.</div></div>';
  el.innerHTML=h;}
TOOLKEY.st=function(v){var p=v.split(':');ST[p[0]]=ST[p[0]]===p[1]?undefined:p[1];renderStrat();};
regTool({id:'strategie',grp:'dx',t:'DAIR oder Wechsel?',s:'PRO-IMPLANT-Algorithmus',c:'var(--alt)',dom:'dxSt',render:renderStrat,
  src:'PRO-IMPLANT Pocket Guide PJI v11 · Izakovicova P, Borens O, Trampuz A. EFORT Open Rev 2019;4:482–94 · OPTION-Studie, JBJS 2026 · ICM 2025',
  ic:'<path d="M6 3v7a4 4 0 0 0 4 4h4"/><path d="M18 3v4"/><path d="M14 10l4 4-4 4"/><circle cx="6" cy="20" r="1.5"/>'});
