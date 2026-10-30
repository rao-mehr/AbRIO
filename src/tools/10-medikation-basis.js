var LG={all:'',sw:{},ren:{age:'',kg:'',scr:'',unit:'mgdl',sex:'m'},mr:{grp:'ent',r:{}}};
function dxChip(key,val,label,on){return '<button class="clschip dxc'+(on?' on':'')+'" data-k="'+key+'" data-v="'+val+'" aria-pressed="'+(on?'true':'false')+'">'+label+'</button>';}
function dxRow(cls,lv,txt){var L={ok:['geben','var(--ok)'],mid:['Vorsicht','var(--mid)'],bad:['meiden','var(--bad)']}[lv];
  return '<div class="dxrow"><span class="dxlv" style="background:'+L[1]+'">'+L[0]+'</span><div><b>'+cls+'</b><div class="dxtx">'+txt+'</div></div></div>';}
function renderAll(){var el=document.getElementById('dxAll');if(!el)return;
  var T=[['low','Unklar / Unverträglichkeit','Übelkeit, Durchfall, Kopfschmerz, unklare Kindheitsanamnese'],
         ['rash','Leichtes Exanthem','benignes, verzögertes Exanthem/Urtikaria ohne Systembeteiligung'],
         ['ige','Soforttyp / Anaphylaxie','Anaphylaxie, Angioödem, Bronchospasmus, Hypotonie, Urtikaria &lt;1 h'],
         ['scar','Schwere Haut-/Organreaktion','SJS/TEN, DRESS, AGEP, interstitielle Nephritis, Hämolyse']];
  var h='<div class="dxq">Welche Reaktion auf Penicillin?</div><div class="dxchips dxcol">';
  T.forEach(function(t){h+='<button class="dxopt'+(LG.all===t[0]?' on':'')+'" data-k="all" data-v="'+t[0]+'" aria-pressed="'+(LG.all===t[0])+'"><b>'+t[1]+'</b><span>'+t[2]+'</span></button>';});
  h+='</div>';
  var v=LG.all;
  if(v){h+='<div class="dxres">';
    if(v==='low'||v==='rash'){
      h+=dxRow('Penicilline','mid','Niedriges Risiko. Label kritisch prüfen — Delabeling per direkter oraler Amoxicillin-Provokation (Allergologie) ist meist möglich.')
        +dxRow('Cefazolin','ok','Einsetzbar.')
        +dxRow('Cefalexin / Cefadroxil','ok','Einsetzbar.')
        +dxRow('Andere Cephalosporine','ok','Einsetzbar.')
        +dxRow('Carbapeneme','ok','Einsetzbar.')
        +dxRow('Aztreonam','ok','Einsetzbar.');
    }else if(v==='ige'){
      h+=dxRow('Penicilline','bad','Meiden bis zur allergologischen Abklärung.')
        +dxRow('Cefazolin','ok','Eigene R1-Seitenkette — auch nach Penicillin-Anaphylaxie ohne Testung einsetzbar (Prophylaxe und Therapie).')
        +dxRow('Cefalexin / Cefadroxil','bad','R1-Seitenkette identisch mit Amoxicillin/Ampicillin — nach Aminopenicillin-Reaktion meiden. Relevant für den oralen Switch.')
        +dxRow('Andere Cephalosporine','ok','Unterschiedliche Seitenkette: Kreuzreaktivität &lt;1 %, ohne Testung einsetzbar (Cefuroxim, Ceftriaxon, Cefepim, Ceftazidim).')
        +dxRow('Carbapeneme','ok','Kreuzreaktivität &lt;1 %, ohne Testung einsetzbar.')
        +dxRow('Aztreonam','ok','Keine Kreuzreaktivität mit Penicillinen. Cave: Ceftazidim-/Cefiderocol-Allergie (gleiche Seitenkette).');
    }else{
      h+=dxRow('Penicilline','bad','Lebenslang meiden, keine Testexposition.')
        +dxRow('Cefazolin','bad','Nur nach allergologischer Abklärung.')
        +dxRow('Cefalexin / Cefadroxil','bad','Nur nach allergologischer Abklärung.')
        +dxRow('Andere Cephalosporine','bad','Nur nach allergologischer Abklärung.')
        +dxRow('Carbapeneme','bad','Nur nach allergologischer Abklärung.')
        +dxRow('Aztreonam','mid','Nicht-Beta-Laktam bevorzugen; nur nach Rücksprache.')
        +'<div class="dxnote">Alternativen je nach Erreger: Vancomycin, Daptomycin, Linezolid, Clindamycin, Fluorchinolone, TMP/SMX.</div>';
    }
    h+='<div class="dxnote">Im Zweifel Allergologie/Infektiologie — unnötige Beta-Laktam-Vermeidung ist mit mehr Wundinfekten und schlechterem Outcome assoziiert.</div></div>';
  }
  el.innerHTML=h;}
