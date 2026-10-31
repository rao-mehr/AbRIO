/* ---------- Einstellungen-Seite ---------- */
var SETOPT=[
  {k:'theme',t:'Darstellung',o:[['auto','Automatisch'],['light','Hell'],['dark','Dunkel']],h:'Automatisch folgt der Einstellung des Geräts.'},
  {k:'font',t:'Schriftgröße',o:[['1','Normal'],['1.1','Groß'],['1.2','Sehr groß']]},
  {k:'start',t:'Startseite',o:[['suche','Suche'],['tools','Tools']]},
  {k:'syn',t:'Standard-Syndrom beim Öffnen eines Erregers',o:[['PJI','PJI'],['FRI','FRI'],['SA','SA'],['SI','SI']]},
  {k:'vanco',t:'Vancomycin-Monitoring',o:[['auc','AUC 400–600'],['tal','Talspiegel 15–20']],h:'AUC: IDSA/ASHP 2020. Talspiegel: so in den PRO-IMPLANT Pocket Guides.'},
  {k:'ebjis',t:'PJI-Diagnose rechnen nach',o:[['orig','EBJIS 2021'],['pif','PIF v11 (modifiziert)']],h:'PIF v11: „wahrscheinlich“ schon ab 2 Kriterien, auch Klinik + CRP.'},
  {k:'unit',t:'Kreatinin-Einheit',o:[['mgdl','mg/dl'],['umol','µmol/l']]}
];
function settings(){LAST=settings;CURTOOL=null;setActiveTab('Einstellungen');go('#/einstellungen');
  var h='<div class="pg-h"><div class="pg-t">Einstellungen</div><div class="pg-s">Gespeichert auf diesem Gerät</div></div>';
  h+='<div class="acc setl">'+SETOPT.map(function(x){
    return '<div class="set-r"><div class="set-t">'+x.t+'</div>'+(x.h?'<div class="set-h">'+x.h+'</div>':'')
      +'<div class="syn set-seg">'+x.o.map(function(o){var on=String(SET[x.k])===o[0];return '<button class="stab'+(on?' on':'')+'" data-set="'+x.k+'" data-v="'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>';}).join('')+'</div></div>';}).join('')+'</div>';
  h+='<div class="recent-h tl-gh">Daten</div><div class="acc">'
    +'<button class="set-btn" data-clr="fav">Favoriten löschen <span>'+FAV.length+'</span></button>'
    +'<button class="set-btn" data-clr="rec">Verlauf löschen <span>'+RECENT.length+'</span></button>'
    +'<button class="set-btn" data-clr="all">Alle Einstellungen zurücksetzen</button></div>'
    +'<div class="tl-foot">Version {{VERSION}} · Copyright, Datengrundlage und Evidenz unter <button class="lnk" id="toInfo2">Info</button>.</div>';
  var v=document.getElementById('view');v.innerHTML=h;window.scrollTo(0,0);
  v.querySelectorAll('[data-set]').forEach(function(b){b.addEventListener('click',function(){
    var k=b.dataset.set;SET[k]=b.dataset.v;saveSet();
    if(k==='theme')setTheme(effTheme());if(k==='font')applyFont();if(k==='unit'){LG.ren.unit=SET.unit;LG.ren.scr='';}
    settings();});});
  v.querySelectorAll('[data-clr]').forEach(function(b){b.addEventListener('click',function(){var c=b.dataset.clr;
    if(c==='fav'){FAV=[];try{localStorage.setItem('ari_fav','[]');}catch(e){}}
    else if(c==='rec'){RECENT=[];try{localStorage.setItem('ari_recent','[]');}catch(e){}}
    else{for(var k in SETDEF)SET[k]=SETDEF[k];saveSet();applyFont();setTheme(effTheme());LG.ren.unit=SET.unit;}
    b.textContent='Erledigt';setTimeout(settings,600);});});
  var ti=document.getElementById('toInfo2');if(ti)ti.addEventListener('click',info);
}
LG.ren.unit=SET.unit;