function renderSw(){var el=document.getElementById('dxSw');if(!el)return;
  var I=[['stab','Klinisch stabil, afebril seit ≥48 h'],['hd','Keine Sepsis, hämodynamisch stabil'],['focus','Fokuskontrolle erreicht (Débridement/Drainage erfolgt)'],
         ['abg','Erreger + Antibiogramm bekannt, orale Substanz wirksam'],['bio','Orale Substanz hoch bioverfügbar, gute Knochen-/Gewebegängigkeit'],
         ['gi','Orale Aufnahme und Resorption gesichert'],['ex','Keine S.-aureus-Bakteriämie, Endokarditis oder undrainierter Abszess'],['fu','Adhärenz und Nachsorge gesichert']];
  var h='<div class="dxq">Alle Punkte antippen, die erfüllt sind:</div><div class="dxchips dxcol">';
  var miss=[];
  I.forEach(function(i){var on=!!LG.sw[i[0]];if(!on)miss.push(i[1]);
    h+='<button class="dxchk'+(on?' on':'')+'" data-k="sw" data-v="'+i[0]+'" aria-pressed="'+on+'"><span class="dxbox">'+(on?'✓':'')+'</span>'+i[1]+'</button>';});
  h+='</div><div class="dxres">';
  if(!miss.length)h+='<div class="dxverdict" style="background:var(--ok)">Oraler Switch möglich</div><div class="dxnote">Früher Wechsel auf eine wirksame, gut bioverfügbare orale Substanz ist gleichwertig zur i.v.-Therapie (OVIVA, NEJM 2019).</div>';
  else h+='<div class="dxverdict" style="background:var(--mid)">Noch nicht — '+miss.length+' offen</div><ul class="blist dxmiss">'+miss.map(function(m){return '<li>'+m+'</li>';}).join('')+'</ul>';
  el.innerHTML=h+'</div>';}
function renderRen(){var el=document.getElementById('dxRen');if(!el)return;var R=LG.ren;
  var h='<div class="dxgrid">'
   +'<label>Alter<input class="dxin" inputmode="numeric" data-f="age" value="'+R.age+'" placeholder="Jahre"></label>'
   +'<label>Gewicht<input class="dxin" inputmode="decimal" data-f="kg" value="'+R.kg+'" placeholder="kg"></label>'
   +'<label>Kreatinin<input class="dxin" inputmode="decimal" data-f="scr" value="'+R.scr+'" placeholder="'+(R.unit==='mgdl'?'mg/dl':'µmol/l')+'"></label>'
   +'</div><div class="dxchips">'+dxChip('sex','m','männlich',R.sex==='m')+dxChip('sex','w','weiblich',R.sex==='w')
   +'<span class="dxsep"></span>'+dxChip('unit','mgdl','mg/dl',R.unit==='mgdl')+dxChip('unit','umol','µmol/l',R.unit==='umol')+'</div>'
   +'<div class="dxres" id="dxRenOut"></div>';
  el.innerHTML=h;renderRenOut();}
function renderRenOut(){var o=document.getElementById('dxRenOut');if(!o)return;var R=LG.ren;
  function num(x){return parseFloat(String(x).replace(',','.'));}
  var age=num(R.age),kg=num(R.kg),scr=num(R.scr);
  if(!(age>=18&&age<=110&&kg>=25&&kg<=300&&scr>0)){o.innerHTML='<div class="dxnote">Alter (18–110 J.), Gewicht (kg) und Serumkreatinin eingeben.</div>';return;}
  var mg=R.unit==='mgdl'?scr:scr/88.4;
  if(mg<0.1||mg>20){o.innerHTML='<div class="dxnote" style="color:var(--bad)">Kreatininwert unplausibel — Einheit prüfen.</div>';return;}
  var cl=(140-age)*kg/(72*mg)*(R.sex==='w'?0.85:1);cl=Math.round(cl);
  var st=cl>50?['&gt;50 ml/min','var(--ok)','Für die meisten Substanzen keine Anpassung.']:
         cl>=30?['30–50 ml/min','var(--mid)','Viele renal eliminierte Substanzen brauchen Intervall- oder Dosisanpassung.']:
         cl>=10?['10–29 ml/min','var(--bad)','Deutliche Anpassung nötig — Rücksprache Nephrologie/klinische Pharmakologie vor Therapiestart.']:
                ['&lt;10 ml/min','var(--bad)','Dosierung wie bei Dialyse — Nephrologie einbinden.'];
  var h='<div class="dxverdict" style="background:'+st[1]+'">CrCl ≈ '+cl+' ml/min · '+st[0]+'</div><div class="dxnote">'+st[2]+'</div>'
   +'<div class="dxnote"><b>Initialdosis nie reduzieren</b> — nur Erhaltungsdosis bzw. Intervall anpassen. Vancomycin und Aminoglykoside spiegelgesteuert (AUC/Talspiegel) dosieren.</div>'
   +'<div class="dxnote">Unzuverlässig bei akutem Nierenversagen (Kreatinin nicht im Steady State), Adipositas (tatsächliches Gewicht überschätzt), Kachexie und hohem Alter mit geringer Muskelmasse.</div>';
  if(typeof RENAL!=='undefined'&&RENAL.length)h+='<div class="dxq" style="margin-top:10px">Renal anzupassen (Datenbank):</div><div class="dxtags">'+RENAL.map(function(d){return '<span class="tag tag-ren">'+esc(d)+'</span>';}).join('')+'</div>';
  o.innerHTML=h;}
function renderMr(){var el=document.getElementById('dxMr');if(!el)return;var M=LG.mr;
  var G=[['ent','Enterobacterales'],['pae','P. aeruginosa'],['aci','A. baumannii']];
  var A=[['pip','Piperacillin'],['ceph','Cefotaxim/Ceftazidim (3./4. Gen.)'],['carb','Imipenem/Meropenem'],['fq','Ciprofloxacin']];
  var h='<div class="dxq">Erregergruppe</div><div class="dxchips">'+G.map(function(g){return dxChip('grp',g[0],g[1],M.grp===g[0]);}).join('')+'</div>'
   +'<div class="dxq">Im Antibiogramm <b>R</b> (resistent):</div><div class="dxchips dxcol">';
  A.forEach(function(x){var on=!!M.r[x[0]];h+='<button class="dxchk'+(on?' on':'')+'" data-k="mr" data-v="'+x[0]+'" aria-pressed="'+on+'"><span class="dxbox">'+(on?'✓':'')+'</span>'+x[1]+'</button>';});
  var cp=!!M.r.cp;
  h+='<button class="dxchk'+(cp?' on':'')+'" data-k="mr" data-v="cp" aria-pressed="'+cp+'"><span class="dxbox">'+(cp?'✓':'')+'</span>Carbapenemase nachgewiesen</button></div>';
  var r=M.r,n=['pip','ceph','carb','fq'].filter(function(k){return r[k];}).length,v,col,txt='';
  if(cp){v='4MRGN';col='var(--bad)';txt='Carbapenemase-Nachweis ⇒ 4MRGN, unabhängig vom Phänotyp. Meldepflichtig.';}
  else if(M.grp==='pae'){
    if(n===4){v='4MRGN';col='var(--bad)';}else if(n===3){v='3MRGN';col='var(--mid)';txt='Bei P. aeruginosa: beliebige 3 der 4 Gruppen resistent.';}else{v='kein 3/4MRGN';col='var(--ok)';}
  }else{
    if(n===4){v='4MRGN';col='var(--bad)';}
    else if(r.pip&&r.ceph&&r.fq&&!r.carb){v='3MRGN';col='var(--mid)';txt='Piperacillin, Cephalosporine und Ciprofloxacin resistent, Carbapenem noch wirksam.';}
    else if(r.carb){v='kein 3/4MRGN nach Definition';col='var(--mid)';txt='Carbapenem-Resistenz trotzdem hygiene- und meldepflichtrelevant — Carbapenemase-Testung veranlassen.';}
    else{v='kein 3/4MRGN';col='var(--ok)';}
  }
  h+='<div class="dxres"><div class="dxverdict" style="background:'+col+'">'+v+'</div>'+(txt?'<div class="dxnote">'+txt+'</div>':'')
   +'<div class="dxnote">Nur <b>R</b> zählt — <b>I</b> (sensibel bei erhöhter Exposition, EUCAST) gilt als sensibel. Isolierung nach lokaler Hygieneordnung.</div></div>';
  el.innerHTML=h;}

TOOLKEY.all=function(v){LG.all=LG.all===v?'':v;renderAll();};
TOOLKEY.sw=function(v){LG.sw[v]=!LG.sw[v];renderSw();};
TOOLKEY.sex=function(v){LG.ren.sex=v;renderRen();};
TOOLKEY.unit=function(v){if(LG.ren.unit!==v)LG.ren.scr='';LG.ren.unit=v;renderRen();};
TOOLKEY.grp=function(v){LG.mr.grp=v;renderMr();};
TOOLKEY.mr=function(v){LG.mr.r[v]=!LG.mr.r[v];renderMr();};
regTool({id:'allergie',grp:'med',t:'Beta-Laktam-Allergie',s:'Was darf ich geben?',c:'var(--warn)',dom:'dxAll',render:renderAll,
  ic:'<path d="M12 3l9 16H3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>'});
regTool({id:'switch',grp:'med',t:'Oraler Switch',s:'Checkliste',c:'var(--oral)',dom:'dxSw',render:renderSw,src:'OVIVA, NEJM 2019',
  ic:'<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M9.5 8.5l5 7"/>'});
regTool({id:'crcl',grp:'med',t:'Kreatinin-Clearance',s:'Cockcroft-Gault',c:'var(--alt)',dom:'dxRen',render:renderRen,
  oninput:function(t){LG.ren[t.getAttribute('data-f')]=t.value;renderRenOut();},
  ic:'<path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/>'});
regTool({id:'mrgn',grp:'med',t:'MRGN-Einstufung',s:'KRINKO',c:'var(--bad)',dom:'dxMr',render:renderMr,
  ic:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>'});
